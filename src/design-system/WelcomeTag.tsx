import { Symbol } from './Symbol'
import { Tag } from './Tag'

type WelcomeTagProps = {
  className?: string
}

export function WelcomeTag({ className }: WelcomeTagProps) {
  return (
    <span
      className={[
        'inline-flex items-center justify-center gap-[10px] rounded-sm bg-background-white px-xl py-md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="whitespace-nowrap text-center text-body-default text-foreground-secondary">
        Welcome to my portfolio
      </span>
      <Symbol variant="7" />
      <Tag type="ai-agents" />
    </span>
  )
}
