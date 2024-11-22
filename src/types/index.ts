export type ProcessedImage =
  | (BaseImage & { status: 'idle' | 'processing' })
  | (BaseImage & { status: 'error'; errorMessage: string })
  | (BaseImage & { status: 'complete'; output: BaseImage })

export interface BaseImage {
  path: string
  name: string
  size: number // File size from sharp
  fileType: string // File type from sharp
  nameWithoutExtension: string
}

export type ImageConversionType = 'jpeg' | 'png' | 'webp'
