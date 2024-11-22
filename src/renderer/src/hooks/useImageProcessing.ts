import { ConvertBlockSchema } from '@renderer/lib/schemas'
import { replaceVariables } from '@renderer/lib/utils'
import { z } from 'zod'

export const useImageProcessing = () => {
  const createTempImage = async (imagePath: string) => {
    try {
      const tempFilePath = await window.api.createTempFile(imagePath)
      return tempFilePath
    } catch (error) {
      console.error('Error creating temp image:', error)
      throw error
    }
  }

  const resizeImage = async (imagePath: string, width: number, height: number) => {
    console.log('Resizing image', imagePath, 'to', width, 'x', height)
  }
  const renameImage = async (imagePath: string, newName: string, imageIndex: number) => {
    const variables = {
      name: newName,
      index: (imageIndex + 1).toString()
    }
    const processedName = replaceVariables(newName, variables)
    console.log('Renaming image', imagePath, 'to', processedName)
    return processedName
  }
  const cropImage = async (
    imagePath: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    console.log('Cropping image', imagePath, 'at', x, y, 'with', width, 'x', height)
  }
  const convertImage = async (
    imagePath: string,
    format: z.infer<typeof ConvertBlockSchema>['outputType']
  ) => {
    const output = await window.api.convertImage(imagePath, format)
    console.log('Converted image', imagePath, 'to', output)
  }
  const compressImage = async (imagePath: string, quality: number) => {
    const output = await window.api.compressImage(imagePath, quality)
    console.log('Compressed image', imagePath, 'to', output)
  }
  const trimImage = async (imagePath: string) => {
    console.log('Trimming image', imagePath)
  }

  return {
    createTempImage,
    resizeImage,
    renameImage,
    cropImage,
    convertImage,
    compressImage,
    trimImage
  }
}
