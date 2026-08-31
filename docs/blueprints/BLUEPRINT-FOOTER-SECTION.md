# Footer Section Blueprint

## Design Overview

**Template Name:** footer-section  
**Node ID:** `79:809`  
**Purpose:** Site footer: Let’s Talk + socials, work/project lists, Ask-AI row, agent copy, character sprite.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-secondary` | `#f6f6f3` | Outer fill |
| `background-white` | `#ffffff` | Inner card |
| `foreground-secondary` | `#2c2321` | Headings, list links |
| `foreground-tertiary` | `#494137` | Captions, agent copy |
| `stroke-secondary` | `#e9e4e2` | Column dividers |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| headers/h3 | `font-heading` | 24px (`text-xl`) | 400 | 1 | 0 |
| headers/h5 | `font-heading` | 16px (`text-md`) | 400 | 1 | 0 |
| body/body-default | `font-body` | 14px (`text-sm`) | 400 | 1.3 | 0 |
| body/body-small | `font-body` | 12px (`text-xsm`) | 400 | 1.25 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-4xl` | 48px (outer/inner padding) |
| `spacing-2xl` | 24px (column left pad; ask-ai gap) |
| `spacing-1xl` | 20px (social stack gap) |
| `spacing-xl` | 16px (social icon gap) |
| `spacing-md` | 8px (list gap; AI button gap) |
| raw | 200px (bottom padding for sprite) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: FooterSection
├── LAYOUT: Flex Column, center
├── WIDTH: 1920px (Fill)
├── HEIGHT: 808px
│
├── [ELEMENT] FooterContainer (white card, 560px)
│   ├── [ELEMENT] IntroColumn
│   │   ├── [ELEMENT] Heading “Let’s Talk”
│   │   └── [ELEMENT] SocialContainer
│   │       ├── [COMPONENT] SocialIcon × 5
│   │       └── [ELEMENT] Credit
│   ├── [ELEMENT] WorkColumn
│   │   ├── [ELEMENT] Label “Work”
│   │   └── [COMPONENT] FooterButton × 5
│   ├── [ELEMENT] ProjectsColumn
│   │   ├── [ELEMENT] Label “Projects”
│   │   └── [COMPONENT] FooterButton × 5
│   └── [ELEMENT] AgentsColumn
│       ├── [ELEMENT] AskAi row
│       │   ├── [ELEMENT] Prompt
│       │   ├── [COMPONENT] AiButton × 4
│       │   └── [ELEMENT] Clock
│       └── [ELEMENT] AgentCopy
└── [ELEMENT] CharacterSprite
```

## Component Specifications

### 1. FOOTER_SECTION
**Node ID:** `79:809`

```pseudo
FooterSection {
  TYPE: Container
  FILL: #f6f6f3 (background-secondary)
  PADDING:
    - top: 48px (spacing-4xl)
    - right: 48px
    - bottom: 200px (raw, sprite clearance)
    - left: 48px

  CHILDREN:
    ├── FooterContainer {
          FILL: #ffffff (background-white)
          HEIGHT: 560px
          PADDING: 48px (spacing-4xl)
          AUTO-LAYOUT: Row
          justify-content: Space-Between
          align-items: End
          CHILDREN: IntroColumn | WorkColumn | ProjectsColumn | AgentsColumn
        }
    └── CharacterSprite {
          TYPE: Image
          POSITION: Absolute
          left: 37px
          bottom: ~26px
          width: 406px
          height: 207px
          SOURCE: "/design-system/game/character-sprite-3.png"
        }
}
```

IntroColumn is a 225px-wide column, `justify-content: space-between`, heading `text-h3` / `foreground-secondary`. Social icons: email, github, x, linkedin, instagram. Credit: “Designed by Romulo Sandri. Palmas, Brazil” (`text-body-small`, `foreground-tertiary`).

Work and Projects columns: `border-l` stroke-secondary, `pl-2xl`, space-between. Labels `text-body-small` / `foreground-tertiary`. Lists gap `spacing-md`.

Work: Pacelane.ai, Gemhaus, Meltwater, Cinepolis, Stream Stakes.  
Projects: Fotospin.ai, Spiiine, Bunnyhop, Kessera, AI Workshops.

AgentsColumn width 508px. Ask-ai row: “Ask about Rômulo Sandri on” (`text-h5`), AiButtons openai / claude / grok / perplexity, live `HH:mm BRT (UTC-3)` (`text-body-default`). Agent copy is `text-body-small` / `foreground-tertiary`, paragraphs separated by blank lines.

## Implementation Notes

Import `SocialIcon`, `FooterButton`, `AiButton`. Clock updates every minute in America/Sao_Paulo.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| className | string | — | Optional class override |
