import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      renameFile: (oldPath: string, newName: string) => Promise<{ error?: string } | string>
    }
  }
}
