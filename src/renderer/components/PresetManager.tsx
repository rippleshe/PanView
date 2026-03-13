import { Save, FolderOpen, Trash2, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAppStore } from '../stores/useAppStore'
import './PresetManager.css'

interface Preset {
  id: string
  name: string
  description: string
  params: Array<{ id: string; value: unknown }>
  createdAt: string
}

interface PresetManagerProps {
  visible: boolean
  onClose: () => void
}

export function PresetManager({ visible, onClose }: PresetManagerProps) {
  const { selectedParams, addParam, clearParams } = useAppStore()
  const [presets, setPresets] = useState<Preset[]>([])
  const [presetName, setPresetName] = useState('')
  const [presetDescription, setPresetDescription] = useState('')
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    if (visible) loadPresets()
  }, [visible])

  const loadPresets = () => {
    try {
      const saved = localStorage.getItem('panview-presets')
      if (saved) setPresets(JSON.parse(saved))
    } catch { /* ignore */ }
  }

  const savePreset = () => {
    if (!presetName.trim() || selectedParams.length === 0) return
    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      description: presetDescription.trim() || '自定义预设',
      params: selectedParams.map(p => ({ id: p.id, value: p.value })),
      createdAt: new Date().toISOString()
    }
    const updated = [...presets, newPreset]
    setPresets(updated)
    localStorage.setItem('panview-presets', JSON.stringify(updated))
    setPresetName('')
    setPresetDescription('')
    setSaveMsg('预设已保存')
    setTimeout(() => setSaveMsg(''), 2000)
  }

  const applyPreset = (preset: Preset) => {
    clearParams()
    // Fix: pass id and value separately, not the whole object
    preset.params.forEach(p => addParam(p.id, p.value))
    onClose()
  }

  const deletePreset = (presetId: string) => {
    const updated = presets.filter(p => p.id !== presetId)
    setPresets(updated)
    localStorage.setItem('panview-presets', JSON.stringify(updated))
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-xl animate-scale-in flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-heading">预设管理</h2>
          <button onClick={onClose} className="btn-ghost px-3 py-1.5 text-sm rounded-lg">关闭</button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
          {/* Save section */}
          <div>
            <h3 className="text-subheading mb-3">保存当前配置</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="预设名称（必填）"
                value={presetName}
                onChange={e => setPresetName(e.target.value)}
                className="input w-full"
              />
              <input
                type="text"
                placeholder="描述（可选）"
                value={presetDescription}
                onChange={e => setPresetDescription(e.target.value)}
                className="input w-full"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={savePreset}
                  disabled={!presetName.trim() || selectedParams.length === 0}
                  className="btn flex items-center gap-2 px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={14} />
                  保存预设（{selectedParams.length} 个参数）
                </button>
                {saveMsg && <span className="text-caption text-success">{saveMsg}</span>}
              </div>
              {selectedParams.length === 0 && (
                <p className="text-caption text-text-muted">请先在下方选择参数后再保存</p>
              )}
            </div>
          </div>

          {/* List section */}
          <div>
            <h3 className="text-subheading mb-3">已保存的预设（{presets.length}）</h3>
            {presets.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <Clock size={40} className="mb-3 opacity-20 text-text-tertiary" />
                <p className="text-body">暂无保存的预设</p>
                <p className="text-caption mt-1">保存当前参数配置后，可在此快速加载</p>
              </div>
            ) : (
              <div className="space-y-2">
                {presets.map(preset => (
                  <div key={preset.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary-300 hover:bg-gray-50 transition-all duration-150">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary truncate">{preset.name}</span>
                        <span className="badge badge-primary flex-shrink-0">{preset.params.length} 参数</span>
                      </div>
                      <p className="text-caption truncate mt-0.5">{preset.description}</p>
                      <p className="text-caption text-text-muted mt-0.5">{formatDate(preset.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => applyPreset(preset)}
                        className="btn px-3 py-1.5 text-xs rounded-md flex items-center gap-1"
                      >
                        <FolderOpen size={12} />
                        加载
                      </button>
                      <button
                        onClick={() => deletePreset(preset.id)}
                        className="btn-ghost p-1.5 rounded-md text-text-tertiary hover:text-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
