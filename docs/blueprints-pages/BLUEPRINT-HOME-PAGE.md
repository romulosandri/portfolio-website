# Home Page Blueprint

## Design Overview

**Template Name:** home-page  
**Node ID:** `29:791`  
**Purpose:** Site home. Hero, logos, selected work, about, project ticker, footer. Not the game.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-primary` | `#fbfbf8` | Page, work, about |
| `background-secondary` | `#f6f6f3` | Hero, ticker, footer outer |
| `foreground-primary` | `#0e0907` | Display, work titles, bio |
| `foreground-secondary` | `#2c2321` | About eyebrow, card titles |
| `foreground-tertiary` | `#494137` | Subcopy, years |
| `stroke-secondary` | `#e9e4e2` | Section rules, cards |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| headers/display | `font-heading` | 180px (`text-d`) | 400 | 0.8 | 0 |
| headers/h2 | `font-heading` | 36px (`text-3xl`) | 400 | 1 (bio 1.2) | 0 |
| headers/h4 | `font-heading` | 20px (`text-lg`) | 400 | 1 | 0 |
| body/body-large | `font-body` | 16px (`text-md`) | 400 | 1.1 | 0 |
| body/body-default | `font-body` | 14px (`text-sm`) | 400 | 1.3 | 0 |
| body/body-small | `font-body` | 12px (`text-xsm`) | 400 | 1.25 | 0 |
| raw (hero sub) | `font-body` | 24px (`text-xl`) | 400 | 1.35 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-4xl` | 48px |
| `spacing-3xl` | 32px |
| `spacing-2xl` | 24px |
| `spacing-xl` | 16px |
| `spacing-lg` | 12px |
| raw | 10px (welcome/header gaps; ticker image gap) |
| raw | 132px (hero inner stack) |
| raw | 164px (about vertical padding) |
| raw | 120px (about inner gap) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: HomePage
├── LAYOUT: Flex Column
├── FILL: background-primary
│
├── [ELEMENT] HeroSection (background-secondary, overflow clip)
│   ├── [COMPONENT] NavBar
│   ├── [ELEMENT] HeroCopy (height ~779px, center)
│   │   ├── [COMPONENT] WelcomeTag
│   │   ├── [ELEMENT] Display “Product / Designer”
│   │   └── [ELEMENT] Subcopy
│   ├── [COMPONENT] LogosTicker
│   └── [ELEMENT] Character (absolute, 316×316, centered)
├── [ELEMENT] WorkSection
│   ├── [ELEMENT] Header “Work” + “Selected work from 2023 to 2026”
│   └── [ELEMENT] Grid 2×3 WorkCards
├── [ELEMENT] AboutSection
│   ├── [ELEMENT] Eyebrow “About Me”
│   ├── [ELEMENT] Bio
│   ├── [ELEMENT] Value cards × 3
│   ├── [COMPONENT] HowAi
│   └── [COMPONENT] TalkButton
├── [ELEMENT] ProjectsTicker (3 covers, 853×640)
└── [COMPONENT] FooterSection
```

## Component Specifications

### 1. HERO_SECTION
**Node ID:** `22:1305`

```pseudo
HeroSection {
  TYPE: Container
  FILL: #f6f6f3 (background-secondary)
  OVERFLOW: Clip
  POSITION: Relative

  CHILDREN:
    ├── [COMPONENT] NavBar
    ├── HeroCopy {
          HEIGHT: 778.973px
          AUTO-LAYOUT: Column, center
          GAP: 132px (raw)
          CHILDREN:
            ├── [COMPONENT] WelcomeTag
            └── Display {
                  TYPE: Text
                  CONTENT: "Product \nDesigner"
                  TYPOGRAPHY: headers/display, line-height 0.8
                  COLOR: #0e0907 (foreground-primary)
                  text-align: Center
                }
            └── Subcopy {
                  CONTENT: "+8 Years working with amazing software"
                  WIDTH: 256px
                  font-size: 24px (text-xl)
                  line-height: 1.35
                  COLOR: #494137 (foreground-tertiary)
                  text-align: Center
                }
        }
    ├── [COMPONENT] LogosTicker
    └── Character {
          TYPE: Image
          POSITION: Absolute
          SIZE: 316×316
          left: 50%; top: calc(50% + 27.26px)
          transform: translate(-50%, -50%)
          SOURCE: "/images/home/hero-character.png"
        }
}
```

### 2. WORK_SECTION
**Node ID:** `29:790`

```pseudo
WorkSection {
  PADDING: 48px (spacing-4xl)
  GAP: 48px
  CHILDREN:
    ├── Header {
          border-top: 1px stroke-secondary
          PADDING-TOP: 24px (spacing-2xl)
          justify: Space-Between
          CHILDREN:
            ├── Title “Work” (text-h2, foreground-primary)
            └── Caption “Selected work from 2023 to 2026” (text-body-large, foreground-tertiary)
        }
    └── Grid {
          columns: 2
          gap-x: 16px (spacing-xl)
          gap-y: 24px (spacing-2xl)
          CHILDREN: WorkCard × 6
            Pacelane.ai / 2026
            Gemhaus / 2025
            Meltwater / 2024
            Cinepolis / 2023
            Stream Stakes / 2024
            Random Selection / 2022-2026
        }
}

WorkCard {
  AUTO-LAYOUT: Column
  GAP: 24px (spacing-2xl)
  CHILDREN:
    ├── Image aspect 2048/1536, object-fit Cover
    └── Row space-between
          Title: text-h4, foreground-primary
          Year: text-body-large, foreground-tertiary
}
```

### 3. ABOUT_SECTION
**Node ID:** `68:252`

```pseudo
AboutSection {
  PADDING: 164px 10px (raw)
  CHILDREN Container {
    MAX-WIDTH: 1440px
    PADDING: 48px 32px
    GAP: 120px
    ALIGN: Center
    CHILDREN:
      ├── Top { GAP: 16px, center
            Eyebrow “About Me” (text-body-default, foreground-secondary)
            Bio (text-h2, width 640px, line-height 1.2, foreground-primary)
              “Hi, I am Rômulo Sandri — Product Designer based in Palmas, Brazil. I design, write code, and ship products people actually use, from the first conversation to the last pixel.”
          }
      └── Bottom width 1176px
            ├── ValueRow height 380px
            │   Cards: Love for the craft | Ship, then refine | Clarity over complexity
            │   First two: border top/left/bottom; last: full border
            │   PADDING: 16px; title text-body-default foreground-primary; body text-body-small foreground-secondary
            ├── [COMPONENT] HowAi  href /how-i-use-ai
            └── [COMPONENT] TalkButton href /contact
  }
}
```

### 4. PROJECTS_TICKER
**Node ID:** `43:369`

```pseudo
ProjectsTicker {
  FILL: background-secondary
  PADDING: 48px 10px
  OVERFLOW: Clip
  AUTO-LAYOUT: Row, center, gap 10px
  CHILDREN: Image 853×640 × 3 (work covers)
}
```

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| character | `/images/home/hero-character.png` |
| Work covers | `/images/work/{slug}/avif/{slug}-cover.avif` |

## Implementation Notes

Import `NavBar`, `WelcomeTag`, `LogosTicker`, `HowAi`, `TalkButton`, `FooterSection`. Do not rebuild them. Home is `/`. Game lives at `/game`.
