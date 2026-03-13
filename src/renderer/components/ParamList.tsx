import { ChevronDown, ChevronUp, Plus, Search, Settings, X } from 'lucide-react'
import { useState } from 'react'
import { CATEGORIES, getParamById, isParamVisible, PARAM_DEFINITIONS, searchParams } from '../constants/params'
import { useAppStore } from '../stores/useAppStore'
import { ParamValueEditor } from './ParamValueEditor'

interface ParamListProps {
  darkMode: boolean
}

export function ParamList({ darkMode }: ParamListProps) {
  const { selectedParams, addParam, removeParam, updateParam, outputFormat } = useAppStore()
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredParams = searchParams(searchQuery).filter(param =>
    isParamVisible(param, selectedParams, outputFormat)
  )
  const selectedParamIds = selectedParams.map(p => p.id)
  const availableParams = filteredParams.filter(p => !selectedParamIds.includes(p.id))

  const groupedParams = CATEGORIES.reduce((acc, category) => {
    acc[category] = availableParams
      .filter(p => p.category === category)
      .sort((a, b) => (a.priority || 999) - (b.priority || 999))
    return acc
  }, {} as Record<string, typeof PARAM_DEFINITIONS>)

  return (
    <div className="px-4 py-3 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className={`rounded-lg border shadow-sm transition-all duration-200 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-border'}`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-full px-4 py-3.5 flex items-center justify-between transition-all duration-200 rounded-t-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-center gap-2">
              <Settings size={16} className={darkMode ? 'text-gray-400' : 'text-text-tertiary'} />
              <span className={`text-caption font-medium whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-text-tertiary'}`}>可选参数</span>
              <span className="badge badge-primary">
                {availableParams.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-caption ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>
                {isExpanded ? '收起' : '展开'}
              </span>
              {isExpanded ? (
                <ChevronUp size={16} className={darkMode ? 'text-gray-400' : 'text-text-tertiary transition-transform duration-200'} />
              ) : (
                <ChevronDown size={16} className={darkMode ? 'text-gray-400' : 'text-text-tertiary transition-transform duration-200'} />
              )}
            </div>
          </button>

          {isExpanded && (
            <div className={`border-t animate-slide-down ${darkMode ? 'border-gray-700' : 'border-border'}`}>
              <div className={`px-4 py-3.5 border-b ${darkMode ? 'border-gray-700' : 'border-border'}`}>
                <div className="relative">
                  <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`} />
                  <input
                    type="text"
                    placeholder="搜索参数..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`input w-full pl-9 text-caption ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
                  />
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                {Object.entries(groupedParams).map(([category, params]) => {
                  if (params.length === 0) return null

                  return (
                    <div key={category} className={`border-b last:border-b-0 ${darkMode ? 'border-gray-700' : 'border-border'}`}>
                      <div className={`px-4 py-2.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <span className={`text-caption font-semibold ${darkMode ? 'text-gray-300' : 'text-text-tertiary'}`}>{category}</span>
                      </div>
                      <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-border'}`}>
                        {params.map((param, index) => (
                          <div
                            key={param.id}
                            className={`px-4 py-3 transition-all duration-200 cursor-pointer group ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <code className={`text-subheading font-mono transition-colors duration-200 ${darkMode ? 'text-white group-hover:text-blue-400' : 'text-text-primary group-hover:text-primary-600'}`}>
                                    {param.name}
                                  </code>
                                </div>
                                <p className={`text-caption mt-1 ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>
                                  {param.label}
                                </p>
                                <p className={`text-caption mt-0.5 ${darkMode ? 'text-gray-500' : 'text-text-muted'}`}>
                                  {param.description}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addParam(param.id)
                                }}
                                className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {availableParams.length === 0 && (
                  <div className="px-4 py-12 text-center">
                    <Search size={32} className={`mx-auto mb-3 opacity-30 ${darkMode ? 'text-gray-600' : 'text-text-tertiary'}`} />
                    <p className={`text-body ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>未找到匹配的参数</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={`flex flex-col rounded-lg shadow-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border border-border'}`}>
          <div className={`px-4 py-3.5 border-b ${darkMode ? 'border-gray-700' : 'border-border'}`}>
            <h3 className={`text-subheading font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-text-primary'}`}>
              <span>已选参数</span>
              <span className="badge badge-primary">
                {selectedParams.length}
              </span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            {selectedParams.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Settings size={48} className={`mb-3 opacity-30 ${darkMode ? 'text-gray-600' : 'text-text-tertiary'}`} />
                <p className={`text-body ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>暂无已选参数</p>
                <p className={`text-caption mt-1 ${darkMode ? 'text-gray-500' : 'text-text-muted'}`}>从左侧选择要添加的参数</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedParams.map((selectedParam) => {
                  const paramDef = getParamById(selectedParam.id)
                  if (!paramDef) return null

                  const isVisible = isParamVisible(paramDef, selectedParams, outputFormat)

                  return (
                    <div
                      key={selectedParam.id}
                      className={`border rounded-lg p-3 hover:shadow-md transition-all duration-200 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-border'} ${!isVisible ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <code className={`text-caption font-mono block truncate ${darkMode ? 'text-white' : 'text-text-primary'}`}>
                            {paramDef.name}
                          </code>
                          <span className={`text-caption block truncate ${darkMode ? 'text-gray-400' : 'text-text-tertiary'}`}>
                            {paramDef.label}
                          </span>
                        </div>
                        <button
                          onClick={() => removeParam(selectedParam.id)}
                          className={`flex-shrink-0 p-1 rounded-md transition-colors duration-200 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-text-tertiary hover:text-error'}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <ParamValueEditor
                        param={paramDef}
                        value={selectedParam.value}
                        onChange={(value) => updateParam(selectedParam.id, value)}
                        darkMode={darkMode}
                      />
                      {!isVisible && (
                        <div className={`mt-2 text-caption ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          此参数当前不可用（依赖条件未满足或输出格式不匹配）
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
