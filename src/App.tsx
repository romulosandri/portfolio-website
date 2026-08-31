import { BackToTop, DesignSystemGallery } from './design-system'
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

  let page
  switch (route.name) {
    case 'ds':
      page = (
        <div className="min-h-full w-full">
          <DesignSystemGallery />
        </div>
      )
      break
    case 'work':
      page = <WorkGalleryPage pathname={pathname} />
      break
    case 'workDetail':
      page = <ProjectDetailPage collection="work" pathname={pathname} slug={route.slug} />
      break
    case 'projects':
      page = <ProjectsGalleryPage pathname={pathname} />
      break
    case 'projectDetail':
      page = <ProjectDetailPage collection="projects" pathname={pathname} slug={route.slug} />
      break
    case 'howAi':
      page = <HowIUseAiPage pathname={pathname} />
      break
    case 'contact':
      page = <ContactPage pathname={pathname} />
      break
    case 'game':
      page = <GamePage pathname={pathname} />
      break
    case 'notFound':
      page = <HomePage pathname={pathname} />
      break
    default:
      page = <HomePage pathname={pathname} />
  }

  return (
    <>
      {page}
      {route.name !== 'game' && <BackToTop />}
    </>
  )
}

export default App
