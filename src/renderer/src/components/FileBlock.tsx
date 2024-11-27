import { ArrowRight, Loader2, Play, SquareArrowOutUpRight, X } from 'lucide-react'
import { ProcessedImage } from 'src/types'
import { Button } from './ui/Button'

const ImageSize = ({ sizeInBytes }: { sizeInBytes: number }) => {
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

  return <span className="">{formatSize(sizeInBytes)}</span>
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
    <>
      <div className="rounded-md h-14 w-14 overflow-hidden">
        <img
          src={'local-file://' + encodeURIComponent(path)}
          alt="image"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div>
        <div className="text-slate-800 font-medium">{name}</div>
        <div className="text-slate-500 text-sm flex gap-1.5 items-center">
          <span>
            <ImageSize sizeInBytes={size} />
          </span>
          <div className="border-l h-2.5 border-slate-200" />
          <span>{fileType}</span>
        </div>
      </div>
    </>
  )
}

export const FileBlock = ({
  image,
  remove
}: {
  image: ProcessedImage
  remove: (imagePath: string) => void
}) => {
  const { path, nameWithoutExtension, fileType } = image
  return (
    <div key={image.path} className="flex gap-2 justify-between w-full relative">
      <div className="w-6 h-6 border-white border-2 rounded-sm bg-indigo-100 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
        <ArrowRight className="text-primary" size={18} strokeWidth="2" />
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-lg w-full p-1 flex gap-3 items-center">
        <ImageInfo name={nameWithoutExtension} path={path} fileType={fileType} size={image.size} />
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-lg w-full  p-1 relative">
        <button
          onClick={() => remove(path)}
          className="rounded-sm border-2 border-slate-200 absolute bg-white -top-2 -right-2 p-0.5"
        >
          <X className="text-slate-500" size={14} />
        </button>

        {image.status === 'processing' ? (
          <div className="pl-4 pr-2 flex justify-between items-center h-full">
            <span className=" text-sm text-slate-500">Processing</span>
            <Button size={'icon'} variant={'ghost'} disabled>
              <Loader2 className="text-primary animate-spin" size={16} strokeWidth="2" />
            </Button>
          </div>
        ) : image.status === 'success' ? (
          <div className="pl-4 pr-2 flex justify-between items-center h-full">
            <ImageInfo
              name={image.output.nameWithoutExtension}
              path={image.output.path}
              fileType={image.output.fileType}
              size={image.output.size}
            />
            <SquareArrowOutUpRight className="text-primary" size={18} strokeWidth="2" />
          </div>
        ) : image.status === 'error' ? (
          <div className="px-4 flex justify-between">
            <span className=" text-sm text-destructive">
              There was an error processing this image
            </span>
          </div>
        ) : (
          // Idle state
          <div className="pl-4 pr-2 flex justify-between items-center h-full">
            <span className=" text-sm text-slate-500">Press run to begin processing</span>
            <Button size={'icon'} variant={'ghost'}>
              <Play className="text-primary" size={16} strokeWidth="2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
