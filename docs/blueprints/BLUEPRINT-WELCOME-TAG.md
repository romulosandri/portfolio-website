# Welcome Tag Blueprint

## Design Overview

**Template Name:** welcome-tag  
**Node ID:** `22:1267`  
**Purpose:** Intro chip: “Welcome to my portfolio”, symbol 7, and the AI Agents tag.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-white` | `#ffffff` | Chip fill |
| `foreground-secondary` | `#2c2321` | Welcome copy |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| body/body-default | `font-body` (Saans) | 14px (`text-sm`) | 400 | 1.3 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-xl` | 16px (horizontal padding) |
| `spacing-md` | 8px (vertical padding) |
| raw | 10px (gap) |

### Border Radius
| Token | Value |
|-------|-------|
| `radius-sm` | 6px |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: WelcomeTag
├── LAYOUT: Flex Row
├── WIDTH: 309px (Hug)
├── HEIGHT: 44px
├── GAP: 10px (raw)
│
├── [ELEMENT] WelcomeCopy
├── [COMPONENT] Symbol variant="7"
└── [COMPONENT] Tag type="ai-agents"
```

## Component Specifications

### 1. WELCOME_TAG
**Node ID:** `22:1267`

```pseudo
WelcomeTag {
  TYPE: Container
  POSITION: Relative

  DIMENSIONS:
    - width: 309px (Hug Content)
    - height: 44px (Hug Content)

  AUTO-LAYOUT: Yes (Flex)
    - direction: Row
    - align-items: Center
    - justify-content: Center
    - gap: 10px (raw)

  PADDING:
    - top: 8px (spacing-md)
    - right: 16px (spacing-xl)
    - bottom: 8px (spacing-md)
    - left: 16px (spacing-xl)

  FILL:
    - type: Solid
    - color: #ffffff (background-white)

  CORNER-RADIUS: 6px (radius-sm)

  CHILDREN:
    ├── WelcomeCopy {
          TYPE: Text
          CONTENT: "Welcome to my portfolio"
          TYPOGRAPHY: body/body-default
          COLOR: #2c2321 (foreground-secondary)
          white-space: nowrap
        }
    ├── [COMPONENT] Symbol (variant="7", 16×16)
    └── [COMPONENT] Tag (type="ai-agents")
}
```

## Implementation Notes

Import `Symbol` and `Tag`. Do not rebuild the inner tag.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| className | string | — | Optional class override |
