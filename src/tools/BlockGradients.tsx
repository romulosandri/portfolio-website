import { useState } from 'react'
import { ToolLayout } from './ToolLayout'
import { ColorInput, ControlGroup, Divider, PresetButton, RangeInput } from './Controls'

type Preset = {
  name: string
  config: GradientConfig
}

type GradientConfig = {
  baseColor: string
  columns: number
  rows: number
  cellSize: number
}

const presets: Preset[] = [
  {
    name: 'Default',
    config: {
      baseColor: '#5d5548',
      columns: 8,
      rows: 8,
      cellSize: 80,
    },
  },
  {
    name: 'Dense Grid',
    config: {
      baseColor: '#a89a8f',
      columns: 12,
      rows: 12,
      cellSize: 60,
    },
  },
  {
    name: 'Large Tiles',
    config: {
      baseColor: '#807164',
      columns: 5,
      rows: 5,
      cellSize: 120,
    },
  },
]

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 }
}

function rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

  const C = Math.sqrt(a * a + b_ * b_)
  const h = (Math.atan2(b_, a) * 180) / Math.PI

  return { l: L, c: C, h: h < 0 ? h + 360 : h }
}

function oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  const hRad = (h * Math.PI) / 180
  const a = c * Math.cos(hRad)
  const b = c * Math.sin(hRad)

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b

  const l3 = l_ * l_ * l_
  const m3 = m_ * m_ * m_
  const s3 = s_ * s_ * s_

  const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
  const b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3

  return {
    r: Math.max(0, Math.min(1, r)),
    g: Math.max(0, Math.min(1, g)),
    b: Math.max(0, Math.min(1, b_)),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function generateOklchScale(baseColor: string): string[] {
  const rgb = hexToRgb(baseColor)
  const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b)

  const lightnesses = [0.97, 0.93, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15]

  return lightnesses.map((targetL) => {
    const adjusted = oklchToRgb(targetL, oklch.c, oklch.h)
    return rgbToHex(adjusted.r, adjusted.g, adjusted.b)
  })
}

type Cell = {
  gradient: string[]
  angle: number
}

function generateGrid(config: GradientConfig, scale: string[]): Cell[][] {
  const grid: Cell[][] = []

  for (let row = 0; row < config.rows; row++) {
    const rowCells: Cell[] = []
    for (let col = 0; col < config.columns; col++) {
      const numColors = Math.floor(Math.random() * 3) + 2
      const gradient: string[] = []
      for (let i = 0; i < numColors; i++) {
        const colorIndex = Math.floor(Math.random() * scale.length)
        gradient.push(scale[colorIndex])
      }
      const angle = Math.floor(Math.random() * 360)
      rowCells.push({ gradient, angle })
    }
    grid.push(rowCells)
  }

  return grid
}

export function BlockGradients() {
  const [config, setConfig] = useState<GradientConfig>(presets[0].config)
  const [scale, setScale] = useState(() => generateOklchScale(presets[0].config.baseColor))
  const [grid, setGrid] = useState(() => generateGrid(presets[0].config, generateOklchScale(presets[0].config.baseColor)))

  const updateConfig = (updates: Partial<GradientConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)

    const newScale = updates.baseColor ? generateOklchScale(updates.baseColor) : scale
    if (updates.baseColor) setScale(newScale)

    setGrid(generateGrid(newConfig, newScale))
  }

  const applyPreset = (preset: Preset) => {
    setConfig(preset.config)
    const newScale = generateOklchScale(preset.config.baseColor)
    setScale(newScale)
    setGrid(generateGrid(preset.config, newScale))
  }

  const regenerate = () => {
    setGrid(generateGrid(config, scale))
  }

  const totalWidth = config.columns * config.cellSize
  const totalHeight = config.rows * config.cellSize

  const controls = (
    <div className="flex flex-col gap-xl xs:gap-2xl">
      <ControlGroup label="Base Color">
        <ColorInput value={config.baseColor} onChange={(baseColor) => updateConfig({ baseColor })} />
      </ControlGroup>

      <Divider />

      <div className="flex flex-col gap-md">
        <span className="text-body-small text-foreground-secondary">OKLCH Scale (50-950)</span>
        <div className="grid grid-cols-5 gap-sm">
          {scale.map((color, index) => (
            <div
              key={index}
              className="aspect-square border border-solid border-stroke-secondary"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      <Divider />

      <ControlGroup label="Grid Columns">
        <RangeInput value={config.columns} onChange={(columns) => updateConfig({ columns })} min={2} max={16} />
      </ControlGroup>

      <ControlGroup label="Grid Rows">
        <RangeInput value={config.rows} onChange={(rows) => updateConfig({ rows })} min={2} max={16} />
      </ControlGroup>

      <ControlGroup label="Cell Size">
        <RangeInput value={config.cellSize} onChange={(cellSize) => updateConfig({ cellSize })} min={40} max={150} />
      </ControlGroup>

      <PresetButton label="Regenerate" onClick={regenerate} />

      <Divider />

      <div className="flex flex-col gap-md">
        <span className="text-body-small text-foreground-secondary">Presets</span>
        {presets.map((preset) => (
          <PresetButton key={preset.name} label={preset.name} onClick={() => applyPreset(preset)} />
        ))}
      </div>
    </div>
  )

  const canvas = (
    <svg width={totalWidth} height={totalHeight} className="max-w-full" viewBox={`0 0 ${totalWidth} ${totalHeight}`}>
      <defs>
        {grid.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const id = `gradient-${rowIndex}-${colIndex}`
            return (
              <linearGradient key={id} id={id} gradientTransform={`rotate(${cell.angle})`}>
                {cell.gradient.map((color, colorIndex) => (
                  <stop key={colorIndex} offset={`${(colorIndex / (cell.gradient.length - 1)) * 100}%`} stopColor={color} />
                ))}
              </linearGradient>
            )
          }),
        )}
      </defs>
      {grid.map((row, rowIndex) =>
        row.map((_cell, colIndex) => (
          <rect
            key={`${rowIndex}-${colIndex}`}
            x={colIndex * config.cellSize}
            y={rowIndex * config.cellSize}
            width={config.cellSize}
            height={config.cellSize}
            fill={`url(#gradient-${rowIndex}-${colIndex})`}
          />
        )),
      )}
    </svg>
  )

  return (
    <ToolLayout
      title="Block Gradients"
      description="Gapless grid with OKLCH gradient tiles from a base color"
      controls={controls}
      canvas={canvas}
    />
  )
}
