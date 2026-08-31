# Logos Ticker Blueprint

## Design Overview

**Template Name:** logos-ticker  
**Node ID:** `19:923`  
**Purpose:** Full-width marquee of client logos.

## Design Tokens & Variables

### Spacing
| Token | Value |
|-------|-------|
| `spacing-4xl` | 48px (logo gap) |
| `spacing-2xl` | 24px (vertical padding) |

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: LogosTicker
├── LAYOUT: Flex Row
├── WIDTH: 1920px (Fill)
├── HEIGHT: 153px
├── OVERFLOW: Clip
│
└── [ELEMENT] Track (duplicated for loop)
    └── [COMPONENT] Logo × 24
```

## Component Specifications

### 1. LOGOS_TICKER
**Node ID:** `19:923`

```pseudo
LogosTicker {
  TYPE: Container
  AUTO-LAYOUT: Row
    - align-items: Center
    - justify-content: Center
    - gap: 48px (spacing-4xl)
  PADDING:
    - top: 24px (spacing-2xl)
    - bottom: 24px
  OVERFLOW: Clip
  WIDTH: 100%

  CHILDREN:
    └── Track {
          AUTO-LAYOUT: Row
          gap: 48px (spacing-4xl)
          align-items: Center
          Logo order:
            miro, dell, meltwater, cinepolis, air-force, grepp,
            talent-systems, justos, afrl, numinos, andela, wandr,
            asset-panda, dev-signal, suncity, knownlenders,
            dev-signal, barspin-ventures, arqu, fotospin,
            pacelane, rsd, os-nossos, paragon
        }
}
```

## Implementation Notes

Import `Logo`. Duplicate the track and animate with GSAP (`useGSAP`, ease none, infinite). Honor `prefers-reduced-motion`.

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| className | string | — | Optional class override |
