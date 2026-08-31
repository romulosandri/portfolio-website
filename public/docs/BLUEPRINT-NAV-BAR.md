# Nav Bar Blueprint

## Design Overview

**Template Name:** nav-bar  
**Node ID:** `19:517`  
**Purpose:** Site header: scaled name-logo on the left; game-button + nav items on the right.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-primary` | `#fbfbf8` | Bar fill |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-4xl` | 48px (horizontal page padding) |
| `spacing-2xl` | 24px (container vertical padding) |
| `spacing-3xl` | 32px (nav-items gap) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: NavBar
├── LAYOUT: Flex Column, center
├── WIDTH: 1920px (Fill)
├── HEIGHT: 91.455px
│
└── [ELEMENT] Container (space-between)
    ├── [COMPONENT] NameLogo (scaled ~0.855)
    └── [ELEMENT] NavItems
        ├── [COMPONENT] GameButton
        ├── [COMPONENT] NavItem "Work"
        ├── [COMPONENT] NavItem "Life"
        ├── [COMPONENT] NavItem "Projects"
        └── [COMPONENT] NavItem "Contact Me"
```

## Component Specifications

### 1. NAV_BAR
**Node ID:** `19:517`

```pseudo
NavBar {
  TYPE: Container
  FILL: #fbfbf8 (background-primary)
  PADDING:
    - left: 48px (spacing-4xl)
    - right: 48px
    - top: 0
    - bottom: 0

  CHILDREN:
    └── Container {
          AUTO-LAYOUT: Row
          justify-content: Space-Between
          align-items: Center
          PADDING: 24px 0 (spacing-2xl)
          WIDTH: Fill
          CHILDREN:
            ├── [COMPONENT] NameLogo  // 337×20 in this instance
            └── NavItems {
                  AUTO-LAYOUT: Row
                  gap: 32px (spacing-3xl)
                  align-items: Center
                  CHILDREN:
                    ├── [COMPONENT] GameButton
                    └── [COMPONENT] NavItem × 4
                }
        }
}
```

## Implementation Notes

Import `NameLogo`, `GameButton`, `NavItem`. Do not rebuild subtrees.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| className | string | — | Optional class override |
