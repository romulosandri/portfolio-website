import type { ChangeEvent } from 'react'
import { Button } from '../design-system'

type ControlGroupProps = {
  label: string
  children: React.ReactNode
}

export function ControlGroup({ label, children }: ControlGroupProps) {
  return (
    <div className="flex flex-col gap-md">
      <label className="text-body-small text-foreground-secondary">{label}</label>
      {children}
    </div>
  )
}

type NumberInputProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export function NumberInput({ value, onChange, min, max, step = 1 }: NumberInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  return (
    <input
      type="number"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      className="w-full border border-solid border-stroke-secondary bg-background-primary px-lg py-md text-body-small text-foreground-primary focus:border-stroke-hover focus:outline-none"
    />
  )
}

type RangeInputProps = {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
}

export function RangeInput({ value, onChange, min, max, step = 1 }: RangeInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  return (
    <div className="flex items-center gap-lg">
      <input
        type="range"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="flex-1"
      />
      <span className="text-body-small w-12 text-right text-foreground-primary">{value}</span>
    </div>
  )
}

type ColorInputProps = {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function ColorInput({ value, onChange, label }: ColorInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="flex items-center gap-lg">
      <input
        type="color"
        value={value}
        onChange={handleChange}
        className="h-10 w-10 cursor-pointer border border-solid border-stroke-secondary"
      />
      <div className="flex flex-1 flex-col">
        {label && <span className="text-body-small mb-sm text-foreground-tertiary">{label}</span>}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className="w-full border border-solid border-stroke-secondary bg-background-primary px-lg py-md font-mono text-body-small uppercase text-foreground-primary focus:border-stroke-hover focus:outline-none"
        />
      </div>
    </div>
  )
}

type PresetButtonProps = {
  label: string
  onClick: () => void
}

export function PresetButton({ label, onClick }: PresetButtonProps) {
  return (
    <Button onClick={onClick} variant="default" className="w-full">
      {label}
    </Button>
  )
}

export function Divider() {
  return <div className="border-t border-solid border-stroke-secondary" />
}
