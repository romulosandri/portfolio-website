import { useState } from 'react'
import { ToolLayout } from './ToolLayout'
import { ColorInput, ControlGroup, Divider, NumberInput, PresetButton, RangeInput } from './Controls'

type Preset = {
  name: string
  config: CandleConfig
}

type CandleConfig = {
  columns: number
  rows: number
  candleWidth: number
  candleHeight: number
  gap: number
  color1: string
  color2: string
  minRects: number
  maxRects: number
}

const presets: Preset[] = [
  {
    name: 'Dense Grid',
    config: {
      columns: 12,
      rows: 8,
      candleWidth: 40,
      candleHeight: 60,
      gap: 4,
      color1: '#0c0b0a',
      color2: '#5d5548',
      minRects: 2,
      maxRects: 3,
    },
  },
  {
    name: 'Wide Stripes',
    config: {
      columns: 6,
      rows: 4,
      candleWidth: 80,
      candleHeight: 100,
      gap: 8,
      color1: '#1f1814',
      color2: '#a89a8f',
      minRects: 2,
      maxRects: 2,
    },
  },
  {
    name: 'Minimal',
    config: {
      columns: 8,
      rows: 3,
      candleWidth: 60,
      candleHeight: 120,
      gap: 12,
      color1: '#2c2321',
      color2: '#d9d2ce',
      minRects: 3,
      maxRects: 3,
    },
  },
]

function generateCandles(config: CandleConfig) {
  const candles: Array<{ rects: number; heights: number[] }> = []
  const { columns, rows, minRects, maxRects } = config

  for (let i = 0; i < columns * rows; i++) {
    const numRects = Math.floor(Math.random() * (maxRects - minRects + 1)) + minRects
    const heights: number[] = []

    for (let j = 0; j < numRects; j++) {
      heights.push(Math.random() * 0.5 + 0.5)
    }

    candles.push({ rects: numRects, heights })
  }

  return candles
}

export function CandleSticks() {
  const [config, setConfig] = useState<CandleConfig>(presets[0].config)
  const [candles, setCandles] = useState(() => generateCandles(presets[0].config))

  const updateConfig = (updates: Partial<CandleConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    setCandles(generateCandles(newConfig))
  }

  const applyPreset = (preset: Preset) => {
    setConfig(preset.config)
    setCandles(generateCandles(preset.config))
  }

  const regenerate = () => {
    setCandles(generateCandles(config))
  }

  const totalWidth = config.columns * config.candleWidth + (config.columns - 1) * config.gap
  const totalHeight = config.rows * config.candleHeight + (config.rows - 1) * config.gap

  const controls = (
    <div className="flex flex-col gap-2xl">
      <ControlGroup label="Columns">
        <RangeInput value={config.columns} onChange={(columns) => updateConfig({ columns })} min={1} max={20} />
      </ControlGroup>

      <ControlGroup label="Rows">
        <RangeInput value={config.rows} onChange={(rows) => updateConfig({ rows })} min={1} max={20} />
      </ControlGroup>

      <ControlGroup label="Candle Width">
        <NumberInput
          value={config.candleWidth}
          onChange={(candleWidth) => updateConfig({ candleWidth })}
          min={20}
          max={200}
        />
      </ControlGroup>

      <ControlGroup label="Candle Height">
        <NumberInput
          value={config.candleHeight}
          onChange={(candleHeight) => updateConfig({ candleHeight })}
          min={30}
          max={300}
        />
      </ControlGroup>

      <ControlGroup label="Gap">
        <RangeInput value={config.gap} onChange={(gap) => updateConfig({ gap })} min={0} max={40} />
      </ControlGroup>

      <Divider />

      <ControlGroup label="Color 1">
        <ColorInput value={config.color1} onChange={(color1) => updateConfig({ color1 })} />
      </ControlGroup>

      <ControlGroup label="Color 2">
        <ColorInput value={config.color2} onChange={(color2) => updateConfig({ color2 })} />
      </ControlGroup>

      <Divider />

      <ControlGroup label="Rectangles per Candle">
        <div className="flex gap-lg">
          <div className="flex-1">
            <label className="text-body-small mb-sm block text-foreground-tertiary">Min</label>
            <NumberInput
              value={config.minRects}
              onChange={(minRects) => updateConfig({ minRects: Math.min(minRects, config.maxRects) })}
              min={2}
              max={3}
            />
          </div>
          <div className="flex-1">
            <label className="text-body-small mb-sm block text-foreground-tertiary">Max</label>
            <NumberInput
              value={config.maxRects}
              onChange={(maxRects) => updateConfig({ maxRects: Math.max(maxRects, config.minRects) })}
              min={2}
              max={3}
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
    <svg width={totalWidth} height={totalHeight} className="max-w-full">
      {candles.map((candle, index) => {
        const col = index % config.columns
        const row = Math.floor(index / config.columns)
        const x = col * (config.candleWidth + config.gap)
        const y = row * (config.candleHeight + config.gap)

        let currentY = y

        return (
          <g key={index}>
            {candle.heights.map((heightRatio, rectIndex) => {
              const rectHeight = heightRatio * (config.candleHeight / candle.rects)
              const color = rectIndex % 2 === 0 ? config.color1 : config.color2
              const rect = <rect key={rectIndex} x={x} y={currentY} width={config.candleWidth} height={rectHeight} fill={color} />
              currentY += rectHeight
              return rect
            })}
          </g>
        )
      })}
    </svg>
  )

  return (
    <ToolLayout
      title="Candle Sticks"
      description="Generate vertical candle patterns with customizable colors and layouts"
      controls={controls}
      canvas={canvas}
    />
  )
}
