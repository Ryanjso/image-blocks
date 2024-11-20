import { Controller, useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Label } from '../ui/Label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/Select'

interface ConvertBlockProps {
  index: number
  remove: (index: number) => void
}

export const ConvertBlock = ({ remove, index }: ConvertBlockProps) => {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <Card className="bg-background  relative w-96 ">
      <CardHeader>
        <CardTitle>Convert Image Format</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1.5">
        <Label>Output type</Label>
        <Controller
          name={`blocks.${index}.outputType`}
          control={control}
          render={({ field }) => (
            <div>
              <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an image type"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WEBP</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors?.blocks?.[index]?.outputType && (
                <span>{errors.blocks[index].outputType.message}</span>
              )}
            </div>
          )}
        />
        <div></div>
      </CardContent>
      {/* <button onClick={() => remove(index)}>Remove</button> */}
    </Card>
  )
}
