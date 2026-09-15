import { useState } from 'react'
import { ToolLayout } from './ToolLayout'
import { ColorInput, ControlGroup, Divider, NumberInput, PresetButton, RangeInput } from './Controls'

type Preset = {
  name: string
  config: CandleConfig
}

type CandleConfig = {
  columns: number
  candleWidth: number
  largeRectHeight: number
  thinRectHeight: number
  gap: number
  color1: string
  color2: string
}

const presets: Preset[] = [
  {
    name: 'Default',
    config: {
      columns: 10,
      candleWidth: 60,
      largeRectHeight: 80,
      thinRectHeight: 20,
      gap: 4,
      color1: '#0c0b0a',
      color2: '#5d5548',
    },
  },
  {
    name: 'Wide Columns',
    config: {
      columns: 6,
      candleWidth: 100,
      largeRectHeight: 100,
      thinRectHeight: 25,
      gap: 8,
      color1: '#1f1814',
      color2: '#a89a8f',
    },
  },
  {
    name: 'Dense',
    config: {
      columns: 15,
      candleWidth: 40,
      largeRectHeight: 60,
      thinRectHeight: 15,
      gap: 2,
      color1: '#2c2321',
      color2: '#d9d2ce',
    },
  },
]

export function CandleSticks() {
  const [config, setConfig] = useState<CandleConfig>(presets[0].config)

  const updateConfig = (updates: Partial<CandleConfig>) => {
    setConfig({ ...config, ...updates })
  }

  const applyPreset = (preset: Preset) => {
    setConfig(preset.config)
  }

  const totalWidth = config.columns * config.candleWidth + (config.columns - 1) * config.gap
  const totalHeight = config.largeRectHeight * 2 + config.thinRectHeight

  const controls = (
    <div className="flex flex-col gap-xl xs:gap-2xl">
      <ControlGroup label="Number of Columns">
        <RangeInput value={config.columns} onChange={(columns) => updateConfig({ columns })} min={1} max={20} />
      </ControlGroup>

      <ControlGroup label="Column Width">
        <NumberInput
          value={config.candleWidth}
          onChange={(candleWidth) => updateConfig({ candleWidth })}
          min={20}
          max={200}
        />
      </ControlGroup>

      <ControlGroup label="Large Rectangle Height">
        <NumberInput
          value={config.largeRectHeight}
          onChange={(largeRectHeight) => updateConfig({ largeRectHeight })}
          min={30}
          max={200}
        />
      </ControlGroup>

      <ControlGroup label="Thin Rectangle Height">
        <NumberInput
          value={config.thinRectHeight}
          onChange={(thinRectHeight) => updateConfig({ thinRectHeight })}
          min={10}
          max={50}
        />
      </ControlGroup>

      <ControlGroup label="Gap Between Columns">
        <RangeInput value={config.gap} onChange={(gap) => updateConfig({ gap })} min={0} max={40} />
      </ControlGroup>

      <Divider />

      <ControlGroup label="Color 1 (Top & Middle)">
        <ColorInput value={config.color1} onChange={(color1) => updateConfig({ color1 })} />
      </ControlGroup>

      <ControlGroup label="Color 2 (Bottom)">
        <ColorInput value={config.color2} onChange={(color2) => updateConfig({ color2 })} />
      </ControlGroup>

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
      {Array.from({ length: config.columns }).map((_, index) => {
        const x = index * (config.candleWidth + config.gap)

        return (
          <g key={index}>
            {/* Top large rectangle - Color 1 */}
            <rect x={x} y={0} width={config.candleWidth} height={config.largeRectHeight} fill={config.color1} />

            {/* Middle thin rectangle - Color 1 */}
            <rect
              x={x}
              y={config.largeRectHeight}
              width={config.candleWidth}
              height={config.thinRectHeight}
              fill={config.color1}
            />

            {/* Bottom large rectangle - Color 2 */}
            <rect
              x={x}
              y={config.largeRectHeight + config.thinRectHeight}
              width={config.candleWidth}
              height={config.largeRectHeight}
              fill={config.color2}
            />
          </g>
        )
      })}
    </svg>
  )

  return (
    <ToolLayout
      title="Candle Sticks"
      description="Vertical columns with three stacked rectangles: large, thin, large"
      controls={controls}
      canvas={canvas}
    />
  )
}
