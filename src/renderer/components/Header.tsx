import { FileText, Info, Moon, Save, Sun } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../stores/useAppStore'
import { useSettingsStore } from '../stores/useSettingsStore'
import { PresetManager } from './PresetManager'

export function Header() {
  const { pandocInfo } = useAppStore()
  const { settings, updateSetting } = useSettingsStore()
  const [showPresetModal, setShowPresetModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)

  const isDark = settings.theme === 'dark'

  const toggleTheme = () => {
    updateSetting('theme', isDark ? 'light' : 'dark')
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700 transition-colors duration-300">
        <div className="px-4 py-3 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg blur-md animate-pulse-subtle bg-primary-500 opacity-20" />
              <FileText size={20} className="relative text-primary-600" />
            </div>
            <div className="ml-2">
              <h1 className="text-xl font-bold tracking-tight text-text-primary">PanView</h1>
              <span className={`text-xs ml-1 ${pandocInfo?.available ? 'text-text-tertiary' : 'text-error'}`}>
                {pandocInfo?.available ? `Pandoc ${pandocInfo.version}` : 'Pandoc 未连接'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPresetModal(true)}
              className="icon-button text-sm font-medium flex items-center gap-1.5 text-text-secondary"
              title="预设管理"
            >
              <Save size={16} />
              <span>预设</span>
            </button>

            <button
              onClick={toggleTheme}
              className="icon-button text-sm font-medium flex items-center gap-1.5 text-text-secondary"
              title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={() => setShowAboutModal(true)}
              className="icon-button text-sm font-medium flex items-center gap-1.5 text-text-secondary"
              title="关于"
            >
              <Info size={16} />
              <span>关于</span>
            </button>
          </div>
        </div>
      </header>

      {/* Real PresetManager - replaces the old stub */}
      <PresetManager visible={showPresetModal} onClose={() => setShowPresetModal(false)} />

      {showAboutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in backdrop-blur-sm">
          <div className="max-w-md w-full mx-4 p-6 text-center animate-scale-in rounded-lg shadow-lg bg-gray-50">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 rounded-2xl blur-xl animate-pulse-subtle bg-primary-500 opacity-20" />
              <FileText size={56} className="relative text-primary-600" />
            </div>
            <h2 className="text-display mb-2">PanView</h2>
            <p className="text-body mb-6">现代化的 Pandoc 图形界面工具</p>
            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center gap-3 text-body">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" />
                <span>直观的拖拽式文件操作</span>
              </div>
              <div className="flex items-center gap-3 text-body">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" />
                <span>丰富的参数配置选项</span>
              </div>
              <div className="flex items-center gap-3 text-body">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" />
                <span>预设保存与快速加载</span>
              </div>
            </div>
            <button
              onClick={() => setShowAboutModal(false)}
              className="btn w-full px-4 py-2.5 text-sm rounded-lg"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  )
}
