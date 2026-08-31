import { HumanImage } from './HumanImage'
import { RobotImage } from './RobotImage'

export type TagType = 'ai-agents' | 'humans'

type TagProps = {
  type?: TagType
  className?: string
}

const labels: Record<TagType, string> = {
  'ai-agents': 'AI Agents',
  humans: 'Humans',
}

export function Tag({ type = 'ai-agents', className }: TagProps) {
  return (
    <span
      className={[
        'inline-flex items-center justify-center gap-none rounded-xsm bg-background-white px-sm py-2xs',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {type === 'ai-agents' ? <RobotImage /> : <HumanImage />}
      <span className="whitespace-nowrap text-center text-body-small text-foreground-tertiary">
        {labels[type]}
      </span>
    </span>
  )
}
