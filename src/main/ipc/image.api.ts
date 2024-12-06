import * as path from 'path'
import sharp from 'sharp'
import { procedure, router } from './trpc'
import { z } from 'zod'
import { getImageData } from '../helpers/system.helpers'
import { TRPCError } from '@trpc/server'
import fs from 'fs'

export const imageRouter = router({
  convert: procedure
    .input(z.object({ imagePath: z.string(), format: z.enum(['jpeg', 'png', 'webp', 'jpg']) }))
    .mutation(async ({ input }) => {
      const { imagePath, format } = input

      // if format is the same as the original image, return the original image
      const metadata = await sharp(imagePath).metadata()
      if (metadata.format === format) {
        const image = getImageData(imagePath)
        return image
      }

      try {
        const directory = path.dirname(imagePath)
        const fileName = path.basename(imagePath, path.extname(imagePath))
        const newFileName = `${fileName}.${format}`
        const newPath = path.join(directory, newFileName)

        const buffer = await sharp(imagePath).toFormat(format).toBuffer()
        await sharp(buffer).toFile(newPath)

        // delete the original (temporary) image path, assuming we have a new image path
        if (imagePath !== newPath) fs.unlinkSync(imagePath)

        const image = getImageData(newPath)

        return image
      } catch (error) {
        console.error('Error converting image:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error converting image'
        })
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

        let buffer: Buffer | undefined = undefined
        switch (format) {
          case 'jpeg':
          case 'jpg':
            buffer = await sharp(imagePath).jpeg({ quality }).toBuffer()
            break
          case 'png':
            buffer = await sharp(imagePath).png({ quality }).toBuffer()
            break
          case 'webp':
            buffer = await sharp(imagePath).webp({ quality }).toBuffer()
            break
          default:
            throw new Error('Unsupported image format')
        }

        if (buffer) {
          await sharp(buffer).toFile(imagePath)
        } else {
          throw new Error('Error compressing image')
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
  }),
  // valid options are width and height numbers, width number and height 'auto' or width 'auto' and height number
  resize: procedure
    .input(
      z
        .object({
          imagePath: z.string(),
          width: z.number().positive().optional(),
          height: z.number().positive().optional()
        })
        .refine((data) => data.width !== undefined || data.height !== undefined, {
          message: 'You must provide at least one dimension: width or height.'
        })
    )
    .mutation(async ({ input }) => {
      const { imagePath, width, height } = input
      try {
        const buffer = await sharp(imagePath).resize({ width, height, fit: 'inside' }).toBuffer()

        // save the resized image to the same path
        await sharp(buffer).toFile(imagePath)

        const image = getImageData(imagePath)
        return image
      } catch (error) {
        console.error('Error resizing image:', error)
        throw error
      }
    }),
  clearMetadata: procedure
    .input(z.object({ imagePath: z.string() }))
    .mutation(async ({ input }) => {
      const { imagePath } = input
      try {
        // remove all identifiable metadata from the image
        // then resave it to the same path
        const buffer = await sharp(imagePath).toBuffer()
        await sharp(buffer).toFile(imagePath)

        const image = getImageData(imagePath)
        return image
      } catch (error) {
        console.error('Error clearing metadata:', error)
        throw error
      }
    })
})
