import { Button, Form, Input, message, Modal, Switch } from 'antd'
import { FolderOpen, RotateCcw, Save, Settings, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAppStore } from '../stores/useAppStore'
import { type Settings as AppSettings, useSettingsStore } from '../stores/useSettingsStore'
import './SettingsDialog.css'

interface SettingsDialogProps {
  visible: boolean
  onClose: () => void
}

export function SettingsDialog({ visible, onClose }: SettingsDialogProps) {
  const [form] = Form.useForm<AppSettings>()
  const { settings, loadSettings, saveSettings, resetSettings } = useSettingsStore()
  const { setPandocPath, setOutputPath } = useAppStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible) return

    loadSettings()
    const persisted = useSettingsStore.getState().settings
    form.setFieldsValue({
      ...persisted,
      theme: 'light'
    })
  }, [form, loadSettings, visible])

  const applySettingsToApp = async (nextSettings: AppSettings): Promise<void> => {
    await setPandocPath(nextSettings.pandocPath || '')
    setOutputPath(nextSettings.defaultOutputPath || null)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const nextSettings: AppSettings = {
        ...settings,
        ...values,
        theme: 'light'
      }

      saveSettings(nextSettings)
      await applySettingsToApp(nextSettings)
      message.success('设置已保存')
      onClose()
    } catch (error) {
      console.error('Failed to save settings:', error)
      message.error('保存设置失败')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    resetSettings()
    const defaults: AppSettings = {
      ...useSettingsStore.getState().settings,
      theme: 'light'
    }
    saveSettings(defaults)
    form.setFieldsValue(defaults)
    await applySettingsToApp(defaults)
    message.info('已重置为默认设置')
  }

  const handleBrowseOutput = async () => {
    try {
      const result = await window.electronAPI.file.selectFolder()
      if (result && !result.canceled && result.filePath) {
        form.setFieldValue('defaultOutputPath', result.filePath)
        setOutputPath(result.filePath)
      }
    } catch (error) {
      console.error('Failed to select output path:', error)
      message.error('选择目录失败')
    }
  }

  const handleBrowsePandoc = async () => {
    try {
      const result = await window.electronAPI.file.selectExecutable()
      if (result && !result.canceled && result.filePath) {
        form.setFieldValue('pandocPath', result.filePath)
        await setPandocPath(result.filePath)
      }
    } catch (error) {
      console.error('Failed to select pandoc path:', error)
      message.error('选择 Pandoc 路径失败')
    }
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      className="settings-modal"
      closeIcon={<X size={18} />}
      maskClosable={!loading}
    >
      <div className="settings-content">
        <div className="settings-header">
          <div className="settings-header-icon">
            <Settings size={18} />
          </div>
          <h2 className="settings-title">设置</h2>
        </div>

        <Form form={form} layout="vertical" className="settings-form">
          <Form.Item
            name="pandocPath"
            label="Pandoc 路径"
          >
            <div className="settings-inline-row">
              <Input placeholder="请选择 pandoc.exe 路径" readOnly />
              <Button icon={<FolderOpen size={16} />} onClick={handleBrowsePandoc}>
                浏览
              </Button>
            </div>
          </Form.Item>

          <Form.Item name="defaultOutputPath" label="默认输出目录">
            <div className="settings-inline-row">
              <Input placeholder="留空时输出到输入文件同目录" readOnly />
              <Button icon={<FolderOpen size={16} />} onClick={handleBrowseOutput}>
                浏览
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            name="autoOpenOutput"
            label="转换完成后自动打开输出文件"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="showAdvancedParams"
            label="默认显示高级参数选项"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>

        <div className="settings-footer">
          <Button onClick={handleReset} icon={<RotateCcw size={14} />}>
            重置
          </Button>
          <Button onClick={onClose} className="cancel-button">
            取消
          </Button>
          <Button type="primary" onClick={handleSave} loading={loading} icon={<Save size={14} />}>
            保存
          </Button>
        </div>
      </div>
    </Modal>
  )
}