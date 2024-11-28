import { app, dialog } from 'electron'
import { procedure, router } from './trpc'

export const systemRouter = router({
  getDefaultDirectory: procedure.query(() => {
    // its technically possible for this to not exist
    // so eventually create a fallback or error handling
    return app.getPath('documents')
  }),
  selectFolder: procedure.mutation(async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory']
    })

    if (result.canceled) return null
    return result.filePaths[0]
  })
})
