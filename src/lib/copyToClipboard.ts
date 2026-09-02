function copyWithExecCommand(value: string) {
  const field = document.createElement('textarea')
  field.value = value
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.top = '0'
  field.style.left = '0'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.focus()
  field.select()
  field.setSelectionRange(0, value.length)

  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }

  field.remove()
  return copied
}

export async function copyToClipboard(value: string) {
  if (copyWithExecCommand(value)) return true

  if (!navigator.clipboard?.writeText) return false

  try {
    await Promise.race([
      navigator.clipboard.writeText(value),
      new Promise<never>((_, reject) => {
        window.setTimeout(() => reject(new Error('Clipboard timed out')), 800)
      }),
    ])
    return true
  } catch {
    return false
  }
}
