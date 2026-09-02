/**
 * Sizing data for the `text-display` utility.
 *
 * `text-display` sets `font-size: min(var(--text-d), 100cqi / var(--display-ratio))`,
 * so it needs to know how wide a given string is in ems before it is rendered.
 * That number is computed here and passed in as a CSS variable.
 *
 * Measuring in the browser instead would mean a layout read on mount, which
 * lands after paint and after scripts/prerender.mjs has already serialised the
 * DOM -- the headings would ship at the wrong size and then jump.
 *
 * ADVANCE holds the advance width of each glyph in Season Serif (the family
 * behind --font-heading) as a fraction of the font size, measured with a canvas
 * at 2000px. Summing per glyph is exact rather than approximate here, because
 * RollingChars in src/motion-system/Reveal.tsx renders every character as its
 * own inline-block under `[font-kerning:none]`, so no kerning pair ever applies.
 */

const ADVANCE: Record<string, number> = {
  ' ': 0.21,
  '!': 0.235,
  '"': 0.299,
  '#': 0.656,
  $: 0.541,
  '%': 0.806,
  '&': 0.666,
  "'": 0.149,
  '(': 0.266,
  ')': 0.266,
  '*': 0.459,
  '+': 0.532,
  ',': 0.181,
  '-': 0.358,
  '.': 0.194,
  '/': 0.342,
  '0': 0.633,
  '1': 0.324,
  '2': 0.543,
  '3': 0.548,
  '4': 0.618,
  '5': 0.553,
  '6': 0.601,
  '7': 0.539,
  '8': 0.593,
  '9': 0.6,
  ':': 0.204,
  ';': 0.207,
  '<': 0.539,
  '=': 0.53,
  '>': 0.539,
  '?': 0.469,
  '@': 0.93,
  A: 0.726,
  B: 0.663,
  C: 0.694,
  D: 0.722,
  E: 0.593,
  F: 0.56,
  G: 0.747,
  H: 0.776,
  I: 0.325,
  J: 0.532,
  K: 0.693,
  L: 0.56,
  M: 0.923,
  N: 0.711,
  O: 0.778,
  P: 0.641,
  Q: 0.778,
  R: 0.681,
  S: 0.543,
  T: 0.61,
  U: 0.719,
  V: 0.694,
  W: 1.088,
  X: 0.666,
  Y: 0.7,
  Z: 0.552,
  a: 0.507,
  b: 0.571,
  c: 0.514,
  d: 0.584,
  e: 0.521,
  f: 0.322,
  g: 0.521,
  h: 0.569,
  i: 0.254,
  j: 0.231,
  k: 0.556,
  l: 0.248,
  m: 0.864,
  n: 0.575,
  o: 0.564,
  p: 0.583,
  q: 0.571,
  r: 0.352,
  s: 0.439,
  t: 0.317,
  u: 0.568,
  v: 0.52,
  w: 0.806,
  x: 0.508,
  y: 0.526,
  z: 0.479,
  â: 0.507,
  ç: 0.514,
  é: 0.521,
  í: 0.254,
  ô: 0.564,
  ú: 0.568,
}

/** Unknown glyph. Wider than every lowercase letter, so it errs toward small. */
const FALLBACK_ADVANCE = 0.6

/**
 * RollingChars puts `gap-x-[0.3em]` between words rather than the font's own
 * 0.21em space advance, so a measured string is wider than the font metrics
 * alone predict.
 */
const ROLL_SPACE_ADVANCE = 0.3

function segmentWidth(segment: string, spaceAdvance: number) {
  let total = 0
  for (const char of segment) {
    if (char === ' ') total += spaceAdvance
    else total += ADVANCE[char] ?? FALLBACK_ADVANCE
  }
  return total
}

type DisplayRatioOptions = {
  /**
   * Whether the heading is allowed to break at spaces. When true the font is
   * sized to the longer of the longest word (so a word never overflows) and
   * half the unwrapped line (so a run of short words wraps to about two lines
   * instead of stacking every word at display size). When false the whole
   * line has to fit.
   */
  wrap?: boolean
}

/**
 * The width of the longest unbreakable run in `text`, in ems.
 *
 * Explicit `\n` is always a hard break. Rounded up to 2dp so the inline style
 * stays short and always errs toward a slightly smaller font.
 */
export function displayRatio(text: string, { wrap = true }: DisplayRatioOptions = {}) {
  const lines = text.split('\n')
  let widest = 0

  for (const line of lines) {
    if (!wrap) {
      widest = Math.max(widest, segmentWidth(line, ROLL_SPACE_ADVANCE))
      continue
    }

    const words = line.split(/\s+/).filter(Boolean)
    let longestWord = 0
    for (const word of words) {
      longestWord = Math.max(longestWord, segmentWidth(word, ROLL_SPACE_ADVANCE))
    }
    const unwrapped = segmentWidth(line, ROLL_SPACE_ADVANCE)
    widest = Math.max(widest, longestWord, unwrapped / 2)
  }

  return Math.ceil(widest * 100) / 100
}

/**
 * Inline style for a `text-display` heading. Spread onto the element so the
 * ratio ships in the HTML that prerender serialises.
 */
export function displayFitStyle(text: string, options?: DisplayRatioOptions) {
  return { '--display-ratio': displayRatio(text, options) } as React.CSSProperties
}
