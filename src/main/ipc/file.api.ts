import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { z } from 'zod'
import { procedure, router } from './trpc'

export const fileRouter = router({
  rename: procedure
    .input(z.object({ oldPath: z.string(), newName: z.string() }))
    .mutation((req) => {
      const { oldPath, newName } = req.input

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
    }),
  createTemp: procedure.input(z.object({ imagePath: z.string() })).mutation((req) => {
    const { imagePath } = req.input
    const userPath = app.getPath('userData')

    // Create a temporary directory in the user data directory
    const tempDir = path.join(userPath, 'temp')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    // Copy the image to the temporary directory
    const tempPath = path.join(tempDir, path.basename(imagePath))
    fs.copyFileSync(imagePath, tempPath)

    return tempPath
  }),
  save: procedure
    .input(
      z.object({
        currentFilePath: z.string(),
        outputDirectory: z.string(),
        outputFileNameWithoutExt: z.string()
      })
    )
    .mutation((req) => {
      const { currentFilePath, outputDirectory, outputFileNameWithoutExt } = req.input
      const originalExtension = path.extname(currentFilePath) // Extract the original extension
      const newFileName = outputFileNameWithoutExt + originalExtension // Append original extension to the new name
      const newPath = path.join(outputDirectory, newFileName)

      fs.copyFileSync(currentFilePath, newPath) // Copy the file to the output directory
      return newPath // Return the new path after saving
    })
})
