import { dialog, ipcMain } from 'electron'

export function registerFileHandlers(): void {
  ipcMain.handle('file:select-any', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'All Files', extensions: ['*'] }]
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true, filePath: '' }
    }

    return { canceled: false, filePath: result.filePaths[0] }
  })

  ipcMain.handle('file:select', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Markdown Files', extensions: ['md', 'markdown'] },
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'HTML Files', extensions: ['html', 'htm'] },
        { name: 'Word Documents', extensions: ['docx'] },
        { name: 'PDF Files', extensions: ['pdf'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true, filePath: '' }
    }

    return { canceled: false, filePath: result.filePaths[0] }
  })

  ipcMain.handle('file:select-executable', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Executable Files', extensions: ['exe', 'app', 'bat', 'sh'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true, filePath: '' }
    }

    return { canceled: false, filePath: result.filePaths[0] }
  })

  ipcMain.handle('file:select-output', async (_, defaultName: string) => {
    const result = await dialog.showSaveDialog({
      defaultPath: defaultName,
      filters: [
        { name: 'Word Document', extensions: ['docx'] },
        { name: 'PDF', extensions: ['pdf'] },
        { name: 'HTML', extensions: ['html'] },
        { name: 'Markdown', extensions: ['md'] },
        { name: 'Plain Text', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (result.canceled || !result.filePath) {
      return { canceled: true, filePath: '' }
    }

    return { canceled: false, filePath: result.filePath }
  })

  ipcMain.handle('file:select-template', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'LaTeX Template', extensions: ['tex'] },
        { name: 'HTML Template', extensions: ['html'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true, filePath: '' }
    }

    return { canceled: false, filePath: result.filePaths[0] }
  })

  ipcMain.handle('file:select-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true, filePath: '' }
    }

    return { canceled: false, filePath: result.filePaths[0] }
  })
}
