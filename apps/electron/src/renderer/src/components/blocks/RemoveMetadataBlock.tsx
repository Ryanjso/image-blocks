import { RemoveBlock } from '../RemoveBlock'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/Card'

interface RemoveMetadataBlockProps {
  index: number
  remove: (index: number) => void
}

export const RemoveMetadataBlock = ({ remove, index }: RemoveMetadataBlockProps) => {
  return (
    <Card className="bg-background  relative w-96 ">
      <RemoveBlock onClick={() => remove(index)} />
      <CardHeader>
        <CardTitle>Remove Metadata</CardTitle>
        <CardDescription>
          Remove identifiable information from the image such as camera model, GPS coordinates,
          timestamps, etc.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
