import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ProcessedImage } from '../types'

// Custom APIs for renderer
const api = {
  renameFile: (oldPath: string, newName: string) =>
    ipcRenderer.invoke('rename-file', oldPath, newName),
  processImages: (images: string[]): Promise<ProcessedImage[]> =>
    ipcRenderer.invoke('process-images', images)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
