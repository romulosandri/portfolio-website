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
  rows: number
  itemsPerRow: number
  itemWidth: number
  itemHeight: number
  rowOffset: number
}

const presets: Preset[] = [
  {
    name: 'Default',
    config: {
      color1: '#0c0b0a',
      color2: '#5d5548',
      color3: '#a89a8f',
      color4: '#d9d2ce',
      rows: 8,
      itemsPerRow: 10,
      itemWidth: 80,
      itemHeight: 60,
      rowOffset: 40,
    },
  },
  {
    name: 'Warm Tones',
    config: {
      color1: '#8b4513',
      color2: '#d2691e',
      color3: '#f4a460',
      color4: '#ffdead',
      rows: 6,
      itemsPerRow: 8,
      itemWidth: 100,
      itemHeight: 80,
      rowOffset: 50,
    },
  },
  {
    name: 'Dense Stripes',
    config: {
      color1: '#1e3a5f',
      color2: '#2e5090',
      color3: '#6a8fc7',
      color4: '#b3c9e8',
      rows: 12,
      itemsPerRow: 15,
      itemWidth: 60,
      itemHeight: 40,
      rowOffset: 30,
    },
  },
]

type GridItem = {
  color: string
}

function generateGrid(config: StripeConfig): GridItem[][] {
  const colors = [config.color1, config.color2, config.color3, config.color4]
  const grid: GridItem[][] = []

  for (let row = 0; row < config.rows; row++) {
    const rowItems: GridItem[] = []
    for (let col = 0; col < config.itemsPerRow; col++) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      rowItems.push({ color })
    }
    grid.push(rowItems)
  }

  return grid
}

export function ColorStripes() {
  const [config, setConfig] = useState<StripeConfig>(presets[0].config)
  const [grid, setGrid] = useState(() => generateGrid(presets[0].config))

  const updateConfig = (updates: Partial<StripeConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    setGrid(generateGrid(newConfig))
  }

  const applyPreset = (preset: Preset) => {
    setConfig(preset.config)
    setGrid(generateGrid(preset.config))
  }

  const regenerate = () => {
    setGrid(generateGrid(config))
  }

  const baseWidth = config.itemsPerRow * config.itemWidth
  const totalWidth = baseWidth + config.rowOffset
  const totalHeight = config.rows * config.itemHeight

  const controls = (
    <div className="flex flex-col gap-xl xs:gap-2xl">
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

      <ControlGroup label="Number of Rows">
        <RangeInput value={config.rows} onChange={(rows) => updateConfig({ rows })} min={2} max={20} />
      </ControlGroup>

      <ControlGroup label="Items Per Row">
        <RangeInput
          value={config.itemsPerRow}
          onChange={(itemsPerRow) => updateConfig({ itemsPerRow })}
          min={3}
          max={20}
        />
      </ControlGroup>

      <ControlGroup label="Item Width">
        <RangeInput value={config.itemWidth} onChange={(itemWidth) => updateConfig({ itemWidth })} min={40} max={150} />
      </ControlGroup>

      <ControlGroup label="Item Height">
        <RangeInput
          value={config.itemHeight}
          onChange={(itemHeight) => updateConfig({ itemHeight })}
          min={30}
          max={120}
        />
      </ControlGroup>

      <ControlGroup label="Row Offset (Stagger)">
        <RangeInput value={config.rowOffset} onChange={(rowOffset) => updateConfig({ rowOffset })} min={0} max={200} />
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
      {grid.map((row, rowIndex) =>
        row.map((item, colIndex) => {
          const offsetX = (rowIndex * config.rowOffset) % (config.itemWidth + config.rowOffset)
          const x = colIndex * config.itemWidth + offsetX
          const y = rowIndex * config.itemHeight

          return (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={x}
              y={y}
              width={config.itemWidth}
              height={config.itemHeight}
              fill={item.color}
            />
          )
        }),
      )}
    </svg>
  )

  return (
    <ToolLayout
      title="Color Stripes"
      description="Grid rows with configurable offset and random colors from your palette"
      controls={controls}
      canvas={canvas}
    />
  )
}
