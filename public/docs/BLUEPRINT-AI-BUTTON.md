# AI Button Blueprint

## Design Overview

**Template Name:** ai-button  
**Node ID:** `60:734`  
**Purpose:** 32×32 icon button that opens an AI chat about Rômulo. Wraps `[COMPONENT] AiLogo`.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-secondary` | `#f6f6f3` | Default fill |
| `background-tertiary` | `#e9e4e2` | Hover fill |
| `stroke-secondary` | `#e9e4e2` | Border |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-sm` | 6px (padding) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: AiButton
├── LAYOUT: Flex Row
├── WIDTH: 32px
├── HEIGHT: 32px
├── ALIGNMENT: Center
│
└── [COMPONENT] AiLogo (18×18)
```

## Component Specifications

### 1. AI_BUTTON_DEFAULT
**Node ID:** `60:733`

```pseudo
AiButton_Default {
  TYPE: Button Container
  POSITION: Relative

  DIMENSIONS:
    - width: 32px (Fixed)
    - height: 32px (Fixed)

  AUTO-LAYOUT: Yes (Flex)
    - direction: Row
    - align-items: Center
    - justify-content: Center
    - gap: 0px

  PADDING:
    - top: 6px (spacing-sm)
    - right: 6px
    - bottom: 6px
    - left: 6px

  FILL:
    - type: Solid
    - color: #f6f6f3 (background-secondary)

  STROKE:
    - position: Inside
    - weight: 1px
    - color: #e9e4e2 (stroke-secondary)

  CORNER-RADIUS: 0px

  CHILDREN:
    └── [COMPONENT] AiLogo (scaled to 18×18)
}
```

### 2. AI_BUTTON_HOVER
**Node ID:** `60:735`

Fill `#e9e4e2` (background-tertiary). AiLogo uses its built-in hover mark.

## States

| State | Fill | Icon |
|-------|------|------|
| Default | background-secondary | AiLogo default |
| Hover | background-tertiary | AiLogo hover |

## Implementation Notes

Import `AiLogo`. Do not re-export AI marks. Used by `[COMPONENT] FooterSection`.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| name | `AiLogoName` | `'openai'` | Which AI mark |
| href | string | — | Optional link |
| className | string | — | Optional class override |
