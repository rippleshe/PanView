import { AlertCircle, File, Plus, Upload, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useAppStore } from '../stores/useAppStore'

interface FileDropZoneProps {
  darkMode: boolean
}

export function FileDropZone({ darkMode }: FileDropZoneProps) {
  const { selectedFiles, setSelectedFiles, addSelectedFile, removeSelectedFile } = useAppStore()
  const [isDragging, setIsDragging] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const showError = (msg: string) => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(null), 3500)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return
    const filePaths = files.map(f => f.path || f.name).filter(Boolean)
    setSelectedFiles(filePaths)
  }, [setSelectedFiles])

  const handleFileSelect = useCallback(async () => {
    try {
      const result = await window.electronAPI.file.select()
      if (result && !result.canceled && result.filePath) {
        setSelectedFiles([result.filePath])
      }
    } catch (error) {
      console.error('Failed to select file:', error)
    }
  }, [setSelectedFiles])

  const handleAddFile = useCallback(async () => {
    try {
      const result = await window.electronAPI.file.select()
      if (result && !result.canceled && result.filePath) {
        try {
          addSelectedFile(result.filePath)
        } catch (error: unknown) {
          showError((error as Error)?.message || '文件类型不一致，请选择相同类型的文件')
        }
      }
    } catch (error) {
      console.error('Failed to select file:', error)
    }
  }, [addSelectedFile])

  const handleRemoveFile = useCallback((index: number) => {
    removeSelectedFile(index)
  }, [removeSelectedFile])

  const getFileName = (filePath: string) => filePath.split(/[/\\]/).pop() || ''
  const getFileExt = (filePath: string) => filePath.split('.').pop()?.toUpperCase() || ''

  return (
    <div className="px-4 py-3 animate-slide-up">
      {/* Inline error banner */}
      {errorMsg && (
        <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-error animate-scale-in">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span className="text-caption">{errorMsg}</span>
        </div>
      )}

      {selectedFiles.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileSelect}
          className={`
            p-8 cursor-pointer border-2 border-dashed rounded-lg
            transition-all duration-200
            ${isDragging
              ? 'border-primary-500 bg-primary-50 scale-[1.02]'
              : darkMode
                ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800'
                : 'border-border bg-white hover:border-primary-400 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`
              relative w-16 h-16 rounded-2xl flex items-center justify-center
              transition-all duration-300
              ${isDragging ? 'bg-primary-100 scale-110' : darkMode ? 'bg-gray-700' : 'bg-primary-50'}
            `}>
              <div className={`absolute inset-0 rounded-2xl blur-xl animate-pulse-subtle ${darkMode ? 'bg-blue-400 opacity-30' : 'bg-primary-500 opacity-20'}`} />
              <Upload size={32} className={`relative transition-all duration-300 ${isDragging ? 'text-primary-600 scale-110' : darkMode ? 'text-blue-400' : 'text-primary-500'}`} />
            </div>
            <div className="text-center">
              <h3 className={`text-lg font-semibold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-text-primary'}`}>
                {isDragging ? '释放文件' : '拖拽或点击选择文件'}
              </h3>
              <p className={`text-body mt-2 ${darkMode ? 'text-gray-400' : ''}`}>
                支持多文件上传，但需为相同类型
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`p-4 animate-scale-in rounded-lg shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-border'}`}>
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-primary-50'}`}>
                <div className={`absolute inset-0 rounded-lg blur-md animate-pulse-subtle ${darkMode ? 'bg-blue-400 opacity-30' : 'bg-primary-500 opacity-20'}`} />
                <File size={16} className={`relative ${darkMode ? 'text-blue-400' : 'text-primary-600'}`} />
              </div>
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-text-primary'}`}>
                已选择 {selectedFiles.length} 个文件
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleAddFile} className={`btn-ghost px-3 py-1.5 text-sm rounded-lg font-medium flex items-center gap-1 ${darkMode ? 'text-gray-300 hover:text-white' : ''}`}>
                <Plus size={14} />
                添加
              </button>
              <button onClick={handleFileSelect} className={`btn-ghost px-3 py-1.5 text-sm rounded-lg font-medium ${darkMode ? 'text-gray-300 hover:text-white' : ''}`}>
                更换
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={`${file}-${index}`} className={`flex items-center justify-between gap-3 p-2 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-600' : 'bg-primary-100'}`}>
                    <File size={14} className={`relative ${darkMode ? 'text-blue-400' : 'text-primary-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-text-primary'}`}>{getFileName(file)}</h4>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>{getFileExt(file)}</span>
                  </div>
                </div>
                <button onClick={() => handleRemoveFile(index)} className="icon-button hover:text-error transition-colors duration-200" aria-label="移除文件">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
