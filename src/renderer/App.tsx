import { useEffect } from 'react'
import { ActionButton } from './components/ActionButton'
import { ConversionSettings } from './components/ConversionSettings'
import { FileDropZone } from './components/FileDropZone'
import { Header } from './components/Header'
import { ParamList } from './components/ParamList'
import { QuickConvertRecommendations } from './components/QuickConvertRecommendations'
import { SettingsPanel } from './components/SettingsPanel'
import { useAppStore } from './stores/useAppStore'
import { useSettingsStore } from './stores/useSettingsStore'

function App() {
  const { loadSettings, settings } = useSettingsStore()
  const { initializePandocPath, setOutputPath, setPandocPath } = useAppStore()

  const darkMode = settings.theme === 'dark'

  // Apply dark mode class to root element
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    loadSettings()
    const currentSettings = useSettingsStore.getState().settings

    if (currentSettings.defaultOutputPath) {
      setOutputPath(currentSettings.defaultOutputPath)
    }

    if (currentSettings.pandocPath) {
      void setPandocPath(currentSettings.pandocPath)
      return
    }

    void initializePandocPath()
  }, [initializePandocPath, loadSettings, setOutputPath, setPandocPath])

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : ''}`}>
      <Header />

      <main className="pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-3">
            <FileDropZone darkMode={darkMode} />
            <ConversionSettings darkMode={darkMode} />
            <QuickConvertRecommendations darkMode={darkMode} />
            <ParamList darkMode={darkMode} />
            <SettingsPanel darkMode={darkMode} />
          </div>
        </div>
      </main>

      <ActionButton darkMode={darkMode} />
    </div>
  )
}

export default App
