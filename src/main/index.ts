import { app, shell, BrowserWindow, ipcMain, protocol, net } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import sharp from 'sharp'

import * as fs from 'fs'
import * as path from 'path'
import { ImageConversionType, ProcessedImage } from '../types'
function createWindow(): void {
  console.log('CREATING WINDOWS')

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1080,
    minWidth: 840,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 20, y: 20 },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Register a custom protocol to serve local files
  protocol.handle('local-file', async (request) => {
    const filePath = decodeURIComponent(request.url.replace('local-file://', ''))
    return net.fetch(`file://${filePath}`)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  ipcMain.handle('rename-file', async (_event, oldPath: string, newName: string) => {
    try {
      const directory = path.dirname(oldPath)
      const originalExtension = path.extname(oldPath) // Extract the original extension
      const newFileName = newName + originalExtension // Append original extension to the new name
      const newPath = path.join(directory, newFileName)

      fs.renameSync(oldPath, newPath) // Rename the file
      return newPath // Return the new path after renaming
    } catch (err) {
      if (err instanceof Error) return { error: err.message } // Return error if renaming fails
      return { error: 'An unknown error occurred' }
    }
  })

  ipcMain.handle(
    'process-images',
    async (_event, imagePaths: string[]): Promise<ProcessedImage[]> => {
      try {
        console.log('Processing images:', imagePaths)
        const processedImages = await Promise.all(
          imagePaths.map(async (imagePath) => {
            const metadata = await sharp(imagePath).metadata()

            // dont use sharp size here, its only for specific use cases instead use fs
            const stats = fs.statSync(imagePath)
            const fileSizeInBytes = stats.size

            const processedImage: ProcessedImage = {
              path: imagePath,
              size: fileSizeInBytes,
              name: path.basename(imagePath),
              // nameWithoutExtension: path.basename(imagePath, path.extname(imagePath)),
              fileType: metadata.format || 'unknown file type',
              status: 'idle'
            }
            return processedImage
          })
        )
        return processedImages // Send back the processed images' info to the renderer
      } catch (error) {
        console.error('Error processing images:', error)
        throw error
      }
    }
  )

  // convert image type
  ipcMain.handle(
    'convert-image',
    async (_event, imagePath: string, format: ImageConversionType) => {
      try {
        const directory = path.dirname(imagePath)
        const fileName = path.basename(imagePath, path.extname(imagePath))
        const newFileName = `${fileName}.${format}`
        const newPath = path.join(directory, newFileName)

        const output = await sharp(imagePath).toFormat(format).toFile(newPath)

        // dont use sharp size here, its only for specific use cases instead use fs
        const stats = fs.statSync(newPath)
        const fileSizeInBytes = stats.size

        const image: Omit<ProcessedImage, 'status'> = {
          path: newPath,
          size: fileSizeInBytes,
          name: newFileName,
          fileType: output.format || format
        }

        return image
      } catch (error) {
        console.error('Error converting image:', error)
        throw error
      }
    }
  )

  // compress image
  ipcMain.handle('compress-image', async (_event, imagePath: string, quality: number) => {
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

      const compressedImage: Omit<ProcessedImage, 'status'> = {
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
  })

  // Trim transparent pixels
  ipcMain.handle('trim-image', async (_event, imagePath: string) => {
    try {
      // todo figure out real transparent not top left pixel
      // https://github.com/lovell/sharp/issues/3608#issuecomment-1501203805
      const image = await sharp(imagePath).trim().toFile(imagePath) // this currently uses the top left pixel

      // dont use sharp size here, its only for specific use cases instead use fs
      const stats = fs.statSync(imagePath)
      const fileSizeInBytes = stats.size

      const trimmedImage: Omit<ProcessedImage, 'status'> = {
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

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
