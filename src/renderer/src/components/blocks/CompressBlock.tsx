import { Controller, useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Label } from '../ui/Label'
import { Slider } from '../ui/Slider'
import { Input } from '../ui/Input'

interface CompressBlockProps {
  index: number
  remove: (index: number) => void
}

export const CompressBlock = ({ remove, index }: CompressBlockProps) => {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <Card className="bg-background  relative w-96 ">
      <CardHeader>
        <CardTitle>Compress Image</CardTitle>
        <CardDescription>
          Compress the image by reducing the quality. A lower quality will result in a smaller file.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Label>Quality</Label>
        <Controller
          name={`blocks.${index}.quality`}
          control={control}
          render={({ field }) => (
            <>
              <div className="flex space-x-4 items-center">
                <div className="relative w-full">
                  <Slider
                    min={0}
                    max={100}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="z-10"
                  />
                  <div className="h-8 w-[3px] bg-secondary absolute rounded-lg left-[calc(80%-7.5px)] top-1/2 -translate-y-1/2 z-0" />
                </div>
                <Input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-20"
                />
              </div>
              {errors?.blocks?.[index]?.quality && (
                <span>{errors.blocks[index].quality.message}</span>
              )}
            </>
          )}
        />
      </CardContent>
      {/* <button onClick={() => remove(index)}>Remove</button> */}
    </Card>
  )
}
