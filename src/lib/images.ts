/** Map a display AVIF to its on-disk PNG twin. For OG / JSON-LD only — do not send PNG to <img>. */
export function toPngSrc(src: string) {
  return src.replace(/\/avif\//, '/png/').replace(/\.avif$/i, '.png')
}
