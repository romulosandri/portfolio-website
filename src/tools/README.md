# Brand Tools

Interactive tools for generating brand visuals and color patterns.

## Tools

### 1. Candle Sticks
Generate vertical candle patterns made of stacked rectangles with customizable colors and layouts.

**Controls:**
- Columns and rows (1-20 each)
- Candle width and height
- Gap between candles
- Two custom colors
- Rectangles per candle (2-3)
- Regenerate button for new random patterns

**Presets:** Dense Grid, Wide Stripes, Minimal

### 2. Block Gradients
Create random block compositions with OKLCH color gradients from a base color.

**Controls:**
- Base color picker (generates full OKLCH 50-950 scale)
- Number of blocks (5-50)
- Min/max block sizes
- Regenerate button

**Presets:** Default, Dense, Large Blocks

**Technical Note:** Uses perceptually uniform OKLCH color space to generate aesthetically pleasing gradient scales.

### 3. Color Stripes
Generate random stripe patterns from a custom 4-color palette.

**Controls:**
- Four custom color inputs
- Number of stripes (10-60)
- Width range (min/max)
- Height range (min/max)
- Regenerate button

**Presets:** Default, Warm Tones, Cool Blues

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Access tools at http://localhost:5173/tools/
```

## Build

```bash
# Build all entry points (main, jobs, tools)
npm run build:spa
```

## Deployment

The tools area is configured to run on `tools.romulosandri.com` subdomain via Netlify redirects in `netlify.toml`.

### Setup Steps:
1. Add DNS CNAME record: `tools.romulosandri.com` → your Netlify site
2. In Netlify dashboard: Add custom domain `tools.romulosandri.com`
3. SSL certificate is provisioned automatically

## Architecture

- **Entry Point:** `tools/index.html`
- **Main App:** `src/tools/main.tsx`
- **Router:** `src/tools/App.tsx` (client-side routing)
- **Layout:** Shared `ToolLayout` component
- **Controls:** Reusable control components in `Controls.tsx`
- **Rendering:** All tools use SVG for clean, scalable output

## Design System

Follows the portfolio's existing design system:
- Tailwind CSS v4 with custom theme
- Typography utilities (text-h1, text-h2, text-body-default, etc.)
- Color palette (cobblestone scale)
- Spacing system (gutter, xl, 2xl, 3xl, 4xl)
- Consistent border styles and transitions
