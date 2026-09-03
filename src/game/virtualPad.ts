export type PadDir = 'up' | 'down' | 'left' | 'right'

const pad: Record<PadDir, boolean> = {
  up: false,
  down: false,
  left: false,
  right: false,
}

export function setVirtualPad(dir: PadDir, down: boolean) {
  pad[dir] = down
}

export function getVirtualPad() {
  return pad
}

export function clearVirtualPad() {
  pad.up = false
  pad.down = false
  pad.left = false
  pad.right = false
}
