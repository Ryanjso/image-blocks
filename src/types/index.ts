export interface ProcessedImage {
  path: string
  name: string
  size: number // File size from sharp
  fileType: string // File type from sharp
  status: 'idle' | 'processing' | 'complete' | 'error'
  // eventually have an error message if status is 'error'
}
