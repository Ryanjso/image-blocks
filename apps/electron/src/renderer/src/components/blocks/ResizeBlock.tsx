import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { RemoveBlock } from '../RemoveBlock'
import {
  FixedResizeBlockSchema,
  ProportionalHeightResizeBlockSchema,
  ProportionalWidthResizeBlockSchema,
  ResizeBlockSchema
} from '@renderer/lib/schemas'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Link, Unlink } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/Form'

interface ResizeBlockProps {
  index: number
  remove: (index: number) => void
}

const ResizeBlockSchemaArr = z.object({
  blocks: z.array(ResizeBlockSchema)
})
type ResizeBlockFormValues = z.infer<typeof ResizeBlockSchemaArr>

const FixedResizeArraySchema = z.object({
  blocks: z.array(FixedResizeBlockSchema)
})

const ResizeFixed = ({ index }: { index: number }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext<z.infer<typeof FixedResizeArraySchema>>()

  return (
    <>
      <div className="grid gap-1.5">
        <div className="flex gap-2 items-end">
          <FormField
            name={`blocks.${index}.width`}
            control={control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                {errors?.blocks?.[index]?.width && <FormMessage />}
              </FormItem>
            )}
          />
          {/* button to change mode to 'proportionalHeight' */}
          <FormField
            name={`blocks.${index}.mode`}
            control={control}
            render={({ field }) => (
              <Button
                onClick={() => field.onChange('proportionalHeight')}
                size={'icon'}
                className="shrink-0"
                variant={'secondary'}
              >
                <Link />
              </Button>
            )}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <div className="flex gap-2 items-end">
          <FormField
            name={`blocks.${index}.height`}
            control={control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                {errors?.blocks?.[index]?.height && <FormMessage />}
              </FormItem>
            )}
          />
          {/* button to change mode to 'proportionalWidth' */}
          <FormField
            name={`blocks.${index}.mode`}
            control={control}
            render={({ field }) => (
              <Button
                onClick={() => field.onChange('proportionalWidth')}
                size={'icon'}
                className="shrink-0"
                variant={'secondary'}
              >
                <Link />
              </Button>
            )}
          />
        </div>
      </div>
    </>
  )
}

const ProportionalWidthResizeArraySchema = z.object({
  blocks: z.array(ProportionalWidthResizeBlockSchema)
})

const ResizeProportionalWidth = ({ index }: { index: number }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext<z.infer<typeof ProportionalWidthResizeArraySchema>>()

  return (
    <>
      <FormItem>
        <Label>Width</Label>
        <Input type="number" disabled placeholder="Automatic proportional" />
      </FormItem>
      <div className="grid gap-1.5">
        <div className="flex gap-2 items-end">
          <FormField
            name={`blocks.${index}.height`}
            control={control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                {errors?.blocks?.[index]?.height && <FormMessage />}
              </FormItem>
            )}
          />
          {/* button to change mode to 'proportionalHeight' */}
          <FormField
            name={`blocks.${index}.mode`}
            control={control}
            render={({ field }) => (
              <Button onClick={() => field.onChange('fixed')} size={'icon'} className="shrink-0">
                <Unlink />
              </Button>
            )}
          />
        </div>
      </div>
    </>
  )
}

const ProportionalHeightResizeArraySchema = z.object({
  blocks: z.array(ProportionalHeightResizeBlockSchema)
})

const ResizeProportionalHeight = ({ index }: { index: number }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext<z.infer<typeof ProportionalHeightResizeArraySchema>>()

  return (
    <>
      <div className="grid gap-1.5">
        <div className="flex gap-2 items-end">
          <FormField
            name={`blocks.${index}.width`}
            control={control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                {errors?.blocks?.[index]?.width && <FormMessage />}
              </FormItem>
            )}
          />
          {/* button to change mode to 'fixed' */}
          <FormField
            name={`blocks.${index}.mode`}
            control={control}
            render={({ field }) => (
              <Button onClick={() => field.onChange('fixed')} size={'icon'} className="shrink-0">
                <Unlink />
              </Button>
            )}
          />
        </div>
      </div>
      <FormItem>
        <Label>Height</Label>
        <Input type="number" disabled placeholder="Automatic proportional" />
      </FormItem>
    </>
  )
}

export const ResizeBlock = ({ remove, index }: ResizeBlockProps) => {
  const { watch } = useFormContext<ResizeBlockFormValues>()
  const mode = watch(`blocks.${index}.mode`)

  return (
    <Card className="bg-background  relative w-96 ">
      <RemoveBlock onClick={() => remove(index)} />
      <CardHeader>
        <CardTitle>Resize Image</CardTitle>
        <CardDescription>
          Resize the image to a specific width and height. You can also choose to resize it
          proportionally.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* theyre 3 seperate components for typescript purposes
          otherwise there was no safe way to access the correct schema
          specally in errors
        */}

        {mode === 'fixed' && <ResizeFixed index={index} />}
        {mode === 'proportionalWidth' && <ResizeProportionalWidth index={index} />}
        {mode === 'proportionalHeight' && <ResizeProportionalHeight index={index} />}
      </CardContent>
    </Card>
  )
}
