# Name Logo Blueprint

## Design Overview

**Template Name:** name-logo  
**Node ID:** `19:461`  
**Purpose:** Mixed-style wordmark “romulo ✦ sandri” for the header. Composed of `[COMPONENT] Letter` and `[COMPONENT] Symbol`.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `foreground-primary` | `#0e0907` | Letter fills (in assets) |
| `foreground-secondary` | `#2c2321` | Symbol 16 fill |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-3xl` | 32px (gap between first name, symbol, last name) |
| raw | 14px (gap between letters) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: NameLogo
├── LAYOUT: Flex Row
├── WIDTH: Hug (~394px)
├── HEIGHT: Hug (~25px)
├── GAP: 32px (spacing-3xl)
│
├── [ELEMENT] FirstName  // romulo
│   └── [COMPONENT] Letter × 6
├── [COMPONENT] Symbol variant="16"
└── [ELEMENT] LastName   // sandri
    └── [COMPONENT] Letter × 6
```

## Component Specifications

### 1. NAME_LOGO
**Node ID:** `19:461`

```pseudo
NameLogo {
  TYPE: Container
  AUTO-LAYOUT: Yes (Flex)
    - direction: Row
    - align-items: Center
    - gap: 32px (spacing-3xl)

  CHILDREN:
    ├── FirstName {
          AUTO-LAYOUT: Row
          gap: 14px (raw)
          align-items: Center
          CHILDREN (letter, style):
            ├── r / 2
            ├── o / 12
            ├── m / 6
            ├── u / 10
            ├── l / 4
            └── o / 7
        }
    ├── [COMPONENT] Symbol (variant="16", 16×16)
    └── LastName {
          AUTO-LAYOUT: Row
          gap: 14px (raw)
          align-items: Center
          CHILDREN (letter, style):
            ├── s / 2
            ├── a / 13
            ├── n / 5
            ├── d / 9
            ├── r / 1
            └── i / 7
        }
}
```

## Implementation Notes

Import `Letter` and `Symbol`. Do not flatten to a single SVG. NavBar instances are scaled to ~0.855 of this size.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| href | string | `'#top'` | Home link |
| className | string | — | Optional class override |
