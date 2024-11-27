import { ArrowRight, X } from 'lucide-react'
import { ProcessedImage } from 'src/types'

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
      <div className="w-7 h-7 border-white border-2 rounded-sm bg-indigo-100 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
        <ArrowRight className="text-primary" size={18} strokeWidth="2" />
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-lg w-full p-2 flex gap-3 items-center">
        <div className="rounded-md h-14 w-14 overflow-hidden">
          <img
            src={'local-file://' + encodeURIComponent(path)}
            alt="image"
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        <div>
          <div className="text-slate-800 font-medium">{nameWithoutExtension}</div>
          <div className="text-slate-500 text-sm flex gap-1.5 items-center">
            <span>
              <ImageSize sizeInBytes={image.size} />
            </span>
            <div className="border-l h-2.5 border-slate-200" />
            <span>{fileType}</span>
          </div>
        </div>
      </div>
      <div className="bg-white border-2 border-slate-200 rounded-lg w-full flex justify-between items-center p-2 relative">
        <button
          onClick={() => remove(path)}
          className="rounded-sm border-2 border-slate-200 absolute bg-white -top-2 -right-2"
        >
          <X className="text-slate-500" size={14} />
        </button>
        <span className=" text-sm text-slate-500 px-4">Press run to begin processing</span>
      </div>
    </div>
  )
}
