# Human Image Blueprint

## Design Overview

**Template Name:** human-image  
**Node ID:** `263:1220`  
**Purpose:** 24×24 circular avatar of the blue human character used inside the humans `tag`.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| none | image asset | Character artwork |

### Spacing
| Token | Value |
|-------|-------|
| none | 24px fixed |

### Border Radius
| Token | Value |
|-------|-------|
| `radius-all` | 999px (circular clip) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: HumanImage
├── LAYOUT: None
├── WIDTH: 24px (Fixed)
├── HEIGHT: 24px (Fixed)
│
└── [ELEMENT] Image
```

## Component Specifications

### 1. HUMAN_IMAGE
**Node ID:** `263:1220`  
**Static Image:** `human-image.png`

```pseudo
HumanImage {
  TYPE: Image
  POSITION: Relative

  DIMENSIONS:
    - width: 24px (Fixed)
    - height: 24px (Fixed)
    - aspect-ratio: 1 / 1

  OBJECT-FIT: Cover
  OBJECT-POSITION: center
  CORNER-RADIUS: 999px (radius-all)
  OVERFLOW: Clip
  OPACITY: 100%

  SOURCE: "/design-system/tag-images/human-image.png"
}
```

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| human-image | `/design-system/tag-images/human-image.png` |

## Implementation Notes

Reuse `DsImage`. Do not inline SVG. Used by `[COMPONENT] Tag` (`type=humans`).

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| className | string | — | Optional class override |
