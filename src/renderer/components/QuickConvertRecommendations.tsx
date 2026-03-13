import { AlertTriangle, ArrowRight, CheckCircle, FileQuestion, Sparkles } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { getPresetsForFormat, type SmartPreset } from '../constants/presets'
import { useAppStore } from '../stores/useAppStore'

interface QuickConvertRecommendationsProps {
  darkMode: boolean
}

const FORMAT_LABELS: Record<string, string> = {
  markdown: 'Markdown', gfm: 'Markdown (GFM)', commonmark: 'Markdown',
  docx: 'Word', html: 'HTML', rst: 'reStructuredText',
  tex: 'LaTeX', latex: 'LaTeX', epub: 'EPUB',
  odt: 'OpenDocument', pdf: 'PDF', txt: '纯文本', pptx: 'PowerPoint',
}

const OUTPUT_FORMAT_LABELS: Record<string, string> = {
  pdf: 'PDF', docx: 'Word', html: 'HTML', markdown: 'Markdown',
  epub: 'EPUB', odt: 'ODT', rst: 'RST', tex: 'LaTeX', txt: '纯文本',
}

function fmtLabel(f: string) { return FORMAT_LABELS[f] ?? f.toUpperCase() }
function outLabel(f: string) { return OUTPUT_FORMAT_LABELS[f] ?? f.toUpperCase() }

function outFormatColor(fmt: string, dark: boolean): string {
  const map: Record<string, string> = {
    pdf:      dark ? 'bg-red-900/40 text-red-300'    : 'bg-red-50 text-red-600',
    docx:     dark ? 'bg-blue-900/40 text-blue-300'  : 'bg-blue-50 text-blue-600',
    html:     dark ? 'bg-orange-900/40 text-orange-300' : 'bg-orange-50 text-orange-600',
    markdown: dark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-50 text-purple-600',
    epub:     dark ? 'bg-green-900/40 text-green-300' : 'bg-green-50 text-green-600',
  }
  return map[fmt] ?? (dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')
}

export function QuickConvertRecommendations({ darkMode }: QuickConvertRecommendationsProps) {
  const { inputFormat, selectedFiles, setInputFormat, setOutputFormat, addParam, clearParams, clearVariables, setVariable } = useAppStore()
  const [activePresetId, setActivePresetId] = useState<string | null>(null)

  const presets = useMemo(() => getPresetsForFormat(inputFormat), [inputFormat])
  const hasFile = selectedFiles.length > 0

  const applyPreset = useCallback((preset: SmartPreset) => {
    if (preset.inputFormatOverride) setInputFormat(preset.inputFormatOverride)
    setOutputFormat(preset.outputFormat)
    clearParams()
    clearVariables()
    preset.params.forEach(p => addParam(p.id, p.value))
    preset.variables?.forEach(v => setVariable(v.key, v.value))
    setActivePresetId(preset.id)
  }, [setInputFormat, setOutputFormat, clearParams, clearVariables, addParam, setVariable])

  // ── No file yet ────────────────────────────────────────────────────────────
  if (!hasFile) {
    return (
      <div className="px-4 py-3 animate-slide-up">
        <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-border'}`}>
          <div className={`px-4 py-3.5 border-b flex items-center gap-2 ${darkMode ? 'border-gray-700' : 'border-border'}`}>
            <Sparkles size={16} className={darkMode ? 'text-yellow-300' : 'text-primary-500'} />
            <h3 className={`text-caption font-semibold ${darkMode ? 'text-gray-200' : 'text-text-primary'}`}>智能转换推荐</h3>
          </div>
          <div className={`flex items-center gap-3 px-5 py-6 ${darkMode ? 'text-gray-500' : 'text-text-muted'}`}>
            <FileQuestion size={32} className="flex-shrink-0 opacity-30" />
            <p className="text-caption leading-relaxed">
              上传文件后，将根据你的文件类型自动推荐最合适的转换方案，支持一键套用参数。
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (presets.length === 0) return null

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="px-4 py-3 animate-slide-up">
      <div className={`rounded-lg border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-border'}`}>

        {/* Header */}
        <div className={`px-4 py-3.5 border-b ${darkMode ? 'border-gray-700' : 'border-border'}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <Sparkles size={16} className={darkMode ? 'text-yellow-300' : 'text-primary-500'} />
            <h3 className={`text-caption font-semibold ${darkMode ? 'text-gray-200' : 'text-text-primary'}`}>
              智能转换推荐
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-text-secondary'}`}>
              {fmtLabel(inputFormat)}
            </span>
            <ArrowRight size={12} className={darkMode ? 'text-gray-500' : 'text-text-muted'} />
            <span className={`text-caption ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>
              {presets.length} 种方案
            </span>
          </div>
          <p className={`text-caption mt-1 ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>
            基于你的文件类型精准推荐，一键套用参数。标有 ⚠️ 的方案需额外安装工具。
          </p>
        </div>

        {/* Preset grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {presets.map(preset => {
            const isActive = activePresetId === preset.id
            const needsTools = preset.requiresTools && preset.requiresTools.length > 0

            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`
                  text-left p-4 rounded-lg border transition-all duration-200
                  hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500
                  ${isActive
                    ? darkMode ? 'bg-blue-500/20 border-blue-400 shadow-sm' : 'bg-primary-50 border-primary-400 shadow-sm'
                    : darkMode ? 'bg-gray-700/60 border-gray-600 hover:border-gray-500 hover:bg-gray-700' : 'bg-gray-50 border-border hover:border-primary-300 hover:bg-white'
                  }
                `}
              >
                {/* Top row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${outFormatColor(preset.outputFormat, darkMode)}`}>
                    {outLabel(preset.outputFormat)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {needsTools && (
                      <span title={`需要安装：${preset.requiresTools!.join('、')}`}>
                        <AlertTriangle size={13} className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} />
                      </span>
                    )}
                    {isActive && <CheckCircle size={14} className="text-primary-500 flex-shrink-0" />}
                  </div>
                </div>

                {/* Title */}
                <h4 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-100' : 'text-text-primary'}`}>
                  {preset.title}
                </h4>

                {/* Description */}
                <p className={`text-xs leading-relaxed mb-3 ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>
                  {preset.description}
                </p>

                {/* Tools warning */}
                {needsTools && (
                  <div className={`flex items-center gap-1.5 mb-2 text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    <AlertTriangle size={11} />
                    <span>需安装：{preset.requiresTools!.join('、')}</span>
                  </div>
                )}

                {/* Tags */}
                {preset.tags && preset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {preset.tags.map(tag => (
                      <span key={tag} className={`text-xs px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-white border border-border text-text-muted'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Applied footer */}
        {activePresetId && (
          <div className="px-4 pb-4 -mt-1">
            <p className={`text-caption ${darkMode ? 'text-gray-500' : 'text-text-muted'}`}>
              ✓ 已套用预设参数，可在下方"已选参数"区域查看或修改。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
