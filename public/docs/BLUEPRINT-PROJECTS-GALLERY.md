# Projects Gallery Blueprint

## Design Overview

**Template Name:** projects-gallery  
**Node ID:** `123:699`  
**Purpose:** Personal projects grid. Same chrome as work-gallery; title “Projects”.

## Design Tokens & Variables

Same tokens as work-gallery (`BLUEPRINT-WORK-GALLERY.md`).

## Component Hierarchy (Pseudo-Code)

```pseudo
ROOT: ProjectsGallery
├── [COMPONENT] NavBar  // Projects selected
├── [ELEMENT] TitleBlock “Projects” display, height 560px
├── [ELEMENT] GridSection padding 0 48px 164px
│   └── 2-col grid WorkCard pattern
│       Fotospin.ai, Spiiine, Bunnyhop, Kessera, AI Workshops
│       (Figma frame reuses work placeholders; implement with project covers)
└── [COMPONENT] FooterSection
```

## Component Specifications

### 1. TITLE_BLOCK
**Node ID:** `123:701`

Identical to work-gallery title block. Content: “Projects”.

### 2. GRID
**Node ID:** `123:704`

Same card layout as work (image 2048/1536, title `text-h4`, year `text-body-large`). Use project covers under `/images/projects/{slug}/avif/{slug}-cover.avif`. Skip slugs with no cover (Kessera).

## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| Project covers | `/images/projects/{slug}/avif/{slug}-cover.avif` |

## Implementation Notes

Import `NavBar`, `FooterSection`. Route: `/projects`. Do not rebuild cards as a new design-system component.
