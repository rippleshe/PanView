import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { registerFileHandlers } from './handlers/file'
import { registerPandocHandlers } from './handlers/pandoc'
import { createWindow } from './window'

let mainWindow: BrowserWindow | null = null

function onAppReady(): void {
  app.setAppUserModelId('com.panview.app')

  mainWindow = createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  registerPandocHandlers()
  registerFileHandlers()
}

app.whenReady().then(onAppReady)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

ipcMain.handle('app:get-version', () => {
  return app.getVersion()
})

ipcMain.on('app:quit', () => {
  app.quit()
})

// Open a file or folder with the system default application
ipcMain.handle('shell:open-path', async (_, filePath: string) => {
  const error = await shell.openPath(filePath)
  return { success: !error, error }
})

// Show a file in its containing folder (Explorer/Finder)
ipcMain.handle('shell:show-in-folder', (_, filePath: string) => {
  shell.showItemInFolder(filePath)
  return { success: true }
})
