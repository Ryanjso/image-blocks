export interface ProcessedImage {
  path: string
  name: string
  size: number // File size from sharp
  fileType: string // File type from sharp
  status: 'idle' | 'processing' | 'complete' | 'error'
  nameWithoutExtension: string
  // eventually have an error message if status is 'error'
}

export type ImageConversionType = 'jpeg' | 'png' | 'webp'
