export interface SelectedParam {
  id: string
  value: any
  param: PandocParam
}

export interface FormatOption {
  value: string
  label: string
  extension?: string
  description?: string
}

export interface PandocParam {
  id: string
  name: string
  description: string
  category: string
  type: 'boolean' | 'string' | 'number' | 'path' | 'select'
  defaultValue?: any
  min?: number
  max?: number
  step?: number
  options?: FormatOption[]
}

export interface ConversionResult {
  success: boolean
  output: string
  error?: string
  /** Paths of successfully converted output files */
  outputFiles?: string[]
}

export interface AppState {
  selectedFiles: string[]
  selectedFile: string | null
  inputFormat: string
  outputFormat: string
  outputFileName: string
  isOutputFileNameCustomized: boolean
  outputPath: string | null
  pandocPath: string
  selectedParams: SelectedParam[]
  parameters: Record<string, any>
  isConverting: boolean
  conversionResult: ConversionResult | null
  pandocInfo: {
    version: string
    available: boolean
    path: string
    source: 'custom' | 'system' | 'unknown'
    message?: string
  } | null
  showAdvancedOptions: boolean
  templatePath: string | null
  variables: Record<string, string>
}

export interface AppStore extends AppState {
  setSelectedFiles: (files: string[]) => void
  setSelectedFile: (file: string | null) => void
  addSelectedFile: (file: string) => void
  removeSelectedFile: (index: number) => void
  setOutputFormat: (format: string) => void
  setOutputFileName: (name: string) => void
  resetOutputFileName: () => void
  setOutputPath: (path: string | null) => void
  setPandocPath: (path: string) => void
  initializePandocPath: () => Promise<void>
  setInputFormat: (format: string) => void
  addParam: (paramId: string, value?: any) => void
  removeParam: (paramId: string) => void
  updateParam: (paramId: string, value: any) => void
  toggleParam: (paramId: string) => void
  setTemplatePath: (path: string | null) => void
  setVariable: (key: string, value: string) => void
  removeVariable: (key: string) => void
  setShowAdvancedOptions: (show: boolean) => void
  checkPandoc: () => Promise<void>
  executeConversion: () => Promise<void>
}
