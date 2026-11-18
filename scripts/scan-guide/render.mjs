// Records the scan-guide drawings as GIFs: plays `drawing.tsx` in headless
// Chrome one frame at a time, then joins the frames with ffmpeg.
// Run from the project folder: node scripts/scan-guide/render.mjs
// Needs google-chrome and ffmpeg.
import { execFileSync, spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const FPS = 10
const SCALE = 2 // 520 × 360 pictures
const PORT = 9341
const OUT = 'public/scan-guide'
/** The dialog's background and text colour in each theme. */
const THEMES = { light: { paper: '#ffffff', ink: '#171717' }, dark: { paper: '#171717', ink: '#fafafa' } }

const vite = await createServer({
  configFile: false,
  resolve: { tsconfigPaths: true },
  server: { middlewareMode: true, ws: false },
  appType: 'custom',
  logLevel: 'error',
})
const { ALL_S, ANIMATION, HEIGHT, Scene, WIDTH } = await vite.ssrLoadModule('/scripts/scan-guide/drawing.tsx')
const width = WIDTH * SCALE
const height = HEIGHT * SCALE
const page = (device, { paper, ink }) => `<!doctype html><html><head><style>${ANIMATION}
html, body { margin: 0; background: ${paper}; color: ${ink}; --paper: ${paper}; font-family: system-ui, sans-serif; }
#box { width: ${width}px; }</style></head><body><div id="box">${renderToStaticMarkup(createElement(Scene, { device }))}</div></body></html>`

const work = mkdtempSync(join(tmpdir(), 'scan-guide-'))
const chrome = spawn(
  'google-chrome',
  ['--headless=new', '--no-first-run', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(work, 'profile')}`, 'about:blank'],
  { stdio: 'ignore' },
)

try {
  let target
  for (let attempt = 0; !target; attempt++) {
    await new Promise((done) => setTimeout(done, 300))
    try {
      target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()
    } catch (error) {
      if (attempt > 40) throw error
    }
  }
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((done) => (socket.onopen = done))
  let id = 0
  const waiting = new Map()
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    waiting.get(message.id)?.(message.result)
    waiting.delete(message.id)
  }
  const send = (method, params = {}) =>
    new Promise((done) => {
      waiting.set(++id, done)
      socket.send(JSON.stringify({ id, method, params }))
    })

  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
  const { frameTree } = await send('Page.getFrameTree')
  mkdirSync(OUT, { recursive: true })

  for (const device of ['laptop', 'phone']) {
    for (const [theme, colours] of Object.entries(THEMES)) {
      const frames = join(work, `${device}-${theme}`)
      mkdirSync(frames)
      await send('Page.setDocumentContent', { frameId: frameTree.frame.id, html: page(device, colours) })
      const count = Math.round(ALL_S * FPS)
      for (let frame = 0; frame < count; frame++) {
        await send('Runtime.evaluate', {
          expression: `for (const a of document.getAnimations()) { a.pause(); a.currentTime = ${(frame / FPS) * 1000} }`,
        })
        const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width, height, scale: 1 } })
        writeFileSync(join(frames, `${String(frame).padStart(4, '0')}.png`), Buffer.from(shot.data, 'base64'))
      }
      const gif = join(OUT, `${device}-${theme}.gif`)
      execFileSync('ffmpeg', [
        '-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(frames, '%04d.png'),
        '-vf', 'split[a][b];[a]palettegen=max_colors=48:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle',
        '-loop', '0', gif,
      ])
      console.log(gif)
    }
  }
  socket.close()
} finally {
  chrome.kill()
  await vite.close()
  rmSync(work, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 })
}
