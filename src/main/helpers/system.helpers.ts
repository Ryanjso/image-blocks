import { BaseImage, ProcessedImageIdle } from '../../types'
import * as path from 'path'
import fs from 'fs'
import sharp from 'sharp'
export const processImages = async (
  images: string[]
): Promise<(BaseImage & ProcessedImageIdle)[]> => {
  const processedImages: (BaseImage & ProcessedImageIdle)[] = await Promise.all(
    images.map(async (imagePath) => {
      const { name, ext } = path.parse(imagePath)
      const size = fs.statSync(imagePath).size

      const metadata = await sharp(imagePath).metadata()

      const fileType = metadata.format ?? ext.slice(1)

      const image: BaseImage & ProcessedImageIdle = {
        path: imagePath,
        name: name + ext,
        size,
        fileType,
        nameWithoutExtension: name,
        status: 'idle'
      }

      return image
    })
  )

  return processedImages
}
