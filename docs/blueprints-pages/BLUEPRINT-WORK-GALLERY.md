# Work Gallery Blueprint

## Design Overview

**Template Name:** work-gallery  
**Node ID:** `123:494`  
**Purpose:** All selected work. Display title, 2×3 grid, footer.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-primary` | `#fbfbf8` | Page |
| `foreground-primary` | `#0e0907` | Display, titles |
| `foreground-tertiary` | `#494137` | Years |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| headers/display | `font-heading` | 180px (`text-d`) | 400 | 0.8 | 0 |
| headers/h4 | `font-heading` | 20px (`text-lg`) | 400 | 1 | 0 |
| body/body-large | `font-body` | 16px (`text-md`) | 400 | 1.1 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-4xl` | 48px |
| `spacing-2xl` | 24px |
| `spacing-xl` | 16px |
| raw | 164px (grid bottom padding) |
| raw | 560px (title block height) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: WorkGallery
├── [COMPONENT] NavBar  // Work selected
├── [ELEMENT] TitleBlock height 560px, center, “Work” display
├── [ELEMENT] GridSection padding 0 48px 164px
│   └── 2-col grid, gap-x 16px, gap-y 24px
│       WorkCard × 6 (same items as home)
└── [COMPONENT] FooterSection
```

## Component Specifications

### 1. TITLE_BLOCK
**Node ID:** `123:496`

```pseudo
TitleBlock {
  HEIGHT: 560px
  PADDING: 48px
  FILL: background-primary
  ALIGN: Center
  CHILDREN:
    └── “Work” {
          TYPOGRAPHY: headers/display, line-height 0.8
          COLOR: foreground-primary
          text-align: Center
        }
}
```

### 2. GRID
**Node ID:** `123:667`

Same WorkCard spec as home-page. Items: Pacelane.ai 2026, Gemhaus 2025, Meltwater 2024, Cinepolis 2023, Stream Stakes 2024, Random Selection 2022-2026. Cards link to `/work/{slug}`.

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| Work covers | `/images/work/{slug}/avif/{slug}-cover.avif` |

## Implementation Notes

Import `NavBar`, `FooterSection`. Reuse the home WorkCard pattern. Route: `/work`.
