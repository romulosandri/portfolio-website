import { useState } from 'react'
import { ToolLayout } from './ToolLayout'
import { ColorInput, ControlGroup, Divider, PresetButton, RangeInput } from './Controls'

type Preset = {
  name: string
  config: StripeConfig
}

type StripeConfig = {
  color1: string
  color2: string
  color3: string
  color4: string
  stripeCount: number
  minWidth: number
  maxWidth: number
  minHeight: number
  maxHeight: number
}

const presets: Preset[] = [
  {
    name: 'Default',
    config: {
      color1: '#0c0b0a',
      color2: '#5d5548',
      color3: '#a89a8f',
      color4: '#d9d2ce',
      stripeCount: 25,
      minWidth: 60,
      maxWidth: 200,
      minHeight: 40,
      maxHeight: 120,
    },
  },
  {
    name: 'Warm Tones',
    config: {
      color1: '#8b4513',
      color2: '#d2691e',
      color3: '#f4a460',
      color4: '#ffdead',
      stripeCount: 20,
      minWidth: 80,
      maxWidth: 180,
      minHeight: 60,
      maxHeight: 140,
    },
  },
  {
    name: 'Cool Blues',
    config: {
      color1: '#1e3a5f',
      color2: '#2e5090',
      color3: '#6a8fc7',
      color4: '#b3c9e8',
      stripeCount: 30,
      minWidth: 50,
      maxWidth: 160,
      minHeight: 50,
      maxHeight: 100,
    },
  },
]

type Stripe = {
  x: number
  y: number
  width: number
  height: number
  color: string
  rotation: number
}

function generateStripes(config: StripeConfig): Stripe[] {
  const stripes: Stripe[] = []
  const canvasSize = 800
  const colors = [config.color1, config.color2, config.color3, config.color4]

  for (let i = 0; i < config.stripeCount; i++) {
    const width = Math.random() * (config.maxWidth - config.minWidth) + config.minWidth
    const height = Math.random() * (config.maxHeight - config.minHeight) + config.minHeight
    const x = Math.random() * (canvasSize - width)
    const y = Math.random() * (canvasSize - height)
    const color = colors[Math.floor(Math.random() * colors.length)]
    const rotation = (Math.random() - 0.5) * 30

    stripes.push({ x, y, width, height, color, rotation })
  }

  return stripes
}

export function ColorStripes() {
  const [config, setConfig] = useState<StripeConfig>(presets[0].config)
  const [stripes, setStripes] = useState(() => generateStripes(presets[0].config))

  const updateConfig = (updates: Partial<StripeConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    setStripes(generateStripes(newConfig))
  }

  const applyPreset = (preset: Preset) => {
    setConfig(preset.config)
    setStripes(generateStripes(preset.config))
  }

  const regenerate = () => {
    setStripes(generateStripes(config))
  }

  const controls = (
    <div className="flex flex-col gap-2xl">
      <ControlGroup label="Color 1">
        <ColorInput value={config.color1} onChange={(color1) => updateConfig({ color1 })} />
      </ControlGroup>

      <ControlGroup label="Color 2">
        <ColorInput value={config.color2} onChange={(color2) => updateConfig({ color2 })} />
      </ControlGroup>

      <ControlGroup label="Color 3">
        <ColorInput value={config.color3} onChange={(color3) => updateConfig({ color3 })} />
      </ControlGroup>

      <ControlGroup label="Color 4">
        <ColorInput value={config.color4} onChange={(color4) => updateConfig({ color4 })} />
      </ControlGroup>

      <Divider />

      <div className="flex flex-col gap-md">
        <span className="text-body-small text-foreground-secondary">Color Palette</span>
        <div className="grid grid-cols-4 gap-sm">
          {[config.color1, config.color2, config.color3, config.color4].map((color, index) => (
            <div
              key={index}
              className="aspect-square border border-solid border-stroke-secondary"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <Divider />

      <ControlGroup label="Number of Stripes">
        <RangeInput
          value={config.stripeCount}
          onChange={(stripeCount) => updateConfig({ stripeCount })}
          min={10}
          max={60}
        />
      </ControlGroup>

      <ControlGroup label="Width Range">
        <div className="flex gap-lg">
          <div className="flex-1">
            <label className="text-body-small mb-sm block text-foreground-tertiary">Min</label>
            <RangeInput
              value={config.minWidth}
              onChange={(minWidth) => updateConfig({ minWidth: Math.min(minWidth, config.maxWidth - 10) })}
              min={30}
              max={200}
            />
          </div>
          <div className="flex-1">
            <label className="text-body-small mb-sm block text-foreground-tertiary">Max</label>
            <RangeInput
              value={config.maxWidth}
              onChange={(maxWidth) => updateConfig({ maxWidth: Math.max(maxWidth, config.minWidth + 10) })}
              min={50}
              max={300}
            />
          </div>
        </div>
      </ControlGroup>

      <ControlGroup label="Height Range">
        <div className="flex gap-lg">
          <div className="flex-1">
            <label className="text-body-small mb-sm block text-foreground-tertiary">Min</label>
            <RangeInput
              value={config.minHeight}
              onChange={(minHeight) => updateConfig({ minHeight: Math.min(minHeight, config.maxHeight - 10) })}
              min={20}
              max={150}
            />
          </div>
          <div className="flex-1">
            <label className="text-body-small mb-sm block text-foreground-tertiary">Max</label>
            <RangeInput
              value={config.maxHeight}
              onChange={(maxHeight) => updateConfig({ maxHeight: Math.max(maxHeight, config.minHeight + 10) })}
              min={40}
              max={200}
            />
          </div>
        </div>
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
      {stripes.map((stripe, index) => (
        <rect
          key={index}
          x={stripe.x}
          y={stripe.y}
          width={stripe.width}
          height={stripe.height}
          fill={stripe.color}
          transform={`rotate(${stripe.rotation} ${stripe.x + stripe.width / 2} ${stripe.y + stripe.height / 2})`}
        />
      ))}
    </svg>
  )

  return (
    <ToolLayout
      title="Color Stripes"
      description="Generate random stripe patterns from your custom color palette"
      controls={controls}
      canvas={canvas}
    />
  )
}
