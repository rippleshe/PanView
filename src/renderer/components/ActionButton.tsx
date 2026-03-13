import { AlertCircle, CheckCircle, ExternalLink, FolderOpen, Loader2, Play } from 'lucide-react'
import { useEffect } from 'react'
import { useAppStore } from '../stores/useAppStore'
import { useSettingsStore } from '../stores/useSettingsStore'

interface ActionButtonProps {
  darkMode: boolean
}

export function ActionButton({ darkMode }: ActionButtonProps) {
  const { selectedFiles, inputFormat, outputFormat, isConverting, conversionResult, pandocInfo } = useAppStore()
  const { settings } = useSettingsStore()

  const canConvert = Boolean(selectedFiles.length > 0 && inputFormat && outputFormat && pandocInfo?.available)

  const handleConvert = async () => {
    if (!canConvert) return
    try {
      await useAppStore.getState().executeConversion()
    } catch (err) {
      console.error('Conversion failed:', err)
    }
  }

  // Auto-open the first output file if setting is enabled
  useEffect(() => {
    if (!conversionResult?.success || !conversionResult.outputFiles?.length) return
    if (!settings.autoOpenOutput) return
    const firstOutput = conversionResult.outputFiles[0]
    window.electronAPI.shell.openPath(firstOutput).catch(console.error)
  }, [conversionResult, settings.autoOpenOutput])

  const outputFiles = conversionResult?.outputFiles ?? []

  const handleOpenFile = () => {
    if (!outputFiles.length) return
    window.electronAPI.shell.openPath(outputFiles[0]).catch(console.error)
  }

  const handleShowInFolder = () => {
    if (!outputFiles.length) return
    window.electronAPI.shell.showInFolder(outputFiles[0]).catch(console.error)
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 border-t shadow-lg animate-slide-up ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-border'}`}>
      <div className="px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Status area */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {conversionResult?.success && (
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle size={16} className="text-success flex-shrink-0" />
              <span className="text-caption font-medium text-success truncate">{conversionResult.output}</span>
              {outputFiles.length > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={handleOpenFile}
                    className="btn-ghost px-2 py-1 text-xs rounded-md flex items-center gap-1 text-primary-600"
                    title="打开文件"
                  >
                    <ExternalLink size={12} />
                    <span>打开</span>
                  </button>
                  <button
                    onClick={handleShowInFolder}
                    className="btn-ghost px-2 py-1 text-xs rounded-md flex items-center gap-1 text-text-secondary"
                    title="在资源管理器中显示"
                  >
                    <FolderOpen size={12} />
                    <span>定位</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {conversionResult?.error && !conversionResult.success && (
            <div className="flex items-center gap-2 text-error animate-scale-in min-w-0">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span className="text-caption font-medium truncate">{conversionResult.error}</span>
            </div>
          )}

          {!conversionResult && !isConverting && selectedFiles.length > 0 && pandocInfo?.available && (
            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse-subtle" />
              <span className="text-caption">准备就绪</span>
            </div>
          )}

          {!conversionResult && !isConverting && selectedFiles.length === 0 && (
            <span className={`text-caption ${darkMode ? 'text-gray-500' : 'text-text-tertiary'}`}>请选择文件</span>
          )}

          {!conversionResult && !isConverting && selectedFiles.length > 0 && !pandocInfo?.available && (
            <span className={`text-caption ${darkMode ? 'text-red-300' : 'text-error'}`}>
              请先设置可用的 Pandoc 路径
            </span>
          )}

          {isConverting && (
            <div className={`flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-primary'}`}>
              <Loader2 size={16} className="animate-spin" />
              <span className="text-caption font-medium">转换中...</span>
            </div>
          )}
        </div>

        {/* Convert button */}
        <button
          onClick={handleConvert}
          disabled={!canConvert || isConverting}
          className={`
            px-6 py-2.5 rounded-lg font-medium text-sm flex-shrink-0
            flex items-center gap-2 transition-all duration-200
            ${canConvert && !isConverting
              ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md hover:scale-105'
              : darkMode
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
            disabled:active:scale-95
          `}
        >
          {isConverting
            ? <><Loader2 size={16} className="animate-spin" /><span>转换中</span></>
            : <><Play size={16} /><span>开始转换</span></>
          }
        </button>
      </div>
    </div>
  )
}
