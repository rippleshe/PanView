import { useState, useCallback } from 'react'
import { useAppStore } from '../stores/useAppStore'

export function useFileSelection() {
  const { setSelectedFile, setOutputPath, selectedFile } = useAppStore()
  const [isSelecting, setIsSelecting] = useState(false)

  const selectFile = useCallback(async () => {
    setIsSelecting(true)
    try {
      const result = await window.electronAPI.file.select()
      if (!result.canceled && result.filePath) {
        setSelectedFile(result.filePath)
      }
    } finally {
      setIsSelecting(false)
    }
  }, [setSelectedFile])

  const selectOutputPath = useCallback(async (defaultName: string) => {
    setIsSelecting(true)
    try {
      const result = await window.electronAPI.file.selectOutput(defaultName)
      if (!result.canceled && result.filePath) {
        setOutputPath(result.filePath)
        return result.filePath
      }
    } finally {
      setIsSelecting(false)
    }
    return null
  }, [setOutputPath])

  const clearFile = useCallback(() => {
    setSelectedFile(null)
  }, [setSelectedFile])

  return {
    selectedFile,
    isSelecting,
    selectFile,
    selectOutputPath,
    clearFile
  }
}
