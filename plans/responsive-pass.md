# Responsive pass

Written 2 Sep 2026. Companion to section 2 of `plans/website-completion-checklist.md`.

**Goal.** Make the site work from 375px up by converting the type and layout scale to fluid tokens, adding an auto-fitting display-type rule that solves the home hero and every case-study hero at once, and replacing the header with a compact mark plus a full-screen overlay menu below 1120px.

**Decisions taken.** Faithful scale-down (same composition everywhere, fluid type and spacing, decorative motion kept but scaled and lightened — no mobile-specific screens except the nav). Header collapses to a hamburger and full-screen overlay menu.

---

## Approach

Faithful scale-down, driven by CSS. Two rules govern everything:

- **No JS layout branching.** `scripts/prerender.mjs` renders every route at a fixed `viewport: { width: 1440, height: 900 }` (line 71). Anything decided in React state ships the desktop branch in the HTML and flashes on a phone. JavaScript is only for behaviour (opening the menu).
- **Fix it in the token, not the component.** `@theme` in `src/index.css` already centralises the type and spacing scale, and every page uses it (`px-4xl`, `gap-3xl`, `text-display`). Making a handful of tokens fluid fixes most pages before a single breakpoint class is written.

---

## The two hard parts

**Home hero — one number, not a layout change.** The hero in `src/pages/HomePage.tsx` is already a centered `flex-col` with `w-full`; nothing reflows. It breaks only because `--text-d: 180px` makes "Designer" ~780px wide and the vertical stack ~740px inside an `h-svh` of ~664px. A container-query-capped font size fixes both, and the same rule fixes `DisplayHero` on Work, Projects, and case studies.

**Header — the wordmark, not the links.** `NameLogo` is 12 SVG letter images (blueprint pins it at 337×20) and its width *changes on a timer*: `src/design-system/NameLogo.tsx` reswaps a random letter every 1200ms across styles whose widths vary a lot (`i` is 2–10px, `r` is 9–27px). Real minimum row width:

| Piece | Width |
| --- | --- |
| `NameLogo` | 337px |
| `GameButton` | ~140px |
| Four nav items | ~242px |
| Four `gap-3xl` | 128px |
| `px-4xl` both sides | 96px |
| **Total** | **~943px** |

So it hard-overflows near 950px and looks cramped from ~1150px. This is the one place that needs new markup.

---

## 1. Tokens and breakpoints — `src/index.css`

Add named breakpoints to `@theme`, tuned to this design rather than Tailwind's defaults (there are zero breakpoint classes today, so redefining is free):

```css
--breakpoint-xs: 480px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-nav: 1120px;  /* full nav row stops fitting */
--breakpoint-xl: 1440px;   /* Figma desktop */
```

Make **layout** spacing fluid, and leave **component-internal** spacing fixed:

```css
--spacing-3xl: clamp(20px, 2.2vw, 32px);
--spacing-4xl: clamp(24px, 3.3vw, 48px);
--text-4xl: clamp(36px, 4.4vw, 64px);  /* text-h1 */
--text-3xl: clamp(24px, 2.5vw, 36px);  /* text-h2 */
```

Do **not** touch `--spacing-2xs` through `--spacing-2xl`. `src/design-system/NavItem.tsx` hardcodes `SLOT_WIDTH = SYMBOL_SIZE + SYMBOL_GAP` (= 20) in JS and animates `width: 20` to match `w-1xl`; making those fluid silently desyncs the symbol reveal. Body sizes (12/14/16px) also stay fixed — shrinking them hurts readability, not layout.

---

## 2. Auto-fitting display type

Redefine the `text-display` utility so it can never exceed its container:

```css
@utility text-display {
  font-family: var(--font-heading);
  font-size: min(var(--text-d), calc(100cqi / var(--display-ratio, 6)));
  font-weight: 400;
  line-height: 0.8;
}
```

`--display-ratio` is the longest line's width in ems, set inline as `chars * ADVANCE` where `ADVANCE` is PP Mondwest's average advance (measure it first — see task 1; ~0.55 is the working estimate). Add `container-type: inline-size` to the two wrappers: the hero `RevealGroup` and `DisplayHero` at `src/pages/WorkCard.tsx` line 243.

Result with `ADVANCE = 0.55`:

- `"Designer"` (8 chars, ratio 4.4) — 84px at 390px, reaches full 180px at ~790px
- `"Pacelane.ai"` (11, ratio 6.05) — 48px at 390px, reaches 180px at ~1090px
- `"Work"` (4, ratio 2.2) — 180px everywhere above 400px

Then remove `whitespace-nowrap` from the display headings (line 244 in `WorkCard.tsx`) — it is no longer load-bearing, and it is what makes long titles clip today.

---

## 3. Header

New `compact` mode on `src/design-system/NameLogo.tsx`: `r` + `Symbol` + `s` (~63px, reusing `Letter`, keeping the randomiser on two letters). Legible at full letter size, unlike shrinking the 337px wordmark to fit.

In `src/design-system/NavBar.tsx`, render both and swap in CSS — full wordmark `hidden nav:inline-flex`, compact `nav:hidden`, desktop `<nav>` `hidden nav:flex`, plus a menu button at `nav:hidden`.

New `src/design-system/NavMenu.tsx` full-screen overlay:

- Renders `null` when closed, so the prerendered HTML has no duplicate link set
- `pauseSmoothScroll()` / `resumeSmoothScroll()` from `src/motion-system/smoothScroll.ts` on open/close
- Escape to close, focus trap, `aria-expanded` / `aria-controls`, auto-close on `pathname` change
- GSAP entrance matching `PanelTransition`, gated on `prefers-reduced-motion`
- `GameButton` moves inside; its magnet effect is already `(hover: hover)`-gated so it is inert on touch

In `src/App.tsx` line 128, add `sticky top-0` below `nav:` so the menu stays reachable. Sticky stays in flow, so the `ResizeObserver` writing `--site-nav-height` (lines 108–123) and the hero's `-mt-[var(--site-nav-height,0px)]` both keep working unchanged.

---

## 4. Rest of the home hero

- Video (line 52): `size-[316px]` becomes `size-[clamp(180px,45cqi,316px)]`, and the `+27.26px` offset becomes a proportion of the video size so the composition tracks
- `gap-[132px]` becomes `gap-[clamp(48px,9vh,132px)]`
- `src/motion-system/HeroFamily.tsx`: turn `SIZE_SCALE = 1.2` into a `--hero-family-scale` CSS variable consumed by the existing inline `style` widths via `calc()`, so `pack.offsetWidth` / `track.offsetWidth` (lines 143–145) still reflow correctly and the run animation math stays consistent
- `src/motion-system/CursorTrail.tsx`: move the 18 `<img>` tags *inside* the existing `gsap.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')` gate at line 17, so `src` never reaches touch devices. Prerender runs with `reducedMotion: 'reduce'`, so this also drops them from the shipped HTML — which section 5 of `plans/website-completion-checklist.md` separately asks for.

---

## 5. Page reflow

| File | Change |
| --- | --- |
| `src/pages/WorkCard.tsx` | `grid-cols-2` (L208) to `grid-cols-1 md:grid-cols-2`; `h-[560px]` (L243) to `h-[clamp(280px,42vh,560px)]`; let the title/year row (L184) wrap |
| `src/pages/ProjectDetailPage.tsx` | `flex-col lg:flex-row` (L295); sidebar `w-full static lg:w-[480px] lg:sticky` (L296); related cards `w-[853px]` to `w-[min(85vw,853px)]` (L337); meta `w-[160px]` to `w-[120px] xs:w-[160px]` |
| `src/pages/WorkImageSequence.tsx` | `h-[678px] w-[904px]` (L97) to `aspect-[904/678] w-full max-w-[904px]` |
| `src/pages/HowIUseAiPage.tsx` | The four-across `flex h-[380px]` rows (L21) become `grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4` with `min-h`; the models table (`w-[120px]` / `w-[320px]`, L72/75) stacks to a definition list below `md` |
| `src/pages/ContactPage.tsx` | `gap-[120px]` row (L112) to `flex-col gap-4xl lg:flex-row lg:gap-[120px]`; name/email row (L124) to `flex-col xs:flex-row`; drop `whitespace-nowrap` on the `text-h1` (L119) |
| `src/design-system/FooterSection.tsx` | The `h-[560px]` four-column row (L67) to `flex-col gap-4xl lg:h-[560px] lg:flex-row`; `w-[508px]` (L96) to `w-full lg:w-[508px]`; wrap the heading/AI-buttons/clock row (L97); give `src/motion-system/FooterPluto.tsx` the same CSS-variable scale treatment as `HeroFamily` and tie `pb-[200px]` to it |
| `src/pages/ImageLightbox.tsx` | `px-[120px] py-[112px]` (L328) to `px-xl py-2xl md:px-[120px] md:py-[112px]`; `max-h-[calc(100vh-240px)]` (L350) to `100dvh` with matching insets; `size-[56px]` controls (L52, L362) to `size-[44px]` on phones, the minimum comfortable touch target |
| `src/design-system/BackToTop.tsx` | `size-[80px]` to `size-[48px] md:size-[80px]` |
| `src/motion-system/ImagesTicker.tsx` | `h-[640px] w-[853px]` (L11–21) to `h-[clamp(220px,45vh,640px)] w-auto`, cutting decoded pixel area on mobile |

---

## 6. Touch behaviour

- Gate `WorkCard`'s hover-preview AVIF preloads behind `(hover: hover)` so touch devices never fetch them
- Check Lenis on coarse pointers in `src/motion-system/LenisProvider.tsx` (`touchMultiplier: 1.1` today); disabling it on touch is usually better than fighting native momentum
- Verify the drag-scroll pointer handlers in `ProjectDetailPage.tsx` (L173–179) do not block native touch scrolling on the related-work row

Out of scope: `/game` has no touch controls at all. That is a separate piece of work.

---

## 7. Regression net

Add `scripts/check-responsive.mjs` — Playwright is already a devDependency and `prerender.mjs` has the route list and preview-server pattern to copy. Load every route at 390 / 768 / 1024 / 1440 and assert `document.documentElement.scrollWidth <= clientWidth`. Cheap, and it catches the next fixed-pixel value someone adds.

---

## Task list

- [ ] **Measure first.** Run the dev server and record PP Mondwest's average advance ratio (needed to tune `--display-ratio`), the real rendered `NameLogo` width across letter-style swaps, and the actual nav overflow breakpoint. Confirm the ~943px estimate before picking `--breakpoint-nav`.
- [ ] **Tokens.** Add named breakpoints and fluid `--spacing-3xl/4xl` and `--text-4xl/3xl` to the `@theme` block in `src/index.css`. Leave `--spacing-2xs..2xl` fixed so `NavItem`'s hardcoded `SLOT_WIDTH = 20` stays in sync.
- [ ] **Display type.** Rewrite the `text-display` utility to `min(var(--text-d), calc(100cqi / var(--display-ratio)))`, add `container-type: inline-size` to the home hero `RevealGroup` and `DisplayHero`, set `--display-ratio` per title, and remove the now-redundant `whitespace-nowrap` from display headings.
- [ ] **Nav logo.** Add a compact `rs` mode to `NameLogo` (r + Symbol + s, randomiser retained) and render both variants in `NavBar` with a CSS swap at the nav breakpoint.
- [ ] **Nav menu.** Build `src/design-system/NavMenu.tsx`: full-screen overlay, renders `null` when closed, pauses Lenis via `pauseSmoothScroll`, Escape + focus trap + `aria-expanded`, closes on route change, GSAP entrance gated on `prefers-reduced-motion`. Move `GameButton` inside. Add `sticky top-0` to the nav wrapper in `App.tsx` below the nav breakpoint.
- [ ] **Hero remainder.** Fluid video size and proportional offset, fluid `gap-[132px]`, `--hero-family-scale` variable in `HeroFamily`, and move `CursorTrail`'s 18 `img` tags inside its existing hover/pointer `matchMedia` gate.
- [ ] **Reflow work.** `WorkGrid` `grid-cols-2` to responsive, `DisplayHero` height, `ProjectDetailPage` sidebar stacking and related-card width, `WorkImageSequence` aspect box.
- [ ] **Reflow pages.** `HowIUseAiPage` (tool grid + models table), `ContactPage` (side-by-side layout and name/email row), and `FooterSection` (four columns + `FooterPluto` scale).
- [ ] **Reflow chrome.** `ImageLightbox` insets and `dvh`, 44px touch targets on controls, `BackToTop` size, `ImagesTicker` image height.
- [ ] **Touch.** Gate `WorkCard` hover-preview preloads behind `(hover: hover)`, evaluate disabling Lenis on coarse pointers, verify the related-work drag-scroll does not block native touch scrolling.
- [ ] **Verify.** Add `scripts/check-responsive.mjs` using Playwright to load every route at 390/768/1024/1440 and assert no horizontal overflow, then run a full manual pass on a real phone.
