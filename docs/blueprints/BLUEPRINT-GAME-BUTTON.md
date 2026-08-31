# Game Button Blueprint

## Design Overview

**Template Name:** game-button  
**Node ID:** `168:905`  
**Purpose:** Header CTA that launches the walkable game. Hover darkens the wordmark and rotates the joystick.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-white` | `#ffffff` | Button fill |
| `foreground-tertiary` | `#494137` | Default “Play Game” fill |
| `foreground-primary` | `#0e0907` | Hover “Play Game” fill |
| `foreground-secondary` | `#2c2321` | Joystick stroke |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-sm` | 6px (left padding) |
| `spacing-md` | 8px (right padding) |
| `spacing-xsm` | 4px (vertical padding) |
| raw | 7px (gap) |

### Border Radius
| Token | Value |
|-------|-------|
| `radius-xsm` | 4px |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: GameButton
├── LAYOUT: Flex Row
├── HEIGHT: 43.455px
├── GAP: 7px (raw)
│
├── [COMPONENT] GameThumbnailImage
├── [ELEMENT] PlayGameWordmark (67×16 SVG)
└── [ELEMENT] JoystickIcon (16×16; rotate 24deg on hover)
```

## Component Specifications

### 1. GAME_BUTTON_DEFAULT
**Node ID:** `169:1120`

```pseudo
GameButton_Default {
  TYPE: Button Container
  POSITION: Relative

  DIMENSIONS:
    - width: 171px (Hug Content)
    - height: 43.455px (Hug Content)

  AUTO-LAYOUT: Yes (Flex)
    - direction: Row
    - align-items: Center
    - gap: 7px (raw)

  PADDING:
    - top: 4px (spacing-xsm)
    - right: 8px (spacing-md)
    - bottom: 4px (spacing-xsm)
    - left: 6px (spacing-sm)

  FILL:
    - type: Solid
    - color: #ffffff (background-white)

  CORNER-RADIUS: 4px (radius-xsm)

  CHILDREN:
    ├── [COMPONENT] GameThumbnailImage
    ├── PlayGameWordmark {
          TYPE: Image
          DIMENSIONS: 67×16
          SOURCE: "/design-system/icons/play-game-default.svg"
        }
    └── JoystickIcon {
          TYPE: Image
          DIMENSIONS: 16×16
          SOURCE: "/design-system/icons/joystick.svg"
          transform: none
        }
}
```

### 2. GAME_BUTTON_HOVER
**Node ID:** `169:1351`

Width ~176px. Play Game SVG uses `#0e0907`. Joystick sits in a 21.125px frame rotated `24deg`.

## States

| State | Wordmark fill | Joystick |
|-------|---------------|----------|
| default | foreground-tertiary | 0deg |
| hover | foreground-primary | rotate 24deg |

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| game-thumbnail-image | `[COMPONENT] GameThumbnailImage` |
| Play Game (default) | `/design-system/icons/play-game-default.svg` |
| Play Game (hover) | `/design-system/icons/play-game-hover.svg` |
| joystick | `/design-system/icons/joystick.svg` |

## Implementation Notes

Import `GameThumbnailImage`. Use CSS `:hover` plus optional `forceHover` for the gallery. Used by `[COMPONENT] NavBar`.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| href | string | `'#'` | Destination |
| forceHover | boolean | false | Gallery preview of hover |
| className | string | — | Optional class override |
