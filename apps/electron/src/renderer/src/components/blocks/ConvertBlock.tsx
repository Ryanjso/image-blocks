import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/Select'
import { RemoveBlock } from '../RemoveBlock'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/Form'

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
      <RemoveBlock onClick={() => remove(index)} />
      <CardHeader>
        <CardTitle>Convert Image Format</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1.5">
        <FormField
          name={`blocks.${index}.outputType`}
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Output type</FormLabel>
              <FormControl>
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
              </FormControl>
              {errors?.blocks?.[index]?.outputType && <FormMessage />}
            </FormItem>
          )}
        />
        <div></div>
      </CardContent>
    </Card>
  )
}
