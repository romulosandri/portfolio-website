import { useEffect, useRef } from 'react'
import { gsap, useGSAP } from '../motion-system/gsap'
import { pauseSmoothScroll, resumeSmoothScroll } from '../motion-system/smoothScroll'
import { GameButton } from './GameButton'
import { NavItem } from './NavItem'

export const NAV_MENU_ID = 'site-nav-menu'

export type NavMenuItem = {
  href: string
  label: string
  match: (path: string) => boolean
}

type NavMenuProps = {
  items: NavMenuItem[]
  open: boolean
  pathname: string
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled])'

/**
 * Full-screen navigation for viewports below the nav breakpoint.
 *
 * Returns null when closed rather than staying mounted and hidden, so
 * scripts/prerender.mjs never serialises a second copy of the nav links -- a
 * crawler reading the raw HTML would otherwise see every route twice.
 */
export function NavMenu({ items, open, pathname, onClose }: NavMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  /**
   * Closing on navigation is what makes the links usable at all: the router
   * handles clicks in place, so without this the overlay would sit on top of the
   * page it just navigated to.
   *
   * Driven by `popstate`, which `navigate()` in src/lib/router.ts dispatches on
   * every in-app navigation, rather than by the `pathname` prop. Routes into
   * /work and /projects animate through PanelTransition, and App deliberately
   * keeps feeding the nav the *previous* pathname until that finishes -- so
   * waiting on the prop would leave the menu open for the whole ~1s transition.
   * The prop is still watched below as a fallback.
   */
  useEffect(() => {
    if (!open) return
    const close = () => onCloseRef.current()
    window.addEventListener('popstate', close)
    return () => window.removeEventListener('popstate', close)
  }, [open])

  const lastPathRef = useRef(pathname)
  useEffect(() => {
    if (lastPathRef.current === pathname) return
    lastPathRef.current = pathname
    onCloseRef.current()
  }, [pathname])

  useEffect(() => {
    if (!open) return

    // pauseSmoothScroll only stops Lenis, and Lenis is not even mounted on touch
    // devices, so the document itself has to be locked too or the page keeps
    // scrolling unseen behind the overlay. Same approach as PanelTransition,
    // including replacing the width the hidden scrollbar frees up.
    pauseSmoothScroll()
    const root = document.documentElement
    const widthBeforeLock = root.clientWidth
    root.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const released = root.clientWidth - widthBeforeLock
    if (released > 0) root.style.paddingRight = `${released}px`

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      const active = document.activeElement

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      root.style.overflow = ''
      document.body.style.overflow = ''
      root.style.paddingRight = ''
      resumeSmoothScroll()
      previous?.focus()
    }
  }, [open])

  useGSAP(
    () => {
      const root = rootRef.current
      const panel = panelRef.current
      if (!root || !panel) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // Matches PanelTransition: the panel slides up over the page on the same
      // curve, so opening the menu reads as the same gesture as a route change.
      //
      // `opacity`, not `autoAlpha`: autoAlpha would set visibility:hidden for
      // the first frames, and a hidden element cannot take focus, so the
      // initial focus() below would silently do nothing.
      gsap.from(panel, { yPercent: 100, duration: 0.62, ease: 'power3.inOut' })
      gsap.from(root, { opacity: 0, duration: 0.24, ease: 'power2.out' })
    },
    { scope: rootRef, dependencies: [open] },
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden nav:hidden"
      id={NAV_MENU_ID}
      ref={rootRef}
    >
      <div
        aria-label="Site"
        aria-modal="true"
        className="flex size-full flex-col justify-between bg-background-secondary px-gutter pt-(--site-nav-height,72px) pb-4xl will-change-transform"
        ref={panelRef}
        role="dialog"
      >
        <nav aria-label="Primary" className="flex flex-col items-start gap-3xl pt-4xl">
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.label}
              label={item.label}
              selected={item.match(pathname)}
              size="lg"
            />
          ))}
        </nav>
        <GameButton href="/game" onClick={onClose} size="lg" />
      </div>
    </div>
  )
}

type NavMenuToggleProps = {
  open: boolean
  onToggle: () => void
}

/**
 * Two bars that cross into an X. Kept as spans with transforms rather than two
 * swapped icons so the state change animates without a second asset.
 */
export function NavMenuToggle({ open, onToggle }: NavMenuToggleProps) {
  return (
    <button
      aria-controls={NAV_MENU_ID}
      aria-expanded={open}
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="-mr-md inline-flex size-11 shrink-0 items-center justify-center nav:hidden"
      onClick={onToggle}
      type="button"
    >
      <span className="relative block h-3.5 w-[24px]">
        <span
          className={[
            'absolute left-0 block h-[1.5px] w-full bg-foreground-primary transition-transform duration-300 ease-out',
            open ? 'top-1/2 rotate-45' : 'top-0',
          ].join(' ')}
        />
        <span
          className={[
            'absolute left-0 block h-[1.5px] w-full bg-foreground-primary transition-transform duration-300 ease-out',
            open ? 'top-1/2 -rotate-45' : 'top-full',
          ].join(' ')}
        />
      </span>
    </button>
  )
}
