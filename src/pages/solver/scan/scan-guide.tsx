/**
 * The scan guide: a dialog with two short animations, one for a laptop and
 * one for a phone, showing how to hold the cube and when to turn it. The
 * animations are GIFs recorded from the drawings in `scripts/scan-guide`.
 */
import { CircleHelp } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { useM } from '#/i18n'

/** The recorded animation for a device, in the light or dark version that matches the page. */
function GuidePicture({ device, label }: { device: 'laptop' | 'phone'; label: string }) {
  // The dialog only exists in the browser, so the page's theme can be read directly.
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  return (
    <img
      src={`/scan-guide/${device}-${theme}.gif`}
      alt={label}
      width={520}
      height={360}
      className="h-auto w-full rounded-lg"
    />
  )
}

/** The "How to scan" button and the guide it opens. */
export function ScanGuide({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const text = useM().solver.scan.guide
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <CircleHelp />
          {text.open}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.intro}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['laptop', 'phone'] as const).map((device) => (
            <section key={device} className="space-y-2">
              <div className="overflow-hidden rounded-xl border">
                <GuidePicture device={device} label={text[device].picture} />
              </div>
              <h3 className="text-sm font-semibold">{text[device].title}</h3>
              <p className="text-sm text-muted-foreground">{text[device].hold}</p>
            </section>
          ))}
        </div>
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">{text.stepsTitle}</h3>
          <ol className="grid list-inside list-decimal gap-x-6 gap-y-1 text-sm text-muted-foreground sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3">
            {text.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        <p className="text-sm text-muted-foreground">{text.light}</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button>{text.close}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
