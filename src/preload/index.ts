import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    quit: () => ipcRenderer.send('app:quit')
  },
  pandoc: {
    check: (preferredPath?: string) => ipcRenderer.invoke('pandoc:check', preferredPath),
    execute: (request: {
      inputFile: string
      outputFile: string
      inputFormat: string
      outputFormat: string
      args: string[]
      pandocPath?: string
    }) => ipcRenderer.invoke('pandoc:execute', request),
    getSavedPath: () => ipcRenderer.invoke('pandoc:get-saved-path'),
    setPath: (path: string) => ipcRenderer.invoke('pandoc:set-path', path),
    getFormats: () => ipcRenderer.invoke('pandoc:get-formats')
  },
  file: {
    selectAny: () => ipcRenderer.invoke('file:select-any'),
    select: () => ipcRenderer.invoke('file:select'),
    selectOutput: (defaultName: string) => ipcRenderer.invoke('file:select-output', defaultName),
    selectTemplate: () => ipcRenderer.invoke('file:select-template'),
    selectFolder: () => ipcRenderer.invoke('file:select-folder'),
    selectExecutable: () => ipcRenderer.invoke('file:select-executable')
  },
  shell: {
    openPath: (filePath: string) => ipcRenderer.invoke('shell:open-path', filePath),
    showInFolder: (filePath: string) => ipcRenderer.invoke('shell:show-in-folder', filePath)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
