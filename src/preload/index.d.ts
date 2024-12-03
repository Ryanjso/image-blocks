import { ElectronAPI } from '@electron-toolkit/preload'
import { ImageOutputFormat, ImageWithStatus } from '../types'

declare global {
  interface Window {
    electron: ElectronAPI
    // api: {
    //   renameFile: (oldPath: string, newName: string) => Promise<{ error?: string } | string>
    //   processImages: (images: string[]) => Promise<ImageWithStatus[]>
    //   convertImage: (
    //     imagePath: string,
    //     format: ImageOutputFormat
    //   ) => Promise<{ error?: string } | Omit<ImageWithStatus, 'status' | 'nameWithoutExtension'>>
    //   compressImage: (
    //     imagePath: string,
    //     quality: number
    //   ) => Promise<{ error?: string } | Omit<ImageWithStatus, 'status' | 'nameWithoutExtension'>>
    //   createTempFile: (imagePath: string) => Promise<string>
    //   saveTempFile: (
    //     tempFilePath: string,
    //     saveFilePath: string
    //   ) => Promise<{ error?: string } | { success: boolean }>
    //   getDefaultDirectory: () => Promise<string>
    //   selectFolder: () => Promise<string | null>
    // }
  }
}
