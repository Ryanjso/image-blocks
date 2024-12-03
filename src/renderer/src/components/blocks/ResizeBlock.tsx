import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { RemoveBlock } from '../RemoveBlock'

interface ResizeBlockProps {
  index: number
  remove: (index: number) => void
}

export const ResizeBlock = ({ remove, index }: ResizeBlockProps) => {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  return (
    <Card className="bg-background  relative w-96 ">
      <RemoveBlock onClick={() => remove(index)} />
      <CardHeader>
        <CardTitle>Resize Block</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-1.5">
          <Label>Width</Label>
          <Input
            type="number"
            {...register(`blocks.${index}.width`, {
              required: 'Width is required',
              setValueAs: (value) => (value === '' ? undefined : Number(value))
            })}
          />
          {errors?.blocks?.[index]?.width && <span>{errors.blocks[index].width.message}</span>}
        </div>
        <div className="grid gap-1.5">
          <Label>Height</Label>
          <Input
            type="number"
            {...register(`blocks.${index}.height`, {
              required: 'Height is required',
              setValueAs: (value) => (value === '' ? undefined : Number(value))
            })}
          />
          {errors?.blocks?.[index]?.height && <span>{errors.blocks[index].height.message}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
