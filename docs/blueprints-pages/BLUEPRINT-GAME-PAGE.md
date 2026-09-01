# Game Page Blueprint

## Design Overview

**Template Name:** game-page  
**Node ID:** `207:1323`  
**Purpose:** Framed life-game. Nav + “My life game” + live canvas + footer. Not the site home.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-primary` | `#fbfbf8` | Page chrome |
| `foreground-primary` | `#0e0907` | Heading |
| `stroke-secondary` | `#e9e4e2` | Header rule |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| headers/h2 | `font-heading` | 36px (`text-3xl`) | 400 | 1 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-4xl` | 48px |
| `spacing-2xl` | 24px |
| `spacing-xl` | 16px |
| raw | 1080px (nav + stage in Figma) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: GamePage
├── [ELEMENT] Stage (column, ~viewport height)
│   ├── [COMPONENT] NavBar
│   └── [ELEMENT] Container (flex 1, padding 48px / 16px)
│       ├── Header border-top, “My life game” (text-h2)
│       └── GameCanvas (flex 1, fills remaining)
└── [COMPONENT] FooterSection
```

## Component Specifications

### 1. STAGE
**Node ID:** `210:1054`

```pseudo
Stage {
  TYPE: Container
  HEIGHT: Hug viewport (Figma 1080px)
  FILL: background-primary
  CHILDREN:
    ├── [COMPONENT] NavBar
    └── Body {
          PADDING: 16px 48px
          GAP: 48px
          CHILDREN:
            ├── Header {
                  border-top: 1px stroke-secondary
                  PADDING-TOP: 24px
                  TITLE: “My life game” (text-h2, foreground-primary)
                }
            └── Playfield { flex: 1; min-height: 0 }
                  Embed existing GameCanvas — do not screenshot the Figma illustration.
        }
}
```

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| Frame 36 (illustration) | Not committed — replaced by live Phaser canvas |

## Implementation Notes

Import `NavBar`, `FooterSection`, `GameCanvas`. Route: `/game`. `GameButton` in the nav goes here. Home remains `/`.
