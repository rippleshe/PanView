import { Button, Collapse, Input, Select } from 'antd'
import { ChevronDown, ChevronUp, FolderOpen } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../stores/useAppStore'
import './AdvancedOptions.css'

const { Panel } = Collapse

export function AdvancedOptions() {
  const {
    showAdvancedOptions,
    toggleAdvancedOptions,
    templatePath,
    setTemplatePath,
    variables,
    setVariable
  } = useAppStore()

  const [localVariables, setLocalVariables] = useState(variables)

  const handleBrowseTemplate = async () => {
    try {
      const result = await window.electronAPI.file.selectTemplate()
      if (result && !result.canceled && result.filePath) {
        setTemplatePath(result.filePath)
      }
    } catch (error) {
      console.error('Failed to select template:', error)
    }
  }

  const handleVariableChange = (key: string, value: string) => {
    const newVariables = { ...localVariables, [key]: value }
    setLocalVariables(newVariables)
    setVariable(key, value)
  }

  const getTemplateFileName = () => {
    if (!templatePath) return '使用默认模板'
    return templatePath.split(/[/\\]/).pop() || templatePath
  }

  return (
    <div className="advanced-options-container">
      <Collapse
        activeKey={showAdvancedOptions ? 'advanced' : undefined}
        onChange={(keys) => {
          if (keys.length > 0 && !showAdvancedOptions) {
            toggleAdvancedOptions()
          } else if (keys.length === 0 && showAdvancedOptions) {
            toggleAdvancedOptions()
          }
        }}
        className="advanced-options-collapse"
      >
        <Panel
          header={
            <div className="advanced-options-header">
              <span className="header-title">高级选项</span>
              {showAdvancedOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          }
          key="advanced"
        >
          <div className="advanced-options-content">
            <div className="template-section">
              <div className="section-label">
                <FolderOpen size={16} className="template-icon" />
                <span>模板设置</span>
              </div>
              <div className="template-input-wrapper">
                <Select
                  value={templatePath ? 'custom' : 'default'}
                  onChange={(value) => {
                    if (value === 'default') {
                      setTemplatePath(null)
                    }
                  }}
                  className="template-select"
                  style={{ width: 200 }}
                >
                  <Select.Option value="default">默认模板</Select.Option>
                  <Select.Option value="custom">自定义模板</Select.Option>
                </Select>
                {templatePath && (
                  <>
                    <Input
                      value={getTemplateFileName()}
                      readOnly
                      className="template-input"
                    />
                    <Button
                      icon={<FolderOpen size={16} />}
                      onClick={handleBrowseTemplate}
                      className="browse-template-button"
                    >
                      浏览
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="variables-section">
              <div className="section-label">
                <FolderOpen size={16} />
                <span>变量设置</span>
              </div>
              <div className="variables-grid">
                <div className="variable-item">
                  <label className="variable-label">title</label>
                  <Input
                    placeholder="文档标题"
                    value={localVariables.title || ''}
                    onChange={(e) => handleVariableChange('title', e.target.value)}
                    className="variable-input"
                  />
                </div>
                <div className="variable-item">
                  <label className="variable-label">author</label>
                  <Input
                    placeholder="作者"
                    value={localVariables.author || ''}
                    onChange={(e) => handleVariableChange('author', e.target.value)}
                    className="variable-input"
                  />
                </div>
                <div className="variable-item">
                  <label className="variable-label">date</label>
                  <Input
                    placeholder="日期"
                    value={localVariables.date || ''}
                    onChange={(e) => handleVariableChange('date', e.target.value)}
                    className="variable-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  )
}
