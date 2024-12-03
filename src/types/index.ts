export type ProcessedImageError = { status: 'error'; errorMessage: string }
export type ProcessedImageIdle = { status: 'idle' }
export type ProcessedImageProcessing = { status: 'processing' }
export type ProcessedImageComplete = { status: 'success'; output: BaseImage }
// eventually add a queued status so we don't have to show all as processing even when they arent

export type ProcessedImage =
  | (BaseImage & ProcessedImageIdle)
  | (BaseImage & ProcessedImageProcessing)
  | (BaseImage & ProcessedImageError)
  | (BaseImage & ProcessedImageComplete)

export interface BaseImage {
  path: string
  name: string
  size: number // File size from sharp
  fileType: string // File type from sharp
  nameWithoutExtension: string
}

export type ProcessedImagePayload =
  | ProcessedImageIdle
  | ProcessedImageProcessing
  | ProcessedImageError
  | ProcessedImageComplete

export type ImageConversionType = 'jpeg' | 'png' | 'webp'
