import { Folder } from 'lucide-react'
import { Button } from './ui/Button'

export const OutputDirectory = ({
  outputDirectory,
  onUpdateDirectory,
  isLoading
}: {
  outputDirectory: string | undefined
  onUpdateDirectory: () => void
  isLoading: boolean
}) => {
  const handleButtonClick = async () => {
    onUpdateDirectory()
  }

  return (
    <div className="p-3">
      <div className="bg-slate-100 flex justify-between p-4 rounded-xl space-x-8 items-center">
        <div className="grid gap-1">
          <p className="text-sm text-slate-500 font-medium">Output Directory:</p>
          <p className="text-sm text-slate-800 font-semibold break break-all">{outputDirectory}</p>
        </div>
        <Button variant={'outline'} onClick={handleButtonClick}>
          <Folder />
          Change Directory
        </Button>
      </div>
    </div>
  )
}
