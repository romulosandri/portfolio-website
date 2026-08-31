# Arrow Button Blueprint

## Design Overview

**Template Name:** arrow-buton (arrow-button)  
**Node ID:** `52:368`  
**Purpose:** 80×80 external-link control. Default is a light square; hover/dark is a filled circle.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-primary` | `#fbfbf8` | Default fill |
| `stroke-secondary` | `#e9e4e2` | Default border |
| `foreground-secondary` | `#2c2321` | Dark fill; default icon stroke |
| `background-primary` | `#fbfbf8` | Dark-variant icon stroke |

### Spacing
| Token | Value |
|-------|-------|
| none | 80px fixed; 32px icon |

### Border Radius
| Token | Value |
|-------|-------|
| none | 0px (default square) |
| `radius-all` | 999px (dark circle) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: ArrowButton
├── LAYOUT: Flex Row
├── WIDTH: 80px
├── HEIGHT: 80px
├── ALIGNMENT: Center
│
└── [ELEMENT] ArrowIcon (32×32)
```

## Component Specifications

### 1. ARROW_BUTTON_DEFAULT
**Node ID:** `52:360`

```pseudo
ArrowButton_Default {
  TYPE: Button Container
  POSITION: Relative

  DIMENSIONS:
    - width: 80px (Fixed)
    - height: 80px (Fixed)

  AUTO-LAYOUT: Yes (Flex)
    - direction: Row
    - align-items: Center
    - justify-content: Center
    - gap: 0px

  FILL:
    - type: Solid
    - color: #fbfbf8 (background-primary)

  STROKE:
    - position: Inside
    - weight: 1px
    - color: #e9e4e2 (stroke-secondary)

  CORNER-RADIUS: 0px
  OVERFLOW: Visible

  CHILDREN:
    └── ArrowIcon {
          TYPE: Image
          DIMENSIONS: 32×32
          SOURCE: "/design-system/icons/arrow-up-right-dark.svg"
        }
}
```

### 2. ARROW_BUTTON_DARK
**Node ID:** `52:369`

Same as default except: fill `#2c2321` (foreground-secondary), no stroke, `radius-all`, icon `arrow-up-right-light.svg`.

## Variant Matrix

| Variant | Fill | Stroke | Radius | Icon |
|---------|------|--------|--------|------|
| default | background-primary | stroke-secondary 1px | 0 | dark arrow |
| dark | foreground-secondary | none | radius-all | light arrow |

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| Arrows, Diagrams/Arrow (default) | `/design-system/icons/arrow-up-right-dark.svg` |
| Arrows, Diagrams/Arrow (dark) | `/design-system/icons/arrow-up-right-light.svg` |

## Implementation Notes

Used by `[COMPONENT] TalkButton` and `[COMPONENT] HowAi` (dark). Render as `<a>` or `<button>`.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'default' \| 'dark'` | `'default'` | Visual variant |
| href | string | — | Optional link |
| className | string | — | Optional class override |
