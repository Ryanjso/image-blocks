import { ElectronAPI } from '@electron-toolkit/preload'
import { ImageConversionType, ProcessedImage } from '../types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      renameFile: (oldPath: string, newName: string) => Promise<{ error?: string } | string>
      processImages: (images: string[]) => Promise<ProcessedImage[]>
      convertImage: (
        imagePath: string,
        format: ImageConversionType
      ) => Promise<{ error?: string } | Omit<ProcessedImage, 'status' | 'nameWithoutExtension'>>
      compressImage: (
        imagePath: string,
        quality: number
      ) => Promise<{ error?: string } | Omit<ProcessedImage, 'status' | 'nameWithoutExtension'>>
      createTempFile: (imagePath: string) => Promise<string>
      saveTempFile: (
        tempFilePath: string,
        saveFilePath: string
      ) => Promise<{ error?: string } | { success: boolean }>
      getDefaultDirectory: () => Promise<string>
      selectFolder: () => Promise<string | null>
    }
  }
}
