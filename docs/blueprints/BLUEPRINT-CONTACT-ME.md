# Contact Me Page Blueprint

## Design Overview

**Template Name:** contact-me  
**Node ID:** `205:1083`  
**Purpose:** Contact form, direct details, socials, project visual.

## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background-primary` | `#fbfbf8` | Page |
| `foreground-primary` | `#0e0907` | Title |
| `foreground-secondary` | `#2c2321` | Labels, contact values |
| `foreground-quaternary` | `#807164` | Placeholders |
| `stroke-secondary` | `#e9e4e2` | Inputs, dashed rule |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| headers/h1 | `font-heading` | 64px (`text-4xl`) | 400 | 1 | 0 |
| body/body-default | `font-body` | 14px (`text-sm`) | 400 | 1.3 | 0 |

### Spacing
| Token | Value |
|-------|-------|
| `spacing-4xl` | 48px |
| `spacing-2xl` | 24px |
| `spacing-xl` | 16px |
| `spacing-lg` | 12px |
| `spacing-md` | 8px |
| raw | 164px (section vertical padding) |
| raw | 120px (form/visual gap) |
| raw | 904×678 (visual) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: ContactMe
├── [COMPONENT] NavBar  // Contact Me selected
├── [ELEMENT] Main (row, gap 120px, padding 48px 164px)
│   ├── [ELEMENT] FormColumn (flex 1, gap 48px)
│   │   ├── Title “Contact Me” (text-h1)
│   │   ├── Name + Email inputs
│   │   ├── Message textarea
│   │   ├── Dashed rule
│   │   ├── WhatsApp + Email
│   │   └── [COMPONENT] SocialIcon × 5
│   └── [ELEMENT] Visual 904×678, overflow clip
└── [COMPONENT] FooterSection
```

## Component Specifications

### 1. FORM
**Node ID:** `212:1150`

```pseudo
Input {
  LABEL: text-body-default, foreground-secondary
  FIELD: border 1px stroke-secondary, padding 16px (spacing-xl)
  PLACEHOLDER: foreground-quaternary, text-body-default
}

FIELDS:
  Your Name / “John Doe Jr”
  Email Address / “john@doe.com”
  Your Message / “I want to hire you to…” (flex height, group 241px)

Direct:
  WhatsApp  +5563984602704
  Email     romulosandrirodrigues@gmail.com
  GAP: 24px (spacing-2xl)
```

There is no Input component in the design system — build these as page elements using existing color/type/spacing tokens only.

### 2. VISUAL
**Node ID:** `225:1059`

```pseudo
Visual {
  WIDTH: 904px
  HEIGHT: 678px
  OVERFLOW: Clip
  FILL: #e6e6e6  // raw, frame only
  SOURCE: "/images/contact/gemhaus.png"
}
```

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| gemhaus-3 | `/images/contact/gemhaus.png` |

## Implementation Notes

Import `NavBar`, `FooterSection`, `SocialIcon`. Route: `/contact`. TalkButton points here.
