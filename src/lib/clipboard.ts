/**
 * Puts text on the clipboard and says whether it worked. It never throws:
 * where the browser has no clipboard, or refuses it, the older way of copying
 * from a hidden text box is tried before giving up.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Refused, as on a page that is not secure: try the older way.
  }
  return copyFromTextBox(text)
}

function copyFromTextBox(text: string): boolean {
  if (typeof document === 'undefined') return false
  const box = document.createElement('textarea')
  box.value = text
  box.setAttribute('readonly', '')
  box.style.position = 'fixed'
  box.style.opacity = '0'
  document.body.append(box)
  try {
    box.select()
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    box.remove()
  }
}
