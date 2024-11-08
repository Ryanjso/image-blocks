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

export const FileBlock = ({ image }: { image: ProcessedImage }) => {
  console.log('image', image)

  const { path, name: filename } = image
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="w-9 h-9 relative rounded-sm overflow-hidden">
          <img
            src={'local-file://' + encodeURIComponent(path)}
            alt="image"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-secondary-foreground font-medium">{filename}</span>
          <div className="text-sm text-muted-foreground flex">
            <ImageSize sizeInBytes={image.size} />
            <div className="border-r h-3 inline mx-1 mt-1" />
            <span className="lowercase">{image.fileType}</span>
          </div>
        </div>
      </div>
      <div>{image.status}</div>
    </div>
  )
}
