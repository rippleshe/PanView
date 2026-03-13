import { Button, Input, Switch } from 'antd'
import { FolderOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAppStore } from '../stores/useAppStore'
import { useSettingsStore } from '../stores/useSettingsStore'
import './SettingsPanel.css'

interface SettingsPanelProps {
  darkMode: boolean
}

export function SettingsPanel({ darkMode }: SettingsPanelProps) {
  const { pandocPath, outputPath, setPandocPath, setOutputPath, checkPandoc, pandocInfo } = useAppStore()
  const { settings, updateSetting, loadSettings } = useSettingsStore()
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const handleBrowsePandoc = async () => {
    try {
      const result = await window.electronAPI.file.selectExecutable()
      if (result && !result.canceled && result.filePath) {
        const path = result.filePath
        await setPandocPath(path)
        updateSetting('pandocPath', path)
        setIsChecking(true)
        await checkPandoc()
        setIsChecking(false)
      }
    } catch (error) {
      console.error('Failed to select pandoc path:', error)
    }
  }

  const handleBrowseOutput = async () => {
    try {
      const result = await window.electronAPI.file.selectFolder()
      if (result && !result.canceled && result.filePath) {
        const path = result.filePath
        setOutputPath(path)
        updateSetting('defaultOutputPath', path)
      }
    } catch (error) {
      console.error('Failed to select output path:', error)
    }
  }

  const handleToggleAutoOpen = (checked: boolean) => {
    updateSetting('autoOpenOutput', checked)
  }

  const handleToggleShowAdvanced = (checked: boolean) => {
    updateSetting('showAdvancedParams', checked)
  }

  const pandocStatus = pandocInfo?.available
    ? pandocInfo.source === 'custom'
      ? '自定义路径'
      : '系统路径'
    : pandocPath
    ? '不可用'
    : '未设置'

  const pandocStatusColor = pandocInfo?.available
    ? 'text-green-600'
    : pandocPath
    ? 'text-red-500'
    : 'text-gray-400'

  return (
    <div className={`settings-panel ${darkMode ? 'dark' : ''}`}>
      <div className="settings-panel-header">
        <h3 className="settings-panel-title">配置设置</h3>
      </div>

      <div className="settings-panel-content">
        <div className="settings-section">
          <div className="settings-row">
            <label className="settings-label">
              <span className="label-text">Pandoc 路径</span>
              <span className={`status-indicator ${pandocStatusColor}`}>
                {pandocStatus}
                {isChecking && <span className="loading-spinner ml-2">检测中...</span>}
              </span>
            </label>
            <div className="settings-input-group">
              <Input
                value={pandocPath}
                placeholder="请选择 pandoc.exe 路径"
                readOnly
                className="settings-input"
              />
              <Button
                icon={<FolderOpen size={16} />}
                onClick={handleBrowsePandoc}
                className="settings-browse-btn"
              >
                浏览
              </Button>
            </div>
          </div>

          <div className="settings-row">
            <label className="settings-label">
              <span className="label-text">默认输出目录</span>
              <span className="label-hint">留空时输出到输入文件同目录</span>
            </label>
            <div className="settings-input-group">
              <Input
                value={outputPath || ''}
                placeholder="选择输出目录"
                readOnly
                className="settings-input"
              />
              <Button
                icon={<FolderOpen size={16} />}
                onClick={handleBrowseOutput}
                className="settings-browse-btn"
              >
                浏览
              </Button>
            </div>
          </div>

          <div className="settings-row settings-row-inline">
            <div className="settings-toggle-item">
              <label className="settings-toggle-label">
                <span className="label-text">转换完成后自动打开输出文件</span>
                <Switch
                  checked={settings.autoOpenOutput}
                  onChange={handleToggleAutoOpen}
                  size="small"
                />
              </label>
            </div>

            <div className="settings-toggle-item">
              <label className="settings-toggle-label">
                <span className="label-text">默认显示高级参数选项</span>
                <Switch
                  checked={settings.showAdvancedParams}
                  onChange={handleToggleShowAdvanced}
                  size="small"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}