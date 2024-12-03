import { ConvertBlockSchema } from '@renderer/lib/schemas'
import { replaceVariables } from '@renderer/lib/utils'
import { z } from 'zod'
import { useCreateTempFile } from './file.hooks'
import { useCompressImage, useConvertImage, useTrimImage } from './image.hooks'

export const useImageProcessing = () => {
  const { mutateAsync: createTempFile } = useCreateTempFile()
  const { mutateAsync: _convertImage } = useConvertImage()
  const { mutateAsync: _compressImage } = useCompressImage()
  const { mutateAsync: _trimImage } = useTrimImage()

  const createTempImage = async (imagePath: string) => {
    try {
      const tempFilePath = await createTempFile({ imagePath })
      return tempFilePath
    } catch (error) {
      console.error('Error creating temp image:', error)
      throw error
    }
  }

  const resizeImage = async (imagePath: string, width: number, height: number) => {
    console.log('Resizing image', imagePath, 'to', width, 'x', height)
  }
  const renameImage = async (originalName: string, newName: string, imageIndex: number) => {
    const variables = {
      name: originalName,
      index: (imageIndex + 1).toString()
    }
    const processedName = replaceVariables(newName, variables)
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
    return await _convertImage({ imagePath, format })
  }
  const compressImage = async (imagePath: string, quality: number) => {
    await _compressImage({ imagePath, quality })
  }
  const trimImage = async (imagePath: string) => {
    await _trimImage({ imagePath })
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
