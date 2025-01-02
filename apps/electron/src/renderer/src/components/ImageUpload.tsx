import { useState } from 'react'
import { Button } from './ui/Button'
import { cn } from '@renderer/lib/utils'

export const ImageUpload = ({
  onHandleSelectImages,
  onFilesDrop
}: {
  onHandleSelectImages: () => void
  onFilesDrop: (filePaths: string[]) => void
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const filePaths = files.map((file) => file.path)

    onFilesDrop(filePaths)
  }

  return (
    <div
      className={cn(
        `w-full h-full  border-dashed py-7 border-[3px] rounded-2xl flex flex-col justify-center space-y-4`,
        isDragging ? 'border-primary bg-indigo-200' : 'border-indigo-400 bg-indigo-100'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragDrop}
    >
      <span
        className={cn(
          `font-medium text-center text-sm`,
          isDragging ? 'text-primary' : 'text-indigo-400'
        )}
      >
        Drag your files here
      </span>

      <div className="flex justify-center">
        <Button onClick={onHandleSelectImages}>Browse Files</Button>
      </div>
    </div>
  )
}
