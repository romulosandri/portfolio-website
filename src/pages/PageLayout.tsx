import { FooterSection } from '../design-system'
import type { ReactNode } from 'react'

type PageLayoutProps = {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-full w-full flex-col bg-background-primary">
      {children}
      <FooterSection />
    </div>
  )
}
