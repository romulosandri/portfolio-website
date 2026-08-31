# Nav Item Blueprint

## Design Overview

**Template Name:** nav-item  
**Node ID:** `19:501`  
**Purpose:** Header nav link. Default is tertiary serif text; hover and selected prepend symbol 19 and switch to primary.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `foreground-tertiary` | `#494137` | Default label |
| `foreground-primary` | `#0e0907` | Hover / selected label |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| headers/h5 | `font-heading` (Season Serif) | 16px (`text-md`) | 400 | 1 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-xsm` | 4px (gap) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: NavItem
├── LAYOUT: Flex Row (hover/selected) / Column (default)
├── HEIGHT: 16px
├── GAP: 4px
│
├── [COMPONENT] Symbol variant="19" (hover/selected only)
└── [ELEMENT] Label
```

## Component Specifications

### 1. NAV_ITEM_DEFAULT
**Node ID:** `19:500`

```pseudo
NavItem_Default {
  TYPE: Button Container
  AUTO-LAYOUT: Column
    - gap: 4px (spacing-xsm)
  CHILDREN:
    └── Label {
          TYPE: Text
          CONTENT: "{label}" (example "Work")
          TYPOGRAPHY: headers/h5
          COLOR: #494137 (foreground-tertiary)
          text-align: Center
        }
}
```

### 2. NAV_ITEM_HOVER / SELECTED
**Node IDs:** `19:502`, `19:754`

```pseudo
NavItem_Hover {
  TYPE: Button Container
  AUTO-LAYOUT: Row
    - align-items: Start
    - gap: 4px (spacing-xsm)
  CHILDREN:
    ├── [COMPONENT] Symbol (variant="19", 16×16)
    └── Label {
          TYPOGRAPHY: headers/h5
          COLOR: #0e0907 (foreground-primary)
          white-space: nowrap
        }
}
```

Hover and selected are visually identical.

## States

| State | Icon | Label color |
|-------|------|-------------|
| default | hidden | foreground-tertiary |
| hover | Symbol 19 | foreground-primary |
| selected | Symbol 19 | foreground-primary |

## Implementation Notes

Import `Symbol`. Used by `[COMPONENT] NavBar`.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| label | string | required | Link text |
| href | string | `'#'` | Destination |
| selected | boolean | false | Selected state |
| className | string | — | Optional class override |
