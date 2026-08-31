# Project Detail Page Blueprint

## Design Overview

**Template Name:** project-detail-page  
**Node ID:** `79:358`  
**Purpose:** Case study (Meltwater). Display title, metadata + image stack, related work, footer.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-primary` | `#fbfbf8` | Hero, meta |
| `background-secondary` | `#f6f6f3` | Related work |
| `foreground-primary` | `#0e0907` | Title, values |
| `foreground-tertiary` | `#494137` | Labels |
| `stroke-secondary` | `#e9e4e2` | Rules, dashed dividers |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| headers/display | `font-heading` | 180px (`text-d`) | 400 | 0.8 | 0 |
| headers/h2 | `font-heading` | 36px (`text-3xl`) | 400 | 1 | 0 |
| headers/h4 | `font-heading` | 20px (`text-lg`) | 400 | 1 | 0 |
| body/body-default | `font-body` | 14px (`text-sm`) | 400 | 1.3 | 0 |
| body/body-small | `font-body` | 12px (`text-xsm`) | 400 | 1.25 | 0 |
| body/body-large | `font-body` | 16px (`text-md`) | 400 | 1.1 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-4xl` | 48px |
| `spacing-3xl` | 32px |
| `spacing-2xl` | 24px |
| `spacing-xl` | 16px |
| `spacing-lg` | 12px |
| raw | 10px (meta stack gaps) |
| raw | 164px (detail bottom padding) |
| raw | 560px (title height) |
| raw | 480px (meta column width) |
| raw | 160px (meta pair column) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: ProjectDetailPage
├── [COMPONENT] NavBar
├── [ELEMENT] TitleBlock “Meltwater” display
├── [ELEMENT] DetailSection
│   ├── [ELEMENT] MetaColumn width 480px
│   │   ├── Description
│   │   ├── Client | Role
│   │   ├── Year | Duration
│   │   └── Delivered list (dashed dividers)
│   └── [ELEMENT] ImageStack (4 images, aspect 2048/1536, gap 24px)
├── [ELEMENT] RelatedWork (background-secondary)
│   ├── Header “Work” + caption
│   └── Horizontal row of WorkCards (overflow clip)
└── [COMPONENT] FooterSection
```

## Component Specifications

### 1. META_COLUMN
**Node ID:** `79:398`

```pseudo
MetaColumn {
  WIDTH: 480px
  border-top: 1px stroke-secondary
  PADDING-TOP: 24px
  GAP: 32px (spacing-3xl)

  Field {
    Label: text-body-small, foreground-tertiary
    Value: text-body-default, foreground-primary
    GAP: 10px (raw)
  }

  CONTENT:
    Description: “Norem ipsum dolor sit amet, …”
    Client: Stream Streaks
    Role: Product Designer
    Year: 2024-2025
    Duration: 13 Months
    Delivered:
      - Full Design System with components and tokens
      - 91 high resolution and responsive screens in light and dark modes
      - Desktop research on competitors and the industry
      - Kickoff and brand workshops to learn about the problem
}
```

### 2. RELATED_WORK
**Node ID:** `81:1173`

```pseudo
RelatedWork {
  FILL: background-secondary
  PADDING: 48px
  OVERFLOW: Clip
  Header same as home Work header
  Row: gap 20px (spacing-1xl), cards width 904px, do not wrap
}
```

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| Image stack | `/images/work/meltwater/avif/meltwater-cover.avif`, `meltwater-1.avif`… |

## Implementation Notes

Import `NavBar`, `FooterSection`. Route: `/work/meltwater`. Other work slugs reuse this layout with their covers.
