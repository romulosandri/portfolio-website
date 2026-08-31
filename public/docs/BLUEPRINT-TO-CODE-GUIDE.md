# Blueprint-to-Code Guide

How to translate a component or page blueprint into a real implementation inside `src/`.

---

## Rule 1: Always Use the Design System

Every visual value in your component — color, spacing, font size, shadow, border radius — **must** come from the token files. Never hardcode a raw value or invent a new token.

### What this means in practice

- The blueprint lists every token a component needs (e.g. `spacing-md`, `text/text-default`, `radius-sm`).
- Look up the token in the corresponding design system file (`spacing.js`, `semantic-colors.js`, `typography.js`, `shadows.js`, `primitive-colors.js`).
- Import it and use it directly.

### How to resolve a blueprint value

1. Read the **Design Tokens & Variables** section of the blueprint.
2. Find the matching export in `src/design-system/tokens/`.
3. Import it:

```javascript
import { spacing } from '../tokens/spacing.js';
import { themes } from '../tokens/semantic-colors.js';
import { typography } from '../tokens/typography.js';
import { shadows } from '../tokens/shadows.js';
```

4. Reference the token — never the raw value:

```javascript
// Good
padding: spacing.spacing.md       // → '8px'
color: theme.text.default          // → resolved semantic color

// Bad — hardcoded value
padding: '8px'
color: '#0f0f0f'
```

### What if a value isn't in the token files?

Before adding anything, double-check every token file. Blueprints reference token names that already map to exports. If you genuinely can't find a match:

1. Check if the blueprint notes it as a **raw value** (some blueprints call out one-off values like `2px` padding explicitly). Use the raw value only when the blueprint explicitly marks it as such.
2. If a token is truly missing and is needed by more than one component, add it to the appropriate token file — never to the component itself. Then import it like any other token.
3. **Never** add a one-off constant inside a component file that duplicates what the design system should provide.

---

## Rule 2: Never Recreate a Sub-Component

Blueprints for composed components reference other components by name (e.g. a Card blueprint may reference `Button`, `Badge`, `Avatar`). **Import the existing v2 component — do not rebuild it.**

### How to identify sub-components in a blueprint

Look at the **Component Hierarchy (Pseudo-Code)** section. Entries marked `[COMPONENT]` are separate components you should import. Entries marked `[ELEMENT]` are internal DOM nodes you build inline.

```
Example from a composed blueprint:

ROOT: ContentCard
├── [ELEMENT] ImageContainer
├── [COMPONENT] Badge          ← import from design-system-v2
├── [ELEMENT] TextBlock
│   └── [TEXT] Title
└── [COMPONENT] Button         ← import from design-system-v2
```

### Import path

All v2 components live in `src/design-system-v2/components/`. Import them relatively:

```javascript
import { Button } from './Button';
import { Badge } from './Badge';
```

### What if the sub-component doesn't exist yet?

Do **not** inline a temporary version. The sub-component must be implemented from its own blueprint first. If it's missing, pause and implement it before continuing with the composed component. The migration plan defines the build order (base components before composed components) specifically to avoid this situation.

---

## Rule 3: Follow the Blueprint Structure

Blueprints are the single source of truth for how a component is built. Follow them section by section.

### Blueprint sections and what to do with each

| Blueprint Section | What It Tells You | What You Do |
|---|---|---|
| **Design Overview** | Component name, Figma source, purpose | Use as the component's file name and JSDoc description. |
| **Design Tokens & Variables** | Every color, typography style, spacing, radius, and shadow token | Build your style objects / Tailwind classes exclusively from these tokens. |
| **Component Hierarchy** | The DOM tree, which children are `[COMPONENT]` vs `[ELEMENT]`, optional toggles | Translate directly into your JSX structure. `[COMPONENT]` = import, `[ELEMENT]` = JSX node. |
| **Component Specifications** | Per-variant / per-size specs with exact dimensions, padding, gap, fill, stroke, radius, shadow, children | Implement each variant and size exactly as specified. This is the pixel-level contract. |
| **Variant Matrix / Style Matrix** | How styles change across variants and states (default, hover, press, loading, disabled) | Map to your style logic (conditional classes, state-driven style objects). |
| **States** | Interactive states — hover, focus, active, disabled, loading | Wire up event handlers and conditional styles to match. |
| **Accessibility** | ARIA roles, keyboard behavior, focus management | Implement all listed accessibility requirements. |
| **Props** | Prop name, type, default, description | Define your component's prop interface to match exactly. |
| **Notes / Warnings** | Edge cases, mismatches between Figma and code, missing tokens | Read carefully — these prevent bugs. |

### Translating the hierarchy to JSX

The pseudo-code in the blueprint maps 1:1 to your JSX tree:

**Blueprint:**
```
BadgeContainer {
  AUTO-LAYOUT: Row
  PADDING: 4px (spacing-xsm)
  GAP: 0px (spacing-none)
  CORNER-RADIUS: 4px (radius-sm)

  CHILDREN:
    ├── [ELEMENT] LeadingIcon (optional)
    ├── [ELEMENT] LabelFrame
    │   └── [TEXT] Label
    └── [ELEMENT] CloseButton (optional)
}
```

**JSX:**
```jsx
<div style={{
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: spacing.spacing.xsm,
  gap: spacing.spacing.none,
  borderRadius: '4px',
}}>
  {icon && <span>{icon}</span>}
  <span>{label}</span>
  {onClose && <button onClick={onClose}><X /></button>}
</div>
```

### Handling variants and sizes

Blueprints define separate specification blocks per variant and size (e.g. `Button_Default_md`, `Button_Default_sm`, `Button_IconOnly_md`). Build a style map or conditional logic that selects the correct values based on the `variant`, `size`, and `style` props:

```javascript
const sizeStyles = {
  md: { height: '36px', padding: `${spacing.spacing.md} ${spacing.spacing.lg}`, gap: spacing.spacing.sm },
  sm: { height: '32px', padding: `${spacing.spacing.sm} ${spacing.spacing.md}`, gap: spacing.spacing.xsm },
  xs: { height: '28px', padding: `${spacing.spacing.xsm} ${spacing.spacing.md}`, gap: spacing.spacing.xsm },
};
```

### Handling states

Blueprints list exact token changes per state. Wire these to the appropriate events:

| State | Trigger |
|---|---|
| Default | No interaction |
| Hover | `onMouseEnter` / `onMouseLeave` or CSS `:hover` |
| Press | `onMouseDown` / `onMouseUp` or CSS `:active` |
| Focused | `:focus-visible` |
| Loading | Controlled prop (`isLoading`) |
| Disabled | Native `disabled` attribute + `aria-disabled` |

---

## Quick Checklist

Before considering a component done, verify:

- [ ] Every color, spacing, font, shadow, and radius value is imported from `src/design-system-v2/tokens/` — no hardcoded values.
- [ ] Every `[COMPONENT]` in the blueprint hierarchy is imported from `src/design-system-v2/components/`, not rebuilt.
- [ ] The JSX tree matches the blueprint's **Component Hierarchy** section.
- [ ] Every variant, size, and style listed in the **Component Specifications** is implemented.
- [ ] Every interactive state (hover, press, disabled, loading, focused) applies the exact tokens from the blueprint's state matrix.
- [ ] Props match the blueprint's **Props** section in name, type, and default value.
- [ ] Accessibility requirements from the blueprint are implemented (ARIA roles, keyboard navigation).
- [ ] The component only imports from `design-system-v2` — never from `design-system` (v1).
- [ ] Icons use `@phosphor-icons/react`.
