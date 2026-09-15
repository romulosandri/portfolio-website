import { useState } from 'react'
import { ToolLayout } from './ToolLayout'
import { ColorInput, ControlGroup, Divider, PresetButton, RangeInput } from './Controls'

type Preset = {
  name: string
  config: GradientConfig
}

type GradientConfig = {
  baseColor: string
  blockCount: number
  minSize: number
  maxSize: number
  spacing: number
}

const presets: Preset[] = [
  {
    name: 'Default',
    config: {
      baseColor: '#5d5548',
      blockCount: 20,
      minSize: 80,
      maxSize: 200,
      spacing: 8,
    },
  },
  {
    name: 'Dense',
    config: {
      baseColor: '#a89a8f',
      blockCount: 30,
      minSize: 60,
      maxSize: 140,
      spacing: 4,
    },
  },
  {
    name: 'Large Blocks',
    config: {
      baseColor: '#807164',
      blockCount: 12,
      minSize: 120,
      maxSize: 280,
      spacing: 12,
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

type Block = {
  x: number
  y: number
  width: number
  height: number
  gradient: string[]
  angle: number
}

function generateBlocks(config: GradientConfig, scale: string[]): Block[] {
  const blocks: Block[] = []
  const canvasSize = 800

  for (let i = 0; i < config.blockCount; i++) {
    const width = Math.random() * (config.maxSize - config.minSize) + config.minSize
    const height = Math.random() * (config.maxSize - config.minSize) + config.minSize
    const x = Math.random() * (canvasSize - width)
    const y = Math.random() * (canvasSize - height)

    const numColors = Math.floor(Math.random() * 3) + 2
    const gradient: string[] = []
    for (let j = 0; j < numColors; j++) {
      const colorIndex = Math.floor(Math.random() * scale.length)
      gradient.push(scale[colorIndex])
    }

    const angle = Math.floor(Math.random() * 360)

    blocks.push({ x, y, width, height, gradient, angle })
  }

  return blocks
}

export function BlockGradients() {
  const [config, setConfig] = useState<GradientConfig>(presets[0].config)
  const [scale, setScale] = useState(() => generateOklchScale(presets[0].config.baseColor))
  const [blocks, setBlocks] = useState(() => generateBlocks(presets[0].config, generateOklchScale(presets[0].config.baseColor)))

  const updateConfig = (updates: Partial<GradientConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)

    const newScale = updates.baseColor ? generateOklchScale(updates.baseColor) : scale
    if (updates.baseColor) setScale(newScale)

    setBlocks(generateBlocks(newConfig, newScale))
  }

  const applyPreset = (preset: Preset) => {
    setConfig(preset.config)
    const newScale = generateOklchScale(preset.config.baseColor)
    setScale(newScale)
    setBlocks(generateBlocks(preset.config, newScale))
  }

  const regenerate = () => {
    setBlocks(generateBlocks(config, scale))
  }

  const controls = (
    <div className="flex flex-col gap-2xl">
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

      <ControlGroup label="Number of Blocks">
        <RangeInput value={config.blockCount} onChange={(blockCount) => updateConfig({ blockCount })} min={5} max={50} />
      </ControlGroup>

      <ControlGroup label="Min Block Size">
        <RangeInput value={config.minSize} onChange={(minSize) => updateConfig({ minSize })} min={40} max={200} />
      </ControlGroup>

      <ControlGroup label="Max Block Size">
        <RangeInput value={config.maxSize} onChange={(maxSize) => updateConfig({ maxSize })} min={100} max={400} />
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
    <svg width={800} height={800} className="max-w-full border border-solid border-stroke-secondary">
      <defs>
        {blocks.map((block, index) => (
          <linearGradient key={index} id={`gradient-${index}`} gradientTransform={`rotate(${block.angle})`}>
            {block.gradient.map((color, colorIndex) => (
              <stop key={colorIndex} offset={`${(colorIndex / (block.gradient.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </linearGradient>
        ))}
      </defs>
      {blocks.map((block, index) => (
        <rect
          key={index}
          x={block.x}
          y={block.y}
          width={block.width}
          height={block.height}
          fill={`url(#gradient-${index})`}
        />
      ))}
    </svg>
  )

  return (
    <ToolLayout
      title="Block Gradients"
      description="Create random block compositions with OKLCH color gradients"
      controls={controls}
      canvas={canvas}
    />
  )
}
