import { app, ipcMain, dialog } from 'electron'

export const registerSystemHandlers = () => {
  // get path for output directory
  ipcMain.handle('get-default-directory', () => {
    const path = app.getPath('documents')
    // its technically possible for this to not exist
    // so eventually create a fallback or error handling
    return path
  })

  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    })

    if (result.canceled) return null
    return result.filePaths[0]
  })
}
