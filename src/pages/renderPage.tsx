import { DesignSystemGallery } from '../design-system'
import type { Route } from '../lib/router'
import { ContactPage } from './ContactPage'
import { GamePage } from './GamePage'
import { HomePage } from './HomePage'
import { HowIUseAiPage } from './HowIUseAiPage'
import { NotFoundPage } from './NotFoundPage'
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

export function renderPage({ route }: PageKey) {
  switch (route.name) {
    case 'ds':
      return (
        <div className="min-h-full w-full">
          <DesignSystemGallery />
        </div>
      )
    case 'work':
      return <WorkGalleryPage />
    case 'workDetail':
      return <ProjectDetailPage collection="work" slug={route.slug} />
    case 'projects':
      return <ProjectsGalleryPage />
    case 'projectDetail':
      return <ProjectDetailPage collection="projects" slug={route.slug} />
    case 'howAi':
      return <HowIUseAiPage />
    case 'contact':
      return <ContactPage />
    case 'game':
      return <GamePage />
    case 'home':
      return <HomePage />
    case 'notFound':
      return <NotFoundPage />
    default:
      return <NotFoundPage />
  }
}
