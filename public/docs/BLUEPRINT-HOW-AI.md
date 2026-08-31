# How AI Blueprint

## Design Overview

**Template Name:** how-ai  
**Node ID:** `174:852`  
**Purpose:** Full-width bar linking to “how I use AI”. Default shows app logos; hover inverts to dark with an arrow.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-primary` | `#fbfbf8` | Default fill; hover label |
| `foreground-primary` | `#0e0907` | Default label; hover fill |
| `stroke-secondary` | `#e9e4e2` | Default bottom/left/right border |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| body/body-default | `font-body` (Saans) | 14px (`text-sm`) | 400 | 1.3 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-xl` | 16px (padding and gap) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: HowAi
├── LAYOUT: Flex Row
├── WIDTH: Fill (1176px in Figma)
├── HEIGHT: 52px
├── GAP: 16px
│
├── [ELEMENT] Label
├── [COMPONENT] AppLogo × 13   // default
└── [ELEMENT] ArrowIcon        // hover
```

## Component Specifications

### 1. HOW_AI_DEFAULT
**Node ID:** `174:851`

```pseudo
HowAi_Default {
  TYPE: Button Container
  DIMENSIONS: width Fill, height 52px
  AUTO-LAYOUT: Row
    - align-items: Center
    - justify-content: Center
    - gap: 16px (spacing-xl)
  PADDING: 16px (spacing-xl)
  FILL: #fbfbf8 (background-primary)
  STROKE: 1px #e9e4e2 (stroke-secondary) on bottom, left, right
  CHILDREN:
    ├── Label {
          CONTENT: "See how I use AI"
          TYPOGRAPHY: body/body-default
          COLOR: #0e0907 (foreground-primary)
          flex: 1
        }
    └── LogoRow {
          AUTO-LAYOUT: Row
          gap: 16px
          CHILDREN AppLogo order:
            hermes, cursor, fal, granola, agent-mail, openai,
            composio, firecrawl, manus, zernio, apify, tavily, openrouter
        }
}
```

### 2. HOW_AI_HOVER
**Node ID:** `174:853`

Fill `#0e0907`. Label `#fbfbf8`. Logo row replaced by 24×24 light arrow (`arrow-up-right-light.svg`).

## States

| State | Fill | Label | Trailing |
|-------|------|-------|----------|
| default | background-primary | foreground-primary | AppLogo row |
| hover | foreground-primary | background-primary | light arrow 24×24 |

## Implementation Notes

Import `AppLogo`. Do not rebuild logos. Hover via CSS; `forceHover` for gallery.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| href | string | `'#'` | Destination |
| forceHover | boolean | false | Gallery preview of hover |
| className | string | — | Optional class override |
