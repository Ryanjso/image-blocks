export type ImageError = { status: 'error'; errorMessage: string }
export type ImageIdle = { status: 'idle' }
export type ImageProcessing = { status: 'processing' }
export type ImageSuccess = { status: 'success'; output: BaseImage }
// eventually add a queued status so we don't have to show all as processing even when they arent

export type ImageStatus = ImageError | ImageIdle | ImageProcessing | ImageSuccess

export type ImageWithStatus = BaseImage & ImageStatus

export interface BaseImage {
  path: string
  name: string
  size: number // File size from sharp
  fileType: string // File type from sharp
  nameWithoutExtension: string
}

export type ImageOutputFormat = 'jpeg' | 'png' | 'webp'
