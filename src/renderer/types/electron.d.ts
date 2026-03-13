export interface ElectronAPI {
  app: {
    getVersion: () => Promise<string>
    quit: () => void
  }
  pandoc: {
    check: (preferredPath?: string) => Promise<PandocInfo>
    execute: (request: ExecuteRequest) => Promise<ExecuteResult>
    getSavedPath: () => Promise<string>
    setPath: (path: string) => Promise<{ success: boolean }>
    getFormats: () => Promise<FormatsResult>
  }
  file: {
    selectAny: () => Promise<FileSelectResult>
    select: () => Promise<FileSelectResult>
    selectOutput: (defaultName: string) => Promise<FileSelectResult>
    selectTemplate: () => Promise<FileSelectResult>
    selectFolder: () => Promise<FileSelectResult>
    selectExecutable: () => Promise<FileSelectResult>
  }
  shell: {
    openPath: (filePath: string) => Promise<{ success: boolean; error?: string }>
    showInFolder: (filePath: string) => Promise<{ success: boolean }>
  }
}

export interface PandocInfo {
  version: string
  path: string
  available: boolean
  source: 'custom' | 'system' | 'unknown'
  message?: string
}

export interface ExecuteRequest {
  inputFile: string
  outputFile: string
  inputFormat: string
  outputFormat: string
  args: string[]
  pandocPath?: string
}

export interface ExecuteResult {
  success: boolean
  output: string
  error: string
}

export interface FormatsResult {
  success: boolean
  formats: string[]
  error?: string
}

export interface FileSelectResult {
  canceled: boolean
  filePath: string
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
