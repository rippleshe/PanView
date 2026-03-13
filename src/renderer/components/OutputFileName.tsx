import { Button, Input } from 'antd'
import { FileOutput, FolderOpen } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'
import './OutputFileName.css'

export function OutputFileName() {
  const { outputFileName, outputPath, setOutputFileName, setOutputPath, selectedFile } = useAppStore()

  const handleBrowseFolder = async () => {
    try {
      const result = await window.electronAPI.file.selectFolder()
      if (result && !result.canceled && result.filePath) {
        setOutputPath(result.filePath)
      }
    } catch (error) {
      console.error('Failed to select folder:', error)
    }
  }

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutputFileName(e.target.value)
  }

  const getPlaceholder = () => {
    if (!selectedFile) return '请先选择输入文件'
    const fileName = selectedFile.split(/[/\\]/).pop() || ''
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
    return `${nameWithoutExt}.docx`
  }

  return (
    <div className="output-filename-container">
      <div className="output-filename-label">
        <FileOutput size={18} />
        <span>输出文件</span>
      </div>
      <div className="output-filename-inputs">
        <Input
          placeholder={getPlaceholder()}
          value={outputFileName}
          onChange={handleFileNameChange}
          className="filename-input"
          size="large"
          disabled={!selectedFile}
        />
        <Button
          icon={<FolderOpen size={18} />}
          onClick={handleBrowseFolder}
          className="folder-button"
          size="large"
        >
          选择文件夹
        </Button>
      </div>
      {outputPath && (
        <div className="output-path-display">
          <span className="path-label">输出路径:</span>
          <span className="path-value">{outputPath}</span>
        </div>
      )}
    </div>
  )
}
