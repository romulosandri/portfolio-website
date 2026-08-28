import { GameCanvas } from './components/GameCanvas'
import { DesignSystemGallery } from './design-system'

function App() {
  const showDesignSystem = new URLSearchParams(window.location.search).has('ds')

  return (
    <div className="h-full w-full">
      {showDesignSystem ? <DesignSystemGallery /> : <GameCanvas />}
    </div>
  )
}

export default App
