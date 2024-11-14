import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'

interface ResizeBlockProps {
  index: number
  remove: (index: number) => void
}

export const TrimBlock = ({ remove, index }: ResizeBlockProps) => {
  return (
    <Card className="bg-background  relative w-96 ">
      <CardHeader>
        <CardTitle>Trim Block</CardTitle>
        <CardDescription>Trim transparent pixels from the image</CardDescription>
      </CardHeader>
      {/* <button onClick={() => remove(index)}>Remove</button> */}
    </Card>
  )
}
