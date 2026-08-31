# Footer Button Blueprint

## Design Overview

**Template Name:** footer-button  
**Node ID:** `60:1237`  
**Purpose:** Text link in footer lists. Hover underlines and darkens the label.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `foreground-secondary` | `#2c2321` | Default label |
| `foreground-primary` | `#0e0907` | Hover label |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| body/body-default | `font-body` (Saans) | 14px (`text-sm`) | 400 | 1.3 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-none` | 0px (horizontal padding) |
| `spacing-xsm` | 4px (vertical padding) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: FooterButton
├── LAYOUT: Flex Row
├── WIDTH: Hug Content
├── HEIGHT: 26px
│
└── [ELEMENT] Label
```

## Component Specifications

### 1. FOOTER_BUTTON_DEFAULT
**Node ID:** `60:1236`

```pseudo
FooterButton_Default {
  TYPE: Button Container
  POSITION: Relative

  DIMENSIONS:
    - width: Hug Content
    - height: 26px (Hug Content)

  AUTO-LAYOUT: Yes (Flex)
    - direction: Row
    - align-items: Center
    - justify-content: Start
    - gap: 0px

  PADDING:
    - top: 4px (spacing-xsm)
    - right: 0px
    - bottom: 4px (spacing-xsm)
    - left: 0px

  FILL: none

  CHILDREN:
    └── Label {
          TYPE: Text
          CONTENT: "{label}" (example "Work")
          TYPOGRAPHY: body/body-default
          COLOR: #2c2321 (foreground-secondary)
          text-decoration: none
          white-space: nowrap
        }
}
```

### 2. FOOTER_BUTTON_HOVER
**Node ID:** `60:1238`

Same padding. Label color `#0e0907` (foreground-primary), `text-decoration: underline`.

## States

| State | Trigger | Label color | Decoration |
|-------|---------|-------------|------------|
| Default | none | foreground-secondary | none |
| Hover | `:hover` / `:focus-visible` | foreground-primary | underline |

## Implementation Notes

Render as `<a>`. Used by `[COMPONENT] FooterSection`.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| label | string | required | Link text |
| href | string | `'#'` | Destination |
| className | string | — | Optional class override |
