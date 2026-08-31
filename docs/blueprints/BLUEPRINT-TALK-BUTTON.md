# Talk Button Blueprint

## Design Overview

**Template Name:** talk-button  
**Node ID:** `52:377`  
**Purpose:** Contact band. Default: social icons + “Let’s Talk” + square arrow. Hover: dark band, no socials, circular arrow.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-primary` | `#fbfbf8` | Default fill; hover heading |
| `foreground-primary` | `#0e0907` | Default heading; hover fill |
| `stroke-secondary` | `#e9e4e2` | Default top/bottom border |
| `foreground-quaternary` | `#807164` | Hover top/bottom border |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| headers/h3 | `font-heading` (Season Serif) | 24px (`text-xl`) | 400 | 1 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-xl` | 16px (padding; social gap) |
| `spacing-3xl` | 32px (default inner gap) |
| `spacing-2xl` | 24px (arrow cluster gap) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: TalkButton
├── LAYOUT: Flex Row
├── WIDTH: Fill (1176px in Figma)
├── HEIGHT: 114px
│
├── [COMPONENT] SocialIcon × 5   // default only
├── [ELEMENT] Heading “Let’s Talk”
└── [COMPONENT] ArrowButton
```

## Component Specifications

### 1. TALK_BUTTON_DEFAULT
**Node ID:** `52:376`

```pseudo
TalkButton_Default {
  TYPE: Button Container
  AUTO-LAYOUT: Row
    - align-items: Center
    - gap: 32px (spacing-3xl)
  PADDING: 16px (spacing-xl)
  FILL: #fbfbf8 (background-primary)
  STROKE: 1px top+bottom #e9e4e2 (stroke-secondary)
  CHILDREN:
    ├── SocialRow {
          AUTO-LAYOUT: Row
          gap: 16px (spacing-xl)
          CHILDREN SocialIcon: email, github, x, linkedin, instagram
        }
    ├── Heading {
          CONTENT: "Let’s Talk"
          TYPOGRAPHY: headers/h3
          COLOR: #0e0907 (foreground-primary)
          flex: 1
        }
    └── [COMPONENT] ArrowButton (variant="default")
}
```

### 2. TALK_BUTTON_HOVER
**Node ID:** `52:378`

Fill `#0e0907`. Border `#807164` (foreground-quaternary). No social row. Heading hugs. ArrowButton `variant="dark"`. `justify-content: space-between`.

## Implementation Notes

Import `SocialIcon` and `ArrowButton`.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| href | string | `'#'` | Destination |
| forceHover | boolean | false | Gallery preview of hover |
| className | string | — | Optional class override |
