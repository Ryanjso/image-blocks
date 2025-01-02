import { ArrowRight, Loader2, Play, SquareArrowOutUpRight, X } from 'lucide-react'

import { Button } from './ui/Button'
import { useOpenFileManagerToPath } from '@renderer/hooks/system.hooks'
import { ImageWithStatus } from '@shared/types'

const formatSize = (size: number) => {
  if (size < 1024) {
    // Bytes case (though not requested, you can extend this if needed)
    return `${size} Bytes`
  } else if (size < 1024 * 1024) {
    // Kilobytes
    const sizeInKB = Math.floor(size / 1024)
    return `${sizeInKB} KB`
  } else if (size < 1024 * 1024 * 1024) {
    // Megabytes
    const sizeInMB = (size / (1024 * 1024)).toFixed(2)
    return `${sizeInMB} MB`
  } else {
    // Gigabytes
    const sizeInGB = (size / (1024 * 1024 * 1024)).toFixed(2)
    return `${sizeInGB} GB`
  }
}

const ImageSize = ({ sizeInBytes }: { sizeInBytes: number }) => {
  return <span className="">{formatSize(sizeInBytes)}</span>
}

const FileSizeReductionBadge = ({
  originalSize,
  newSize
}: {
  originalSize: number
  newSize: number
}) => {
  if (originalSize === 0) return null // should not happen but just in case
  if (newSize > originalSize) return null

  const percentReduction = Math.floor(((originalSize - newSize) / originalSize) * 100)
  const difference = originalSize - newSize
  const formattedDifference = formatSize(difference)

  return (
    <div className="bg-indigo-100 rounded py-0.5 px-1 text-primary  text-xs shrink-0">
      <span>-{percentReduction}%</span> <span>({formattedDifference})</span>
    </div>
  )
}

const ImageInfo = ({
  name,
  path,
  fileType,
  size
}: {
  name: string
  path: string
  fileType: string
  size: number
}) => {
  return (
    <div className="flex items-center overflow-hidden gap-2">
      <div className="rounded-md h-14 w-14 overflow-hidden shrink-0">
        <img
          src={'local-file://' + encodeURIComponent(path)}
          alt="image"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <span className="text-slate-800 font-medium text-sm truncate">{name}</span>
        <div className="text-slate-500 text-sm flex gap-1.5 items-center">
          <span>
            <ImageSize sizeInBytes={size} />
          </span>
          <div className="border-l h-2.5 border-slate-200" />
          <span>{fileType}</span>
        </div>
      </div>
    </div>
  )
}

export const FileBlock = ({
  image,
  remove,
  onRunClick
}: {
  image: ImageWithStatus
  remove: (imagePath: string) => void
  onRunClick: () => void
}) => {
  const { mutate: openImageInFileManager } = useOpenFileManagerToPath()

  const onOpenInFileManager = (path: string) => {
    openImageInFileManager({ filePath: path })
  }

  const { path, nameWithoutExtension, fileType } = image
  return (
    // <div className="relative">
    <div key={image.path} className="flex gap-2 justify-between w-full relative">
      <div className="w-6 h-6 border-white border-2 rounded-sm bg-indigo-100 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
        <ArrowRight className="text-primary" size={18} strokeWidth="2" />
      </div>
      <button
        onClick={() => remove(path)}
        className="rounded-sm border-2 border-slate-200 absolute bg-white -top-2 -right-2 p-0.5 z-10"
      >
        <X className="text-slate-500" size={14} />
      </button>
      <div className="bg-white border-2 border-slate-200 rounded-lg  p-1 flex gap-3 items-center flex-1 overflow-hidden">
        <ImageInfo name={nameWithoutExtension} path={path} fileType={fileType} size={image.size} />
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-lg p-1 relative flex-1 flex overflow-hidden">
        {image.status === 'processing' ? (
          <div className="pl-4 pr-2 flex justify-between items-center h-full flex-1">
            <span className=" text-sm text-slate-500">Processing</span>
            <Button size={'icon'} variant={'ghost'} disabled>
              <Loader2 className="text-primary animate-spin" size={16} strokeWidth="2" />
            </Button>
          </div>
        ) : image.status === 'success' ? (
          <div className="pl-2 pr-2 gap-2 flex flex-1 justify-between items-center h-full overflow-hidden">
            <ImageInfo
              name={image.output.nameWithoutExtension}
              path={image.output.path}
              fileType={image.output.fileType}
              size={image.output.size}
            />
            <div className="flex items-center gap-4 justify-end shrink-0">
              {image.output.size < image.size && (
                <FileSizeReductionBadge originalSize={image.size} newSize={image.output.size} />
              )}
              <Button
                size={'icon'}
                variant={'ghost'}
                onClick={() => onOpenInFileManager(image.output.path)}
              >
                <SquareArrowOutUpRight className="text-primary" size={18} strokeWidth="2" />
              </Button>
            </div>
          </div>
        ) : image.status === 'error' ? (
          <div className="px-4 flex justify-between flex-1 items-center">
            <span className="text-sm text-destructive">{image.errorMessage}</span>
          </div>
        ) : (
          // Idle state
          <div className="pl-4 pr-2 flex justify-between items-center h-full flex-1">
            <span className=" text-sm text-slate-500">Press run to begin processing</span>
            <Button size={'icon'} variant={'ghost'} onClick={() => onRunClick()}>
              <Play className="text-primary" size={16} strokeWidth="2" />
            </Button>
          </div>
        )}
      </div>
    </div>
    // </div>
  )
}
