import { ElectronAPI } from '@electron-toolkit/preload'
import { ProcessedImage } from '../types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      renameFile: (oldPath: string, newName: string) => Promise<{ error?: string } | string>
      processImages: (images: string[]) => Promise<ProcessedImage[]>
    }
  }
}
