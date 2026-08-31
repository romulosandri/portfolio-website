export function toPngSrc(src: string) {
  return src.replace(/\/avif\//, '/png/').replace(/\.avif$/i, '.png')
}
