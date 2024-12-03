import { RemoveBlock } from '../RemoveBlock'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/Card'

interface ResizeBlockProps {
  index: number
  remove: (index: number) => void
}

export const TrimBlock = ({ remove, index }: ResizeBlockProps) => {
  return (
    <Card className="bg-background  relative w-96 ">
      <RemoveBlock onClick={() => remove(index)} />
      <CardHeader>
        <CardTitle>Trim Block</CardTitle>
        <CardDescription>Trim transparent pixels from the image</CardDescription>
      </CardHeader>
    </Card>
  )
}
