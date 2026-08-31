# Robot Image Blueprint

## Design Overview

**Template Name:** robot-image  
**Node ID:** `263:1219`  
**Purpose:** 24×24 circular avatar of the blue robot/cat character used inside the AI Agents `tag`.

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
ROOT: RobotImage
├── LAYOUT: None
├── WIDTH: 24px (Fixed)
├── HEIGHT: 24px (Fixed)
│
└── [ELEMENT] Image
```

## Component Specifications

### 1. ROBOT_IMAGE
**Node ID:** `263:1219`  
**Static Image:** `robot-image.png`

```pseudo
RobotImage {
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

  SOURCE: "/design-system/tag-images/robot-image.png"
}
```

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| robot-image | `/design-system/tag-images/robot-image.png` |

## Implementation Notes

Reuse `DsImage`. Do not inline SVG. Used by `[COMPONENT] Tag` (`type=ai-agents`).

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| className | string | — | Optional class override |
