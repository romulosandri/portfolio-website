# How I Use AI Page Blueprint

## Design Overview

**Template Name:** how-i-use-ai  
**Node ID:** `174:958`  
**Purpose:** Tools grid and models table. Linked from HowAi, not a primary nav item.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-primary` | `#fbfbf8` | Page, cards |
| `foreground-primary` | `#0e0907` | Titles, model names |
| `foreground-secondary` | `#2c2321` | Tool body, providers |
| `foreground-tertiary` | `#494137` | Captions, model notes |
| `stroke-secondary` | `#e9e4e2` | Card and row borders |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| headers/display | `font-heading` | 180px (`text-d`) | 400 | 0.8 | 0 |
| headers/h2 | `font-heading` | 36px (`text-3xl`) | 400 | 1 | 0 |
| body/body-large | `font-body` | 16px (`text-md`) | 400 | 1.1 | 0 |
| body/body-default | `font-body` | 14px (`text-sm`) | 400 | 1.3 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-4xl` | 48px |
| `spacing-2xl` | 24px |
| `spacing-xl` | 16px |
| `spacing-lg` | 12px |
| raw | 164px (section padding / stack gap) |
| raw | 560px (title height) |
| raw | 380px (tool card row height) |

### Border Radius
| Token | Value |
|-------|-------|
| `radius-sm` | 6px (models block) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: HowIUseAi
├── [COMPONENT] NavBar
├── [ELEMENT] TitleBlock “How I use AI”
├── [ELEMENT] ToolsSection
│   ├── Header “Tools” + caption
│   └── 3 rows × 4 [COMPONENT] AppLogo cards
├── [ELEMENT] ModelsSection
│   ├── Header “Models”
│   └── 6 rows (provider, name, note)
└── [COMPONENT] FooterSection
```

## Component Specifications

### 1. TOOL_CARD
**Node ID:** `174:1217`

```pseudo
ToolCard {
  TYPE: Container
  HEIGHT: 380px
  PADDING: 24px (spacing-2xl)
  FILL: background-primary
  STROKE: 1px stroke-secondary (left/top/bottom; last in row also right)
  AUTO-LAYOUT: Column, space-between
  CHILDREN:
    ├── [COMPONENT] AppLogo  // catalog asset, do not redraw
    └── Copy
          Title: text-body-large, foreground-primary
          Body: text-body-default, foreground-secondary
}

ROW 1: Hermes Agent, Cursor, Granola, Fal.ai
ROW 2: Composio, ChatGPT (openai logo), Firecrawl, Tavily
ROW 3: Agent Mail, Zernio, Manus, OpenRouter
```

Caption: “A selection of the AI tools I use and the context where I use them”

### 2. MODEL_ROW
**Node ID:** `180:1455`

```pseudo
ModelRow {
  AUTO-LAYOUT: Row
  GAP: 12px (spacing-lg)
  PADDING: 24px
  STROKE: 1px stroke-secondary (first row full; others bottom/left/right)
  CHILDREN:
    ├── Provider width 120px, text-body-large, foreground-secondary
    ├── Name width 320px, text-body-large, foreground-primary
    └── Note text-body-default, foreground-tertiary
}

ROWS:
  Z.ai / GLM 5.2
  Cursor / Composer 2.5
  Anthropic / Claude Opus 5
  Anthropic / Claude Fable 5
  MoonshotAI / Kimi K2.6
  DeepSeek / DeepSeek V4 Flash 0423
```

## Implementation Notes

Import `NavBar`, `FooterSection`, `AppLogo`. Route: `/how-i-use-ai`. Copy from Figma; do not invent tools.
