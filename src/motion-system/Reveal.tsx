import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from './gsap'
import {
  isFrozenPanel,
  isRevealInView,
  prefersReducedMotion,
  REVEAL,
  revealScroller,
  type RevealVariant,
} from './tokens'

type RevealItem = {
  id: string
  blockId: string
  variant: RevealVariant
  getTargets: () => HTMLElement[]
  markPlayed: () => void
}

type RevealGroupApi = {
  register: (item: RevealItem) => () => void
}

const RevealGroupContext = createContext<RevealGroupApi | null>(null)
const RevealBlockContext = createContext<string | null>(null)

function groupItems(items: RevealItem[]) {
  const blocks: RevealItem[][] = []
  const indexByBlock = new Map<string, number>()

  for (const item of items) {
    const existing = indexByBlock.get(item.blockId)
    if (existing === undefined) {
      indexByBlock.set(item.blockId, blocks.length)
      blocks.push([item])
    } else {
      blocks[existing]?.push(item)
    }
  }

  return blocks
}

function connectedTargets(item: RevealItem) {
  return item.getTargets().filter((target) => target.isConnected)
}

function hiddenVars(variant: RevealVariant): gsap.TweenVars {
  if (variant === 'roll') {
    return { yPercent: REVEAL.roll.fromYPercent }
  }
  if (variant === 'line') {
    return { clipPath: REVEAL.line.fromClip }
  }
  return { autoAlpha: 0, filter: `blur(${REVEAL.blur.blur})` }
}

function shownVars(variant: RevealVariant): gsap.TweenVars {
  if (variant === 'roll') {
    return {
      yPercent: REVEAL.roll.toYPercent,
      duration: REVEAL.roll.duration,
      ease: REVEAL.ease,
      stagger: { ...REVEAL.roll.stagger },
    }
  }
  if (variant === 'line') {
    return {
      clipPath: REVEAL.line.toClip,
      duration: REVEAL.line.duration,
      ease: REVEAL.ease,
    }
  }
  return {
    autoAlpha: 1,
    filter: 'blur(0px)',
    duration: REVEAL.blur.duration,
    ease: REVEAL.ease,
    stagger: { ...REVEAL.blur.stagger },
  }
}

function setTargets(targets: HTMLElement[], vars: gsap.TweenVars) {
  if (targets.length === 0) return
  gsap.set(targets, vars)
}

function playBlocks(items: RevealItem[]) {
  items.forEach((item) => item.markPlayed())

  const timeline = gsap.timeline()
  groupItems(items).forEach((block, index) => {
    const at = index * REVEAL.blockStagger
    for (const item of block) {
      const targets = connectedTargets(item)
      if (targets.length === 0) continue
      timeline.fromTo(targets, hiddenVars(item.variant), { ...shownVars(item.variant), immediateRender: false }, at)
    }
  })

  return timeline
}

function armTrigger(root: Element, play: () => void) {
  if (isRevealInView(root)) {
    play()
    return
  }

  ScrollTrigger.create({
    trigger: root,
    scroller: revealScroller(root),
    start: REVEAL.triggerStart,
    once: true,
    onEnter: play,
  })
}

type RevealGroupProps = {
  children: ReactNode
  className?: string
}

export function RevealGroup({ children, className }: RevealGroupProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<RevealItem[]>([])

  const register = useCallback((item: RevealItem) => {
    itemsRef.current = [...itemsRef.current, item]
    return () => {
      itemsRef.current = itemsRef.current.filter((entry) => entry.id !== item.id)
    }
  }, [])

  const api = useMemo(() => ({ register }), [register])

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const items = itemsRef.current
      if (items.length === 0) return

      if (prefersReducedMotion()) {
        items.forEach((item) => {
          setTargets(connectedTargets(item), shownVars(item.variant))
          item.markPlayed()
        })
        return
      }

      if (isFrozenPanel(root)) {
        items.forEach((item) => {
          setTargets(connectedTargets(item), hiddenVars(item.variant))
        })
        return
      }

      let played = false
      armTrigger(root, () => {
        if (played) return
        played = true
        playBlocks(items)
      })
    },
    { scope: rootRef },
  )

  return (
    <RevealGroupContext.Provider value={api}>
      <div className={className} data-reveal-group="" ref={rootRef}>
        {children}
      </div>
    </RevealGroupContext.Provider>
  )
}

type RevealBlockProps = {
  children: ReactNode
}

export function RevealBlock({ children }: RevealBlockProps) {
  const id = useId()
  return <RevealBlockContext.Provider value={id}>{children}</RevealBlockContext.Provider>
}

type RevealLineProps = {
  dashed?: boolean
  className?: string
}

export function RevealLine({ dashed = false, className }: RevealLineProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const group = useContext(RevealGroupContext)
  const parentBlockId = useContext(RevealBlockContext)
  const fallbackBlockId = useId()
  const itemId = useId()
  const blockId = parentBlockId ?? fallbackBlockId
  const playedRef = useRef(false)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      playedRef.current = false

      const getTargets = () => (root.isConnected ? [root] : [])
      setTargets(
        getTargets(),
        prefersReducedMotion() || playedRef.current ? shownVars('line') : hiddenVars('line'),
      )

      const item: RevealItem = {
        id: itemId,
        blockId,
        variant: 'line',
        getTargets,
        markPlayed: () => {
          playedRef.current = true
        },
      }

      if (group) {
        return group.register(item)
      }

      if (prefersReducedMotion()) {
        setTargets(getTargets(), shownVars('line'))
        playedRef.current = true
        return
      }

      if (isFrozenPanel(root)) {
        setTargets(getTargets(), hiddenVars('line'))
        return
      }

      let played = false
      armTrigger(root, () => {
        if (played) return
        played = true
        playBlocks([item])
      })
    },
    { scope: rootRef, dependencies: [group, blockId, itemId], revertOnUpdate: true },
  )

  return (
    <div
      aria-hidden
      className={[
        'h-px w-full will-change-[clip-path]',
        dashed
          ? 'border-t border-dashed border-stroke-secondary'
          : 'border-t border-solid border-stroke-secondary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-reveal="line"
      ref={rootRef}
    />
  )
}

type RevealTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'dt' | 'dd' | 'li'

type RevealTextProps = {
  children: string
  as?: RevealTag
  variant?: RevealVariant
  className?: string
  /**
   * Overrides the screen-reader and crawler-visible text for `roll` headings,
   * where the visible glyphs are per-character and aria-hidden. Use when the
   * displayed wording is shorter than what the heading should actually say.
   */
  srText?: string
  /** Carries `--display-ratio` for `text-display` headings. */
  style?: CSSProperties
  /**
   * Centers each rendered line of a `roll` heading. Only meaningful for
   * headings long enough to wrap.
   */
  centerLines?: boolean
}

function headingVariant(tag: RevealTag, variant?: RevealVariant): RevealVariant {
  if (variant) return variant
  return tag === 'h1' || tag === 'h2' || tag === 'h3' ? 'roll' : 'blur'
}

function rollingChar(char: string, key: string) {
  const glyph = char === ' ' ? '\u00A0' : char
  const spaceClass = char === ' ' ? 'w-[0.3em]' : undefined

  return createElement(
    'span',
    {
      className: ['relative inline-block h-[1lh]', spaceClass].filter(Boolean).join(' '),
      key,
    },
    createElement('span', { className: 'invisible' }, glyph),
    createElement(
      'span',
      {
        className: 'absolute inset-x-0 top-1/2 h-[1.5em] -translate-y-1/2 overflow-hidden',
      },
      createElement(
        'span',
        {
          className: 'flex h-[3em] flex-col will-change-transform',
          'data-reveal-roll': '',
        },
        createElement('span', { className: 'flex h-[1.5em] shrink-0 items-center justify-center' }, glyph),
        createElement('span', { className: 'flex h-[1.5em] shrink-0 items-center justify-center' }, glyph),
      ),
    ),
  )
}

/**
 * Words only. Spacing between them is `gap-x-[0.3em]` on the line, matching
 * `ROLL_SPACE_ADVANCE` in src/lib/displayFit.ts. Space glyphs as flex items
 * would wrap onto the next line and shove the following word down — that is
 * what stacked "How I use AI" into three giant lines on a phone.
 */
function wordsIn(line: string) {
  return line.split(/\s+/).filter(Boolean)
}

/**
 * One absolutely-positioned copy of each glyph per character, so every letter
 * can roll independently.
 *
 * Characters are grouped into words and the line is `flex-wrap`, which is what
 * lets a long display title break at a space instead of being scaled down until
 * the whole thing fits on one line. Flex only ever breaks between items, so the
 * grouping is what stops it breaking mid-word. A line that does not need to wrap
 * renders as a single row exactly as before.
 *
 * `centerLines` centers each row. It is off by default because a flex line box
 * reports its *unwrapped* width as max-content, so a heading that wraps is
 * stretched to the full container and its rows would otherwise sit against the
 * left edge with all the slack on the right.
 */
function RollingChars({ text, centerLines }: { text: string; centerLines?: boolean }) {
  const lines = text.split('\n')

  return createElement(
    'span',
    { 'aria-hidden': true, className: 'inline-flex flex-col [font-kerning:none]' },
    ...lines.map((line, lineIndex) =>
      createElement(
        'span',
        {
          className: [
            'inline-flex min-h-[1lh] flex-wrap items-baseline gap-x-[0.3em]',
            centerLines ? 'justify-center' : '',
          ]
            .filter(Boolean)
            .join(' '),
          key: `line-${lineIndex}`,
        },
        ...wordsIn(line).map((word, wordIndex) =>
          createElement(
            'span',
            {
              className: 'inline-flex items-baseline',
              key: `word-${lineIndex}-${wordIndex}`,
            },
            ...Array.from(word).map((char, charIndex) =>
              rollingChar(char, `char-${lineIndex}-${wordIndex}-${charIndex}`),
            ),
          ),
        ),
      ),
    ),
  )
}

export function RevealText({
  children,
  as: tag = 'p',
  variant: variantProp,
  className,
  srText,
  style,
  centerLines,
}: RevealTextProps) {
  const rootRef = useRef<HTMLElement>(null)
  const group = useContext(RevealGroupContext)
  const parentBlockId = useContext(RevealBlockContext)
  const fallbackBlockId = useId()
  const itemId = useId()
  const blockId = parentBlockId ?? fallbackBlockId
  const variant = headingVariant(tag, variantProp)
  const playedRef = useRef(false)
  const splitRef = useRef<SplitText | null>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      playedRef.current = false

      const applyState = (targets: HTMLElement[]) => {
        setTargets(
          targets.filter((target) => target.isConnected),
          prefersReducedMotion() || playedRef.current ? shownVars(variant) : hiddenVars(variant),
        )
      }

      let getTargets = (): HTMLElement[] => []

      if (variant === 'roll') {
        getTargets = () => gsap.utils.toArray<HTMLElement>('[data-reveal-roll]', root)
        applyState(getTargets())
      } else {
        const split = SplitText.create(root, {
          type: 'words',
          autoSplit: true,
          aria: 'auto',
          tag: 'span',
          onSplit(self) {
            applyState(self.words as HTMLElement[])
          },
        })
        splitRef.current = split
        getTargets = () => (splitRef.current?.words ?? []) as HTMLElement[]
      }

      const item: RevealItem = {
        id: itemId,
        blockId,
        variant,
        getTargets,
        markPlayed: () => {
          playedRef.current = true
        },
      }

      if (group) {
        return group.register(item)
      }

      if (prefersReducedMotion()) {
        applyState(getTargets())
        playedRef.current = true
        return
      }

      if (isFrozenPanel(root)) {
        applyState(getTargets())
        return
      }

      let played = false
      armTrigger(root, () => {
        if (played) return
        played = true
        playBlocks([item])
      })
    },
    { scope: rootRef, dependencies: [children, group, blockId, itemId, variant], revertOnUpdate: true },
  )

  if (variant === 'roll') {
    return createElement(
      tag,
      { className, 'data-reveal': 'roll', ref: rootRef, style },
      createElement('span', { className: 'sr-only' }, srText ?? children),
      createElement(RollingChars, { centerLines, text: children }),
    )
  }

  const nodes = children.split('\n').flatMap((line, index, lines) =>
    index < lines.length - 1
      ? [line, createElement('br', { key: `br-${index}` })]
      : [line],
  )

  return createElement(tag, { className, 'data-reveal': 'blur', ref: rootRef, style }, ...nodes)
}
