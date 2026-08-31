# Game Thumbnail Image Blueprint

## Design Overview

**Template Name:** game-thumbnail-image  
**Node ID:** `267:193`  
**Purpose:** Cropped 60×35 thumbnail of Pluto on grass, used inside `game-button`.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| none | image asset | Scene + character |

### Spacing
| Token | Value |
|-------|-------|
| none | 60×35.455 fixed |

### Border Radius
| Token | Value |
|-------|-------|
| raw | 2.727px |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: GameThumbnailImage
├── LAYOUT: None (clip frame)
├── WIDTH: 60px (Fixed)
├── HEIGHT: 35.455px (Fixed)
│
└── [ELEMENT] FlattenedScene
```

## Component Specifications

### 1. GAME_THUMBNAIL_IMAGE
**Node ID:** `267:193`  
**Static Image:** `game-thumbnail-image.png`

```pseudo
GameThumbnailImage {
  TYPE: Container (Image Frame)
  POSITION: Relative

  DIMENSIONS:
    - width: 60px (Fixed)
    - height: 35.455px (Fixed)
    - aspect-ratio: 60 / 35.455

  CORNER-RADIUS: 2.727px (raw)
  OVERFLOW: Clip
  OPACITY: 100%

  CHILDREN:
    └── FlattenedScene {
          TYPE: Image
          OBJECT-FIT: Cover
          SOURCE: "/design-system/tag-images/game-thumbnail-image.png"
        }
}
```

Figma composites a grass fill plus a character overlay. The committed flattened PNG is the source of truth in code.

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| game-thumbnail-image | `/design-system/tag-images/game-thumbnail-image.png` |

## Implementation Notes

Reuse `DsImage`. Used by `[COMPONENT] GameButton`.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| className | string | — | Optional class override |
