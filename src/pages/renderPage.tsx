import { DesignSystemGallery } from '../design-system'
import type { Route } from '../lib/router'
import { ContactPage } from './ContactPage'
import { GamePage } from './GamePage'
import { HomePage } from './HomePage'
import { HowIUseAiPage } from './HowIUseAiPage'
import { ProjectDetailPage } from './ProjectDetailPage'
import { ProjectsGalleryPage } from './ProjectsGalleryPage'
import { WorkGalleryPage } from './WorkGalleryPage'

export type PageKey = {
  route: Route
  pathname: string
}

export function isWorkOrProjectsRoute(route: Route) {
  return (
    route.name === 'work' ||
    route.name === 'workDetail' ||
    route.name === 'projects' ||
    route.name === 'projectDetail'
  )
}

export function renderPage({ route, pathname }: PageKey) {
  switch (route.name) {
    case 'ds':
      return (
        <div className="min-h-full w-full">
          <DesignSystemGallery />
        </div>
      )
    case 'work':
      return <WorkGalleryPage pathname={pathname} />
    case 'workDetail':
      return <ProjectDetailPage collection="work" pathname={pathname} slug={route.slug} />
    case 'projects':
      return <ProjectsGalleryPage pathname={pathname} />
    case 'projectDetail':
      return <ProjectDetailPage collection="projects" pathname={pathname} slug={route.slug} />
    case 'howAi':
      return <HowIUseAiPage pathname={pathname} />
    case 'contact':
      return <ContactPage pathname={pathname} />
    case 'game':
      return <GamePage pathname={pathname} />
    case 'notFound':
      return <HomePage pathname={pathname} />
    default:
      return <HomePage pathname={pathname} />
  }
}
