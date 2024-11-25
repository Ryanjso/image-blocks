export type ProcessedImageError = { status: 'error'; errorMessage: string }
export type ProcessedImageIdle = { status: 'idle' }
export type ProcessedImageProcessing = { status: 'processing' }
export type ProcessedImageComplete = { status: 'complete'; output: BaseImage }

export type ProcessedImagePayload =
  | ProcessedImageIdle
  | ProcessedImageProcessing
  | ProcessedImageError
  | ProcessedImageComplete

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

export type ImageConversionType = 'jpeg' | 'png' | 'webp'
