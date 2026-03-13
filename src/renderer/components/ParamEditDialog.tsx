import { Button, Input, InputNumber, Modal, Select, Slider, Space } from 'antd'
import { FolderOpen, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAppStore } from '../stores/useAppStore'
import type { SelectedParam } from '../types/app'
import './ParamEditDialog.css'

interface ParamEditDialogProps {
  visible: boolean
  onClose: () => void
  param: SelectedParam | null
}

export function ParamEditDialog({ visible, onClose, param }: ParamEditDialogProps) {
  const { updateParam } = useAppStore()
  const [localValue, setLocalValue] = useState<any>(null)

  useEffect(() => {
    if (param) {
      setLocalValue(param.value)
    }
  }, [param])

  const handleSave = () => {
    if (param) {
      updateParam(param.id, localValue)
      onClose()
    }
  }

  const handleBrowseFile = async () => {
    try {
      const result = await window.electronAPI.file.select()
      if (result && !result.canceled && result.filePath) {
        setLocalValue(result.filePath)
      }
    } catch (error) {
      console.error('Failed to select file:', error)
    }
  }

  const renderEditor = () => {
    if (!param) return null

    switch (param.param.type) {
      case 'boolean':
        return (
          <div className="boolean-editor">
            <Button
              type={localValue ? 'primary' : 'default'}
              size="large"
              onClick={() => setLocalValue(!localValue)}
              className="boolean-toggle"
            >
              {localValue ? '✓ 已启用' : '✗ 未启用'}
            </Button>
          </div>
        )

      case 'number':
        const min = param.param.min ?? 0
        const max = param.param.max ?? 100
        const step = param.param.step ?? 1
        return (
          <div className="number-editor">
            <div className="slider-wrapper">
              <Slider
                min={min}
                max={max}
                step={step}
                value={localValue}
                onChange={setLocalValue}
                className="param-slider"
              />
            </div>
            <div className="number-input-wrapper">
              <InputNumber
                min={min}
                max={max}
                step={step}
                value={localValue}
                onChange={setLocalValue}
                className="number-input"
                size="large"
              />
              <div className="quick-buttons">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <Button
                    key={num}
                    size="small"
                    onClick={() => setLocalValue(num)}
                    className="quick-button"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'string':
        return (
          <div className="string-editor">
            <Input
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              placeholder={`请输入 ${param.param.name} 的值`}
              size="large"
              className="string-input"
            />
          </div>
        )

      case 'path':
        return (
          <div className="path-editor">
            <Input
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              placeholder="选择文件路径"
              size="large"
              className="path-input"
              readOnly
            />
            <Button
              icon={<FolderOpen size={18} />}
              onClick={handleBrowseFile}
              className="browse-button"
              size="large"
            >
              浏览文件
            </Button>
          </div>
        )

      case 'select':
        return (
          <div className="select-editor">
            <Select
              value={localValue}
              onChange={setLocalValue}
              options={param.param.options}
              size="large"
              className="select-input"
              placeholder="请选择选项"
            />
          </div>
        )

      default:
        return null
    }
  }

  if (!param) return null

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={null}
      footer={null}
      width={600}
      className="param-edit-modal"
      closeIcon={<X size={20} />}
    >
      <div className="modal-content">
        <div className="modal-header">
          <div className="param-info">
            <code className="param-name">{param.param.name}</code>
            <span className="param-description">{param.param.description}</span>
          </div>
        </div>

        <div className="modal-body">
          {renderEditor()}
        </div>

        <div className="modal-footer">
          <Space size="middle">
            <Button onClick={onClose} className="cancel-button">
              取消
            </Button>
            <Button type="primary" onClick={handleSave} className="save-button">
              保存
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  )
}
