import { Check, FolderOpen } from 'lucide-react'
import { useState } from 'react'
import type { ParamDefinition } from '../constants/params'

interface ParamValueEditorProps {
  param: ParamDefinition
  value: any
  onChange: (value: any) => void
  darkMode: boolean
}

export function ParamValueEditor({ param, value, onChange, darkMode }: ParamValueEditorProps) {
  const [isSelectingFile, setIsSelectingFile] = useState(false)

  const handleFileSelect = async () => {
    setIsSelectingFile(true)
    try {
      const result = await window.electronAPI.file.selectAny()

      if (result && !result.canceled && result.filePath) {
        onChange(result.filePath)
      }
    } catch (error) {
      console.error('Failed to select file:', error)
    } finally {
      setIsSelectingFile(false)
    }
  }

  if (param.type === 'flag') {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />
          <div className={`
            w-5 h-5 rounded border-2 transition-all duration-200
            ${value === true
              ? 'bg-primary-500 border-primary-500'
              : darkMode
                ? 'border-gray-600 hover:border-gray-500'
                : 'border-border hover:border-primary-400'
            }
          `}>
            {value === true && (
              <Check size={14} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
        </div>
        <span className={`text-caption ${darkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
          {value === true ? '已启用' : '未启用'}
        </span>
      </label>
    )
  }

  if (param.valueType === 'select' && param.options) {
    return (
      <select
        value={value || param.defaultValue || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`select w-full text-caption ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
      >
        {param.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }

  if (param.valueType === 'number') {
    return (
      <input
        type="number"
        value={value ?? param.defaultValue ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        placeholder={param.placeholder}
        className={`input w-full text-caption ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
      />
    )
  }

  if (param.valueType === 'path') {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={param.placeholder}
          readOnly
          className={`input flex-1 text-caption ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
        />
        <button
          onClick={handleFileSelect}
          disabled={isSelectingFile}
          className={`icon-button ${darkMode ? 'text-gray-400 hover:text-white' : ''}`}
          aria-label="选择文件"
        >
          <FolderOpen size={16} />
        </button>
      </div>
    )
  }

  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={param.placeholder}
      className={`input w-full text-caption ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
    />
  )
}
