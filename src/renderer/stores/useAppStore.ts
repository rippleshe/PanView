import { create } from 'zustand'
import type { AppState, SelectedParam } from '../types/app'
import { getParamById } from '../utils/paramLibrary'

interface AppStore extends AppState {
  setSelectedFile: (file: string | null) => void
  setInputFormat: (format: string) => void
  setOutputFormat: (format: string) => void
  setOutputFileName: (name: string) => void
  resetOutputFileName: () => void
  setOutputPath: (path: string | null) => void
  setPandocPath: (path: string) => Promise<void>
  initializePandocPath: () => Promise<void>
  addParam: (paramId: string, value?: unknown) => void
  removeParam: (paramId: string) => void
  updateParam: (paramId: string, value: unknown) => void
  clearParams: () => void
  clearVariables: () => void
  setConverting: (converting: boolean) => void
  setConversionResult: (result: AppState['conversionResult']) => void
  setPandocInfo: (info: AppState['pandocInfo']) => void
  toggleAdvancedOptions: () => void
  setTemplatePath: (path: string | null) => void
  setVariable: (key: string, value: string) => void
  checkPandoc: () => Promise<void>
  executeConversion: () => Promise<void>
}

const OUTPUT_PATH_STORAGE_KEY = 'panview-output-path'
const PANDOC_PATH_STORAGE_KEY = 'panview-pandoc-path'

const EXTENSION_TO_FORMAT: Record<string, string> = {
  md: 'markdown', markdown: 'markdown', html: 'html', htm: 'html',
  docx: 'docx', pdf: 'pdf', txt: 'txt', rst: 'rst',
  tex: 'tex', epub: 'epub', odt: 'odt', pptx: 'pptx'
}

function getStoredValue(key: string): string {
  try { return localStorage.getItem(key)?.trim() ?? '' } catch { return '' }
}

function setStoredValue(key: string, value: string): void {
  try {
    if (value.trim()) localStorage.setItem(key, value.trim())
    else localStorage.removeItem(key)
  } catch (e) { console.error(`localStorage "${key}":`, e) }
}

function getFileNameFromPath(p: string) { return p.split(/[/\\]/).pop() || '' }
function stripExtension(name: string) { return name.replace(/\.[^/.]+$/, '') }
function buildOutputFileName(base: string, format: string) { return `${base.trim() || 'output'}.${format}` }
function getBaseNameFromFilePath(p: string | null) {
  if (!p) return 'output'
  return stripExtension(getFileNameFromPath(p)) || 'output'
}
function inferInputFormatFromPath(p: string) {
  const ext = getFileNameFromPath(p).split('.').pop()?.toLowerCase() || ''
  return EXTENSION_TO_FORMAT[ext] || null
}
function getDirectoryFromPath(p: string) {
  const norm = p.replace(/\\/g, '/')
  const last = norm.lastIndexOf('/')
  if (last <= 0) return '.'
  const dir = norm.slice(0, last)
  return p.includes('\\') ? dir.replace(/\//g, '\\') : dir
}
function joinPath(dir: string, file: string) {
  if (!dir) return file
  if (dir.endsWith('/') || dir.endsWith('\\')) return `${dir}${file}`
  return `${dir}${dir.includes('\\') ? '\\' : '/'}${file}`
}

function generatePandocArgs(params: SelectedParam[], variables: Record<string, string>): string[] {
  const args: string[] = []
  for (const param of params) {
    const def = param.param
    if (!def) continue
    const { name, type } = def
    const val = param.value
    if (type === 'boolean') {
      if (val === true) args.push(name)
    } else if (val !== undefined && val !== '') {
      if (type === 'number' || type === 'select') args.push(`${name}=${String(val)}`)
      else args.push(name, String(val))
    }
  }
  for (const [k, v] of Object.entries(variables)) {
    if (v) args.push(`--variable=${k}:${v}`)
  }
  return args
}

export const useAppStore = create<AppStore>((set, get) => ({
  selectedFiles: [],
  selectedFile: null,
  inputFormat: 'markdown',
  outputFormat: 'docx',
  outputFileName: '',
  isOutputFileNameCustomized: false,
  outputPath: getStoredValue(OUTPUT_PATH_STORAGE_KEY) || null,
  pandocPath: getStoredValue(PANDOC_PATH_STORAGE_KEY),
  selectedParams: [],
  parameters: {},
  isConverting: false,
  conversionResult: null,
  pandocInfo: null,
  showAdvancedOptions: false,
  templatePath: null,
  variables: {},

  setSelectedFiles: (files) => {
    if (!files.length) { set({ selectedFiles: [], outputFileName: '', isOutputFileNameCustomized: false, conversionResult: null }); return }
    const first = files[0]
    const inferred = inferInputFormatFromPath(first)
    const { outputFormat } = get()
    set({ selectedFiles: files, ...(inferred ? { inputFormat: inferred } : {}), outputFileName: buildOutputFileName(getBaseNameFromFilePath(first), outputFormat), isOutputFileNameCustomized: false, conversionResult: null })
  },
  setSelectedFile: (file) => {
    if (!file) { set({ selectedFile: null, outputFileName: '', isOutputFileNameCustomized: false, conversionResult: null }); return }
    const inferred = inferInputFormatFromPath(file)
    const { outputFormat } = get()
    set({ selectedFile: file, ...(inferred ? { inputFormat: inferred } : {}), outputFileName: buildOutputFileName(getBaseNameFromFilePath(file), outputFormat), isOutputFileNameCustomized: false, conversionResult: null })
  },
  addSelectedFile: (file) => {
    const { selectedFiles, inputFormat } = get()
    const inferred = inferInputFormatFromPath(file)
    if (selectedFiles.length > 0 && inferred !== inputFormat) throw new Error('文件类型不一致，请选择相同类型的文件')
    const newFiles = [...selectedFiles, file]
    const { outputFormat } = get()
    set({ selectedFiles: newFiles, ...(inferred ? { inputFormat: inferred } : {}), outputFileName: buildOutputFileName(getBaseNameFromFilePath(file), outputFormat), isOutputFileNameCustomized: false, conversionResult: null })
  },
  removeSelectedFile: (index) => {
    const { selectedFiles } = get()
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    if (!newFiles.length) { set({ selectedFiles: [], outputFileName: '', isOutputFileNameCustomized: false, conversionResult: null }); return }
    const first = newFiles[0]
    const inferred = inferInputFormatFromPath(first)
    const { outputFormat } = get()
    set({ selectedFiles: newFiles, ...(inferred ? { inputFormat: inferred } : {}), outputFileName: buildOutputFileName(getBaseNameFromFilePath(first), outputFormat), isOutputFileNameCustomized: false, conversionResult: null })
  },
  setOutputFormat: (format) => {
    const { selectedFiles, outputFileName, isOutputFileNameCustomized } = get()
    const first = selectedFiles[0] || ''
    const autoBase = getBaseNameFromFilePath(first)
    const manualBase = stripExtension(outputFileName) || autoBase
    set({ outputFormat: format, outputFileName: buildOutputFileName(isOutputFileNameCustomized ? manualBase : autoBase, format) })
  },
  setOutputFileName: (name) => set({ outputFileName: name, isOutputFileNameCustomized: true }),
  resetOutputFileName: () => {
    const { selectedFiles, outputFormat } = get()
    set({ outputFileName: buildOutputFileName(getBaseNameFromFilePath(selectedFiles[0] || ''), outputFormat), isOutputFileNameCustomized: false })
  },
  setOutputPath: (path) => { set({ outputPath: path }); setStoredValue(OUTPUT_PATH_STORAGE_KEY, path || '') },
  setPandocPath: async (path) => {
    const p = path.trim(); set({ pandocPath: p }); setStoredValue(PANDOC_PATH_STORAGE_KEY, p)
    try { await window.electronAPI.pandoc.setPath(p); await get().checkPandoc() } catch (e) { console.error(e) }
  },
  initializePandocPath: async () => {
    let resolved = get().pandocPath.trim()
    try { const saved = await window.electronAPI.pandoc.getSavedPath(); if (saved?.trim()) resolved = saved.trim() } catch (e) { console.error(e) }
    set({ pandocPath: resolved }); setStoredValue(PANDOC_PATH_STORAGE_KEY, resolved)
    await get().checkPandoc()
  },
  setInputFormat: (format) => set({ inputFormat: format }),

  addParam: (paramId, value) => {
    const { selectedParams } = get()
    const def = getParamById(paramId)
    if (!def) return
    let v = value !== undefined ? value : def.defaultValue
    if (def.type === 'boolean' && value === undefined) v = true
    if (!selectedParams.find(p => p.id === paramId)) {
      set({ selectedParams: [...selectedParams, { id: paramId, value: v, param: def }], parameters: { ...get().parameters, [paramId]: v } })
    }
  },
  removeParam: (paramId) => {
    const next = { ...get().parameters }; delete next[paramId]
    set({ selectedParams: get().selectedParams.filter(p => p.id !== paramId), parameters: next })
  },
  updateParam: (paramId, value) => {
    set({ selectedParams: get().selectedParams.map(p => p.id === paramId ? { ...p, value } : p), parameters: { ...get().parameters, [paramId]: value } })
  },
  clearParams: () => set({ selectedParams: [], parameters: {} }),
  clearVariables: () => set({ variables: {} }),
  setConverting: (v) => set({ isConverting: v }),
  setConversionResult: (r) => set({ conversionResult: r }),
  setPandocInfo: (info) => set({ pandocInfo: info }),
  toggleAdvancedOptions: () => set(s => ({ showAdvancedOptions: !s.showAdvancedOptions })),
  setTemplatePath: (path) => set({ templatePath: path }),
  setVariable: (key, value) => set({ variables: { ...get().variables, [key]: value } }),

  checkPandoc: async () => {
    const { pandocPath } = get()
    try {
      const info = await window.electronAPI.pandoc.check(pandocPath || undefined)
      set({ pandocInfo: { version: info.version, available: info.available, path: info.path, source: info.source, message: info.message } })
    } catch (e: any) {
      set({ pandocInfo: { version: 'unknown', available: false, path: pandocPath, source: pandocPath ? 'custom' : 'unknown', message: e?.message || '无法检测 Pandoc' } })
    }
  },

  executeConversion: async () => {
    const { selectedFiles, outputFileName, outputPath, outputFormat, inputFormat, selectedParams, pandocPath, variables } = get()
    if (!selectedFiles.length) { set({ conversionResult: { success: false, output: '', error: '请先选择要转换的文件' } }); return }

    const first = selectedFiles[0]
    const normName = outputFileName.trim() || buildOutputFileName(getBaseNameFromFilePath(first), outputFormat)
    if (!outputFileName.trim()) set({ outputFileName: normName, isOutputFileNameCustomized: false })

    const outputDir = outputPath?.trim() || getDirectoryFromPath(first)
    const args = generatePandocArgs(selectedParams, variables)
    set({ isConverting: true, conversionResult: null })

    try {
      const results: { inputFile: string; outputFile: string; result: { success: boolean } }[] = []
      for (const inputFile of selectedFiles) {
        const outputFile = joinPath(outputDir, buildOutputFileName(getBaseNameFromFilePath(inputFile), outputFormat))
        const result = await window.electronAPI.pandoc.execute({ inputFile, outputFile, inputFormat, outputFormat, args, pandocPath: pandocPath || undefined })
        results.push({ inputFile, outputFile, result })
      }
      const successes = results.filter(r => r.result.success)
      set({
        conversionResult: {
          success: successes.length === selectedFiles.length,
          output: `成功转换 ${successes.length}/${selectedFiles.length} 个文件`,
          error: successes.length < selectedFiles.length ? `${selectedFiles.length - successes.length} 个文件转换失败` : undefined,
          outputFiles: successes.map(r => r.outputFile)
        },
        isConverting: false
      })
    } catch (e: any) {
      set({ conversionResult: { success: false, output: '', error: e?.message || '转换失败' }, isConverting: false })
    }
  }
}))
