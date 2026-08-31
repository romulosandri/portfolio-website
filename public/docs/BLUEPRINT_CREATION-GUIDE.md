# Figma Blueprint Generation

## Overview

This project uses the Figma MCP (Model Context Protocol) to extract design information and generate detailed blueprint documentation for email templates and UI components. Follow these rules when creating blueprints from Figma designs.

---

## Workflow

### Step 1: Fetch Figma Context
When the user asks to create a blueprint from Figma:
1. Use `mcp_Figma_Desktop_get_design_context` to fetch the selected frame/component
2. If additional structural info is needed, use `mcp_Figma_Desktop_get_metadata` 
3. For variable definitions, use `mcp_Figma_Desktop_get_variable_defs`
4. For visual reference, use `mcp_Figma_Desktop_get_screenshot`

### Step 2: Extract Design Information
From the Figma MCP response, extract ALL of the following:
- Node IDs for every component and element
- Layout properties (auto-layout/flex, constraints, positioning)
- Dimensions (width, height, aspect ratios)
- Spacing (padding, margins, gaps)
- Visual properties (fills, strokes, shadows, opacity, corner radius)
- Typography (font family, size, weight, line height, letter spacing, alignment)
- Color values (hex, rgba, gradients)
- Image references and assets

### Step 3: Generate Blueprint Document
Create a Markdown file in `docs/` with the naming convention:
`BLUEPRINT-{TEMPLATE-NAME}.md`

---

## Blueprint Document Structure

Every blueprint MUST include the following sections in this order:

### 1. Design Overview
```markdown
# {TEMPLATE_NAME} Blueprint

## Design Overview

**Template Name:** {Full template name from Figma}  
**Node ID:** `{node-id}`  
**Purpose:** {Brief description of the template's purpose}
```

### 2. Design Tokens & Variables
Extract and document ALL design tokens:

```markdown
## Design Tokens & Variables

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `{token-name}` | `{hex/rgba}` | {where it's used} |

### Typography
| Style | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------|-------------|------|--------|-------------|----------------|
| {style-name} | `{font}` | {size}px | {weight} | {line-height} | {spacing} |

### Spacing
| Token | Value |
|-------|-------|
| `{name}` | {value}px |

### Border Radius
| Token | Value |
|-------|-------|
| `{name}` | {value}px |

### Shadows
| Name | Definition |
|------|------------|
| `{name}` | `{shadow-definition}` |
```

### 3. Component Hierarchy (Pseudo-Code)
Provide a high-level tree view:

```markdown
## Component Hierarchy (Pseudo-Code)

\`\`\`pseudo
ROOT: {Template Name}
├── LAYOUT: {Flex Column/Row/Grid}
├── WIDTH: {value}
├── HEIGHT: {value}
├── ALIGNMENT: {alignment}
├── GAP: {gap}
│
├── [COMPONENT] {ComponentName1}
├── [COMPONENT] {ComponentName2}
└── [COMPONENT] {ComponentName3}
\`\`\`
```

### 4. Component Specifications
For EACH component, document in this exact format:

```markdown
### {N}. {COMPONENT_NAME}
**Node ID:** `{node-id}`  
**Static Image:** `{filename}` (if applicable)

\`\`\`pseudo
{ComponentName} {
  TYPE: {Container/Text/Image/Button Container/etc.}
  POSITION: {Relative/Absolute}
  
  DIMENSIONS:
    - width: {value} ({Fill Parent/Fixed/Hug Content})
    - height: {value} ({Fill Parent/Fixed/Hug Content/Auto})
    - aspect-ratio: {ratio} (if applicable)
  
  AUTO-LAYOUT: {Yes/No} ({Flex/None})
    - direction: {Row/Column}
    - align-items: {Start/Center/End/Stretch}
    - justify-content: {Start/Center/End/Space-Between}
    - gap: {value}px
  
  PADDING:
    - top: {value}px
    - right: {value}px
    - bottom: {value}px
    - left: {value}px
  
  FILL:
    - type: {Solid/Gradient}
    - color: {hex/rgba} ({token-name})
    - layers: (for gradients)
      1. {gradient-definition}
      2. {gradient-definition}
  
  STROKE:
    - position: {Inside/Outside/Center/Top/Bottom}
    - weight: {value}px
    - color: {hex/rgba} ({token-name})
  
  CORNER-RADIUS: {value}px ({token-name})
  OVERFLOW: {Visible/Clip}
  OPACITY: {value}%
  
  SHADOW:
    - outer: {shadow-definition}
    - inner: {shadow-definition}
  
  CHILDREN:
    ├── [ELEMENT/COMPONENT] {ChildName1}
    └── [ELEMENT/COMPONENT] {ChildName2}
}
\`\`\`
```

### 5. Text Element Specification
For text elements, ALWAYS include:

```markdown
\`\`\`pseudo
{TextElementName} {
  TYPE: Text
  POSITION: Relative
  
  DIMENSIONS:
    - width: {value} ({Fill Parent/Fixed})
    - height: Auto (Hug Content)
  
  CONTENT: "{The actual text content}"
  
  TYPOGRAPHY:
    - font-family: "{Font Name}"
    - font-style: {Regular/Italic/Bold Italic}
    - font-size: {value}px ({token})
    - font-weight: {value} ({weight-name})
    - line-height: {value}px or {ratio} ({leading-token})
    - letter-spacing: {value}px
    - text-align: {Left/Center/Right}
    - white-space: {normal/nowrap}
    - text-decoration: {none/underline}
  
  COLOR: {hex} ({token-name})
  
  OPACITY: {value}%
}
\`\`\`
```

### 6. Image Element Specification
For images, include:

```markdown
\`\`\`pseudo
{ImageElementName} {
  TYPE: {Image/Container (Image Frame)}
  POSITION: {Relative/Absolute}
  
  DIMENSIONS:
    - width: {value}
    - height: {value}
    - aspect-ratio: {width} / {height}
  
  PLACEMENT: (for absolute positioning)
    - left: {value}
    - top: {value}
    - transform: {transform-value}
  
  OBJECT-FIT: {Cover/Contain/Fill}
  OBJECT-POSITION: {position}
  
  SOURCE: "{filename}" (static/{filename})
}
\`\`\`
```

### 7. Button Component Specification
For buttons, include all interactive states context:

```markdown
\`\`\`pseudo
{ButtonName} {
  TYPE: Button Container
  POSITION: Relative
  
  DIMENSIONS:
    - width: {value}
    - height: Auto (Hug Content)
  
  AUTO-LAYOUT: Yes (Flex)
    - direction: Row
    - align-items: Center
    - justify-content: Center
    - gap: {value}px
  
  PADDING:
    - top: {value}px
    - right: {value}px
    - bottom: {value}px
    - left: {value}px
  
  FILL:
    - type: Solid
    - color: {hex} ({variant-token})
  
  STROKE: (if applicable)
    - position: {position}
    - weight: {value}px
    - color: {hex} ({token})
  
  CORNER-RADIUS: {value}px
  OVERFLOW: Clip
  
  SHADOW:
    - outer: {shadow-definition}
    - inner: {shadow-definition}
  
  CHILDREN:
    └── Label {
          TYPE: Container
          // ... nested structure
        }
}
\`\`\`
```

### 8. Static Assets Mapping
List all static assets:

```markdown
## Static Assets Mapping

| Figma Element | Static File |
|---------------|-------------|
| {Element Name} | `static/{filename}` |
```

### 9. Implementation Notes
Include platform-specific guidance:

```markdown
## Implementation Notes

### Email-Specific Considerations
1. **Tables vs Flexbox**: {guidance}
2. **Inline Styles**: {guidance}
3. **Image Hosting**: {guidance}
4. **Max Width**: {guidance}
5. **Font Fallbacks**: {guidance}

### Font Stack Recommendations
\`\`\`css
/* {Font Name} */
font-family: '{Font Name}', {fallback1}, {fallback2}, {generic};
\`\`\`

### Color Variables Summary
\`\`\`css
:root {
  --{token-name}: {value};
}
\`\`\`
```

---

## Pseudo-Code Conventions

### Property Values
- Use exact pixel values: `32px`, `14px`
- Use percentages where applicable: `100%`, `50%`
- Use tokens in parentheses: `#18181b (bg/default)`
- Use descriptive sizing: `Fill Parent`, `Hug Content`, `Fixed`

### Hierarchy Indicators
- `├──` for non-last children
- `└──` for last child
- `│` for continuation lines
- `[COMPONENT]` for reusable/complex components
- `[ELEMENT]` for simple elements

### Comments in Pseudo-Code
- Use `// comment` for inline notes
- Use `(Note: ...)` for important clarifications
- Reference other sections: `See Section X.X`

---

## Quality Checklist

Before finalizing a blueprint, verify:

- [ ] All Node IDs are documented
- [ ] Every component has TYPE, POSITION, DIMENSIONS
- [ ] Auto-layout properties are complete (direction, alignment, gap)
- [ ] All padding values are specified (top, right, bottom, left)
- [ ] Fill colors include both value AND token name
- [ ] Typography includes ALL properties (family, size, weight, line-height, spacing, align)
- [ ] Images have SOURCE paths mapped to static folder
- [ ] Component hierarchy matches Figma layer structure
- [ ] Design tokens table is complete
- [ ] Static assets are mapped
- [ ] Implementation notes are relevant to the template type

---

## File Organization

```
docs/
├── BLUEPRINT-{TEMPLATE-NAME-1}.md
├── BLUEPRINT-{TEMPLATE-NAME-2}.md
├── COLORS.md          # Shared color tokens
├── FONTS.md           # Shared typography
├── IMAGES-GUIDE.md    # Image handling guide
├── RESPONSIVE-GUIDE.md # Responsive patterns
└── README.md          # Documentation index
```

---

## Common Patterns

### Gradient Definitions
```
linear-gradient({angle}deg, {color1} {stop1}%, {color2} {stop2}%)
```

### Shadow Definitions
```
{x}px {y}px {blur}px rgba({r},{g},{b},{a})
inset {x}px {y}px {blur}px rgba({r},{g},{b},{a})
```

### Flex Shorthand
```
- direction: Column
- align-items: Center
- justify-content: Center
- gap: 32px
```

---

## MCP Tool Usage Reference

### get_design_context
Primary tool for extracting design information. Use for:
- Component structure and hierarchy
- Layout properties (auto-layout, constraints)
- Visual styles (colors, typography, effects)
- Nested children details

### get_metadata
Use when you need:
- Page-level overview
- Layer structure without full detail
- Node IDs for subsequent detailed queries

### get_variable_defs
Use for:
- Design token extraction
- Color variable definitions
- Spacing/sizing variables

### get_screenshot
Use for:
- Visual reference documentation
- Verifying design interpretation
- Complex visual elements

---

## Example Workflow

1. User selects frame in Figma
2. User requests: "Create a blueprint for this template"
3. Call `mcp_Figma_Desktop_get_design_context` with appropriate nodeId
4. Parse the response for all design properties
5. Structure into blueprint markdown format
6. Save to `docs/BLUEPRINT-{NAME}.md`
7. Verify all checklist items are covered

---

## Notes on Token Extraction

When extracting colors, prefer:
1. Variable/token names if available: `bg/default`
2. Hex values for solid colors: `#18181b`
3. RGBA for transparency: `rgba(255,255,255,0.15)`

When extracting typography:
1. Use exact font family names: `Instrument Serif`, `Geist`
2. Include weight as both number and name: `600 (SemiBold)`
3. Line height can be px or ratio: `20px` or `0.88`

---

## Multi-Language Support

For content in other languages (Portuguese, etc.):
- Preserve original text in CONTENT fields
- Use UTF-8 encoding
- Note special characters in implementation notes

