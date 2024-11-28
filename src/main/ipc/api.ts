import { fileRouter } from './file.api'
import { imageRouter } from './image.api'
import { systemRouter } from './system.api'
import { router } from './trpc'

export const api = router({
  file: fileRouter,
  image: imageRouter,
  system: systemRouter
})
