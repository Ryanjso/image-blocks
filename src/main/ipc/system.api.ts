import { app, dialog } from 'electron'
import { procedure, router } from './trpc'
import * as path from 'path'
import { z } from 'zod'
import { processImages } from '../helpers/system.helpers'
import { TRPCError } from '@trpc/server'

export const systemRouter = router({
  getDefaultDirectory: procedure.query(() => {
    // its technically possible for this to not exist
    // so eventually create a fallback or error handling
    return app.getPath('documents')
  }),
  selectDirectory: procedure.mutation(async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    })

    if (result.canceled) return null
    return result.filePaths[0]
  }),
  selectImages: procedure.mutation(async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp'] }]
    })

    if (result.canceled) return []

    const images = await processImages(result.filePaths)

    return images
  }),
  // for handling drag and drop images
  addImages: procedure
    .input(z.object({ filePaths: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']

      //  throw an error if the file is not an image
      for (const filePath of input.filePaths) {
        const ext = path.extname(filePath).toLowerCase()
        if (!allowedExtensions.includes(ext)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `File ${filePath} is not an allowed image type. Allowed types are: ${allowedExtensions.join(', ')}`
          })
        }
      }

      const images = await processImages(input.filePaths)
      return images
    })
})
