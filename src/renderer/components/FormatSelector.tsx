import { Card, Select, Input, Space, Button } from 'antd'
import { FolderOpen } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'
import { useFileSelection } from '../hooks/useFileSelection'
import { OUTPUT_FORMATS } from '../utils/paramLibrary'
import './FormatSelector.css'

const { Option } = Select

export function FormatSelector() {
  const { 
    outputFormat, 
    outputFileName, 
    setOutputFormat, 
    setOutputFileName,
    selectedFile 
  } = useAppStore()
  const { selectOutputPath } = useFileSelection()

  const handleFormatChange = (format: string) => {
    setOutputFormat(format)
  }

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutputFileName(e.target.value)
  }

  const handleBrowseOutput = async () => {
    if (outputFileName) {
      await selectOutputPath(outputFileName)
    }
  }

  const getCurrentFormat = () => {
    return OUTPUT_FORMATS.find(f => f.value === outputFormat)
  }

  return (
    <Card className="format-selector-card" title="输出配置">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="format-row">
          <div className="format-label">
            <label>输出格式</label>
          </div>
          <Select
            value={outputFormat}
            onChange={handleFormatChange}
            style={{ flex: 1 }}
            placeholder="选择输出格式"
          >
            {OUTPUT_FORMATS.map(format => (
              <Option key={format.value} value={format.value}>
                {format.label}
              </Option>
            ))}
          </Select>
          <div className="format-description">
            {getCurrentFormat()?.description}
          </div>
        </div>

        <div className="format-row">
          <div className="format-label">
            <label>输出文件名</label>
          </div>
          <Input
            value={outputFileName}
            onChange={handleFileNameChange}
            placeholder="example.docx"
            suffix={
              <Button 
                type="text" 
                icon={<FolderOpen size={16} />}
                onClick={handleBrowseOutput}
                disabled={!selectedFile}
              >
                📁
              </Button>
            }
          />
        </div>
      </Space>
    </Card>
  )
}
