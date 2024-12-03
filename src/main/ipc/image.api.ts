import * as fs from 'fs'
import * as path from 'path'
import { ProcessedImage } from '../../types'
import sharp from 'sharp'
import { procedure, router } from './trpc'
import { z } from 'zod'

export const imageRouter = router({
  // getData: procedure.input(z.object({ path: z.string() })).query(async ({ input }) => {
  //   const { path } = input
  //   try {
  //     console.log('Processing images:', path)

  //         const metadata = await sharp(path).metadata()

  //         // dont use sharp size here, its only for specific use cases instead use fs
  //         const stats = fs.statSync(path)
  //         const fileSizeInBytes = stats.size

  //         const processedImage: ProcessedImage = {
  //           path: path,
  //           size: fileSizeInBytes,
  //           name: path.basename(path),
  //           nameWithoutExtension: path.basename(path, path.extname(path)),
  //           fileType: metadata.format || 'unknown file type',
  //           status: 'idle'
  //         }

  //     return processedImages // Send back the processed images' info to the renderer
  //   } catch (error) {
  //     console.error('Error processing images:', error)
  //     throw error
  //   }
  // }),
  convert: procedure
    .input(z.object({ imagePath: z.string(), format: z.string() }))
    .mutation(async ({ input }) => {
      const { imagePath, format } = input

      console.log(`Converting image ${imagePath} to ${format}`)

      try {
        const directory = path.dirname(imagePath)
        const fileName = path.basename(imagePath, path.extname(imagePath))
        const newFileName = `${fileName}.${format}`
        const newPath = path.join(directory, newFileName)

        const output = await sharp(imagePath).toFormat(format).toFile(newPath)

        // dont use sharp size here, its only for specific use cases instead use fs
        const stats = fs.statSync(newPath)
        const fileSizeInBytes = stats.size

        const image: Omit<ProcessedImage, 'status' | 'nameWithoutExtension'> = {
          path: newPath,
          size: fileSizeInBytes,
          name: newFileName,
          fileType: output.format || format
        }

        console.log(`Image converted to ${format} and saved at ${newPath}`)

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

        const image = await sharp(imagePath).metadata()
        const format = image.format

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

        // dont use sharp size here, its only for specific use cases instead use fs
        const stats = fs.statSync(imagePath)
        const fileSizeInBytes = stats.size

        const compressedImage: Omit<ProcessedImage, 'status' | 'nameWithoutExtension'> = {
          path: imagePath,
          size: fileSizeInBytes,
          name: path.basename(imagePath),
          fileType: format
        }

        return compressedImage
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
      const image = await sharp(imagePath).trim().toFile(imagePath) // this currently uses the top left pixel

      // dont use sharp size here, its only for specific use cases instead use fs
      const stats = fs.statSync(imagePath)
      const fileSizeInBytes = stats.size

      const trimmedImage: Omit<ProcessedImage, 'status' | 'nameWithoutExtension'> = {
        path: imagePath,
        size: fileSizeInBytes,
        name: path.basename(imagePath),
        fileType: image.format
      }

      return trimmedImage
    } catch (error) {
      console.error('Error trimming image:', error)
      throw error
    }
  })
})
