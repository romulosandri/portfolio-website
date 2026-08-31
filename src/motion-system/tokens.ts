// Site motion scale. Reveal uses the entrance tier; hover and page
// transitions keep their own values until they adopt these tokens.
export const MOTION = {
  ease: {
    out: 'power3.out',
    inOut: 'power3.inOut',
  },
  duration: {
    micro: 0.2,
    interactive: 0.45,
    entrance: 0.85,
    scene: 1.02,
  },
  stagger: {
    char: 0.04,
    wordAmount: 0.4,
    block: 0.18,
  },
} as const

export const REVEAL = {
  ease: MOTION.ease.out,
  blockStagger: MOTION.stagger.block,
  triggerStart: 'top 85%',
  roll: {
    duration: MOTION.duration.entrance,
    stagger: { each: MOTION.stagger.char },
    fromYPercent: 50,
    toYPercent: 0,
  },
  blur: {
    duration: MOTION.duration.entrance,
    stagger: { amount: MOTION.stagger.wordAmount },
    blur: '16px',
  },
  line: {
    duration: MOTION.duration.entrance,
    fromClip: 'inset(0 100% 0 0)',
    toClip: 'inset(0 0% 0 0)',
  },
  rise: {
    duration: MOTION.duration.entrance,
    fromY: 28,
  },
  bodyDelay: MOTION.stagger.block,
} as const

export type RevealVariant = 'roll' | 'blur' | 'line' | 'rise'

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isFrozenPanel(node: Element) {
  return Boolean(node.closest('[data-panel-transition]'))
}

export function isRevealInView(node: Element) {
  const rect = node.getBoundingClientRect()
  return rect.top < window.innerHeight * 0.85 && rect.bottom > 0
}
