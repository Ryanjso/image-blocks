import { BaseImage } from '../../types'
import * as path from 'path'
import fs from 'fs'
import sharp from 'sharp'
export const getImagesData = async (images: string[]): Promise<BaseImage[]> => {
  // not sure if this could cause issues if there are a lot of images
  // we should probably add some sort of concurrency limit
  const imagesWithData: BaseImage[] = await Promise.all(
    images.map(async (imagePath) => {
      const image = await getImageData(imagePath)

      return image
    })
  )

  return imagesWithData
}

export const getImageData = async (imagePath: string): Promise<BaseImage> => {
  const { name, ext } = path.parse(imagePath)

  // dont use sharp for file size, its wrong
  const size = fs.statSync(imagePath).size

  const metadata = await sharp(imagePath).metadata()
  const fileType = metadata.format ?? ext.slice(1)

  const image: BaseImage = {
    path: imagePath,
    name: name + ext,
    size,
    fileType,
    nameWithoutExtension: name
  }

  return image
}
