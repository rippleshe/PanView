import { ArrowRight, FileText, Settings } from 'lucide-react'
import { useAppStore } from '../stores/useAppStore'
import { OUTPUT_FORMATS } from '../utils/paramLibrary'

interface ConversionSettingsProps {
  darkMode: boolean
}

/**
 * Maps pandoc format strings (what the store holds) → human-readable label + extension.
 * OUTPUT_FORMATS uses short aliases like 'md' while the store/pandoc uses 'markdown'.
 * This map bridges the gap so we never show "未知格式".
 */
const PANDOC_FORMAT_DISPLAY: Record<string, { label: string; ext: string }> = {
  markdown:   { label: 'Markdown',         ext: '.md'       },
  gfm:        { label: 'Markdown (GFM)',   ext: '.md'       },
  commonmark: { label: 'Markdown',         ext: '.md'       },
  docx:       { label: 'Word 文档',        ext: '.docx'     },
  html:       { label: 'HTML',             ext: '.html'     },
  pdf:        { label: 'PDF',              ext: '.pdf'      },
  txt:        { label: '纯文本',            ext: '.txt'      },
  rst:        { label: 'reStructuredText', ext: '.rst'      },
  tex:        { label: 'LaTeX',            ext: '.tex'      },
  latex:      { label: 'LaTeX',            ext: '.tex'      },
  epub:       { label: 'EPUB',             ext: '.epub'     },
  odt:        { label: 'OpenDocument',     ext: '.odt'      },
  pptx:       { label: 'PowerPoint',       ext: '.pptx'     },
  mediawiki:  { label: 'MediaWiki',        ext: '.wiki'     },
  org:        { label: 'Org Mode',         ext: '.org'      },
}

function getPandocStatusLabel(info: ReturnType<typeof useAppStore.getState>['pandocInfo']): string {
  if (!info) return '未检测'
  if (!info.available) return '不可用'
  if (info.source === 'custom') return '可用（自定义路径）'
  if (info.source === 'system') return '可用（系统路径）'
  return '可用'
}

export function ConversionSettings({ darkMode }: ConversionSettingsProps) {
  const {
    inputFormat,
    outputFormat,
    setOutputFormat,
    pandocInfo,
    selectedParams,
    selectedFiles,
  } = useAppStore()

  // Use the store's inputFormat directly — it's already correctly set from file detection.
  // Fall back to extension-based label only when no file is selected yet.
  const noFile = selectedFiles.length === 0
  const displayInfo = PANDOC_FORMAT_DISPLAY[inputFormat]
  const inputFormatLabel = noFile
    ? '—'
    : displayInfo?.label ?? inputFormat.toUpperCase()
  const inputFormatExt = noFile ? '' : (displayInfo?.ext ?? '')

  return (
    <div className="px-4 py-3 animate-slide-up">
      <div className={`p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border border-border'}`}>

        {/* Format row */}
        <div className="flex items-center gap-4">
          {/* Input format — read-only, driven by file detection */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <FileText size={18} className={darkMode ? 'text-blue-400' : 'text-primary-500'} />
              <span className={`text-caption font-medium whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>
                输入格式
              </span>
            </div>
            <div className={`px-3 py-1.5 rounded-md text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white border border-border text-text-primary'}`}>
              {inputFormatLabel}
              {inputFormatExt && (
                <span className={`ml-1.5 text-xs ${darkMode ? 'text-gray-500' : 'text-text-muted'}`}>
                  {inputFormatExt}
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="relative flex-shrink-0">
            <div className={`absolute inset-0 rounded-full blur-md animate-pulse-subtle ${darkMode ? 'bg-blue-400 opacity-30' : 'bg-primary-500 opacity-20'}`} />
            <ArrowRight size={20} className={`relative ${darkMode ? 'text-blue-400' : 'text-primary-500'}`} />
          </div>

          {/* Output format selector */}
          <div className="flex items-center gap-3 flex-1">
            <span className={`text-caption font-medium whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>
              转换为
            </span>
            <select
              value={outputFormat}
              onChange={e => setOutputFormat(e.target.value)}
              className={`select flex-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
            >
              {OUTPUT_FORMATS.map(fmt => (
                <option key={fmt.value} value={fmt.value}>
                  {fmt.label} (.{fmt.extension})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status row */}
        <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-border'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Settings size={16} className={darkMode ? 'text-gray-400' : 'text-text-tertiary'} />
                <span className={`text-caption font-medium whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>
                  Pandoc 状态
                </span>
              </div>
              <span className={`text-caption font-medium ${pandocInfo?.available ? 'text-success' : darkMode ? 'text-red-400' : 'text-error'}`}>
                {getPandocStatusLabel(pandocInfo)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-caption ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>参数</span>
              <span className="badge badge-primary">{selectedParams.length}</span>
            </div>
          </div>
          {pandocInfo?.message && (
            <p className={`mt-2 text-caption ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
              {pandocInfo.message}
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
