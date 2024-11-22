import { app, ipcMain } from 'electron'

import * as fs from 'fs'
import * as path from 'path'

export const registerFileHandlers = () => {
  ipcMain.handle('rename-file', async (_event, oldPath: string, newName: string) => {
    try {
      const directory = path.dirname(oldPath)
      const originalExtension = path.extname(oldPath) // Extract the original extension
      const newFileName = newName + originalExtension // Append original extension to the new name
      const newPath = path.join(directory, newFileName)

      fs.renameSync(oldPath, newPath) // Rename the file
      return newPath // Return the new path after renaming
    } catch (err) {
      if (err instanceof Error) return { error: err.message } // Return error if renaming fails
      return { error: 'An unknown error occurred' }
    }
  })

  // create a temporary duplicate of the image
  // that can be used to make changes without affecting the original
  ipcMain.handle('create-temp-file', async (_event, imagePath: string) => {
    const userPath = app.getPath('userData')

    // Create a temporary directory in the user data directory
    const tempDir = path.join(userPath, 'temp')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    // Copy the image to the temporary directory
    const tempPath = path.join(tempDir, path.basename(imagePath))
    fs.copyFileSync(imagePath, tempPath)

    return tempPath
  })

  ipcMain.handle('save-temp-file', async (_event, tempFilePath: string, saveFilePath: string) => {
    try {
      // Ensure the save directory exists
      const saveDir = path.dirname(saveFilePath)
      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true })
      }

      // Move the temp file to the save location
      fs.copyFileSync(tempFilePath, saveFilePath)

      // Delete the temporary file after successful copy
      fs.unlinkSync(tempFilePath)

      return { success: true }
    } catch (error) {
      console.error('Error handling file save:', error)
      if (error instanceof Error) return { success: false, error: error.message }
      return { success: false, error: 'An unknown error occurred' }
    }
  })
}
