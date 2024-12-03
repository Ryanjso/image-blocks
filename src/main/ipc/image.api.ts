import * as path from 'path'

import sharp from 'sharp'
import { procedure, router } from './trpc'
import { z } from 'zod'
import { getImageData } from '../helpers/system.helpers'

export const imageRouter = router({
  convert: procedure
    .input(z.object({ imagePath: z.string(), format: z.string() }))
    .mutation(async ({ input }) => {
      const { imagePath, format } = input

      try {
        const directory = path.dirname(imagePath)
        const fileName = path.basename(imagePath, path.extname(imagePath))
        const newFileName = `${fileName}.${format}`
        const newPath = path.join(directory, newFileName)

        await sharp(imagePath).toFormat(format).toFile(newPath)

        const image = getImageData(newPath)

        return image
      } catch (error) {
        console.error('Error converting image:', error)
        throw error
      }
    }),
  compress: procedure
    .input(z.object({ imagePath: z.string(), quality: z.number() }))
    .mutation(async ({ input }) => {
      const { imagePath, quality } = input
      try {
        // check image format, should be jpeg, png or webp, if not throw error
        // then call the appropriate sharp function to compress the image by reducing the quality

        const metadata = await sharp(imagePath).metadata()
        const format = metadata.format

        switch (format) {
          case 'jpeg':
          case 'jpg':
            await sharp(imagePath).jpeg({ quality }).toFile(imagePath)
            break
          case 'png':
            await sharp(imagePath).png({ quality }).toFile(imagePath)
            break
          case 'webp':
            await sharp(imagePath).webp({ quality }).toFile(imagePath)
            break
          default:
            throw new Error('Unsupported image format')
        }

        const image = getImageData(imagePath)

        return image
      } catch (error) {
        console.error('Error compressing image:', error)
        throw error
      }
    }),
  trim: procedure.input(z.object({ imagePath: z.string() })).mutation(async ({ input }) => {
    const { imagePath } = input
    try {
      // todo figure out real transparent not top left pixel
      // https://github.com/lovell/sharp/issues/3608#issuecomment-1501203805
      await sharp(imagePath).trim().toFile(imagePath) // this currently uses the top left pixel

      const image = getImageData(imagePath)

      return image
    } catch (error) {
      console.error('Error trimming image:', error)
      throw error
    }
  })
})
