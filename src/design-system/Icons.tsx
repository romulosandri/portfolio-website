export function PlusIcon() {
  return (
    <svg aria-hidden fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeLinecap="square" strokeWidth="1.2" />
    </svg>
  )
}

export function ApplyIcon() {
  return (
    <svg aria-hidden fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M4 12 12 4M6.5 4H12v5.5" stroke="currentColor" strokeLinecap="square" strokeWidth="1.2" />
    </svg>
  )
}

export function DeleteIcon() {
  return (
    <svg aria-hidden fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M3.5 4.5h9M6 4.5V3.5h4v1M5 6.5l.5 6h5l.5-6" stroke="currentColor" strokeLinecap="square" strokeWidth="1.2" />
    </svg>
  )
}

export function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg aria-hidden fill={filled ? 'currentColor' : 'none'} height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M8 2.4 9.7 6.1l4 .3-3.1 2.7.9 3.9L8 10.8 4.5 13l.9-3.9-3.1-2.7 4-.3L8 2.4Z"
        stroke="currentColor"
        strokeLinejoin="miter"
        strokeWidth="1.2"
      />
    </svg>
  )
}

export function ChevronDownIcon() {
  return (
    <svg aria-hidden fill="none" height="12" viewBox="0 0 12 12" width="12">
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeLinecap="square" strokeWidth="1.2" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg aria-hidden fill="none" height="10" viewBox="0 0 10 10" width="10">
      <path d="M1.5 5.2 3.8 7.5 8.5 2.5" stroke="currentColor" strokeLinecap="square" strokeWidth="1.4" />
    </svg>
  )
}

export function DragHandleIcon() {
  return (
    <svg aria-hidden fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
      <circle cx="6" cy="4" r="1" />
      <circle cx="10" cy="4" r="1" />
      <circle cx="6" cy="8" r="1" />
      <circle cx="10" cy="8" r="1" />
      <circle cx="6" cy="12" r="1" />
      <circle cx="10" cy="12" r="1" />
    </svg>
  )
}
