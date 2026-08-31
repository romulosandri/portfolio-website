import { DesignSystemGallery } from './design-system'
import { useRoute } from './lib/router'
import { ContactPage } from './pages/ContactPage'
import { GamePage } from './pages/GamePage'
import { HomePage } from './pages/HomePage'
import { HowIUseAiPage } from './pages/HowIUseAiPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsGalleryPage } from './pages/ProjectsGalleryPage'
import { WorkGalleryPage } from './pages/WorkGalleryPage'

function App() {
  const { route, pathname } = useRoute()

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
      return <ProjectDetailPage pathname={pathname} slug={route.slug} />
    case 'projects':
      return <ProjectsGalleryPage pathname={pathname} />
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

export default App
