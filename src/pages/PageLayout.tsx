import { FooterSection, NavBar } from '../design-system'
import type { ReactNode } from 'react'

type PageLayoutProps = {
  pathname: string
  children: ReactNode
  navClassName?: string
}

export function PageLayout({ pathname, children, navClassName }: PageLayoutProps) {
  return (
    <div className="flex min-h-full w-full flex-col bg-background-primary">
      <NavBar className={navClassName} pathname={pathname} />
      {children}
      <FooterSection />
    </div>
  )
}
