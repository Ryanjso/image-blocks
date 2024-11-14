// import { FlipHorizontal, PenLine, Scaling, Scissors, Shrink } from 'lucide-react'
import { FlipHorizontal, Scaling, Scissors, Shrink } from 'lucide-react'
import { DropdownMenuContent, DropdownMenuItem } from './ui/DropdownMenu'

import { Block } from '@renderer/lib/schemas'

export const NewBlockDropdownMenuContent = ({
  addBlock
}: {
  addBlock: (blockType: Block['type']) => void
}) => {
  return (
    <DropdownMenuContent className="w-56">
      {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
      {/* <DropdownMenuSeparator /> */}
      <DropdownMenuItem onClick={() => addBlock('convert')}>
        <FlipHorizontal className="mr-2 h-4 w-4" />
        <span>Convert image type</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => addBlock('compress')}>
        <Shrink className="mr-2 h-4 w-4" />
        <span>Compress image</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => addBlock('resize')}>
        <Scaling className="mr-2 h-4 w-4" />
        <span>Resize image</span>
      </DropdownMenuItem>
      {/* <DropdownMenuItem onClick={() => addBlock('rename')}>
        <PenLine className="mr-2 h-4 w-4" />
        <span>Rename image</span>
      </DropdownMenuItem> */}
      <DropdownMenuItem onClick={() => addBlock('trim')}>
        <Scissors className="mr-2 h-4 w-4" />
        <span>Trim transparent pixels</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
