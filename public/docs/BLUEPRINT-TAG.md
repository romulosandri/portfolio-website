# Tag Blueprint

## Design Overview

**Template Name:** tag  
**Node ID:** `22:1254`  
**Purpose:** Audience chip with a character avatar and label. Variants: AI Agents, Humans.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-white` | `#ffffff` | Chip fill |
| `foreground-tertiary` | `#494137` (`cobblestone-700`) | Label |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| body/body-small | `font-body` (Saans) | 12px (`text-xsm`) | 400 | 1.25 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-none` | 0px (gap) |
| `spacing-sm` | 6px (horizontal padding) |
| `spacing-2xs` | 2px (vertical padding) |

### Border Radius
| Token | Value |
|-------|-------|
| raw | 4px (`radius-xsm`) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: Tag
├── LAYOUT: Flex Row
├── WIDTH: Hug Content
├── HEIGHT: 28px
├── ALIGNMENT: Center
├── GAP: 0px
│
├── [COMPONENT] RobotImage | HumanImage
└── [ELEMENT] Label
```

## Component Specifications

### 1. TAG_AI_AGENTS
**Node ID:** `22:1253`

```pseudo
Tag_AiAgents {
  TYPE: Container
  POSITION: Relative

  DIMENSIONS:
    - width: 88px (Hug Content)
    - height: 28px (Hug Content)

  AUTO-LAYOUT: Yes (Flex)
    - direction: Row
    - align-items: Center
    - justify-content: Center
    - gap: 0px (spacing-none)

  PADDING:
    - top: 2px (spacing-2xs)
    - right: 6px (spacing-sm)
    - bottom: 2px (spacing-2xs)
    - left: 6px (spacing-sm)

  FILL:
    - type: Solid
    - color: #ffffff (background-white)

  CORNER-RADIUS: 4px (radius-xsm)
  OVERFLOW: Visible
  OPACITY: 100%

  CHILDREN:
    ├── [COMPONENT] RobotImage
    └── Label {
          TYPE: Text
          CONTENT: "AI Agents"
          TYPOGRAPHY: body/body-small
          COLOR: #494137 (foreground-tertiary)
          white-space: nowrap
        }
}
```

### 2. TAG_HUMANS
**Node ID:** `22:1255`

Same as TAG_AI_AGENTS except width 81px, `[COMPONENT] HumanImage`, label `"Humans"`.

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| robot-image | `[COMPONENT] RobotImage` |
| human-image | `[COMPONENT] HumanImage` |

## Implementation Notes

Do not rebuild the avatars. Import `RobotImage` and `HumanImage`.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| type | `'ai-agents' \| 'humans'` | `'ai-agents'` | Variant |
| className | string | — | Optional class override |
