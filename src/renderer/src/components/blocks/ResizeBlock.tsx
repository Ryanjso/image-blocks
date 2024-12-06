import { Controller, useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
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
        <Label>Width</Label>
        <div className="flex gap-2">
          <Controller
            name={`blocks.${index}.width`}
            control={control}
            render={({ field }) => (
              <>
                <Input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {errors?.blocks?.[index]?.width && (
                  <span>{errors.blocks[index].width.message}</span>
                )}
              </>
            )}
          />
          {/* button to change mode to 'proportionalHeight' */}
          <Controller
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
        <Label>Height</Label>
        <div className="flex gap-2">
          <Controller
            name={`blocks.${index}.height`}
            control={control}
            render={({ field }) => (
              <>
                <Input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {errors?.blocks?.[index]?.height && (
                  <span>{errors.blocks[index].height.message}</span>
                )}
              </>
            )}
          />
          {/* button to change mode to 'proportionalWidth' */}
          <Controller
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
      <div className="grid gap-1.5">
        <Label>Width</Label>
        <Input type="number" disabled placeholder="Automatic proportional" />
      </div>
      <div className="grid gap-1.5">
        <Label>Height</Label>
        <div className="flex gap-2">
          <Controller
            name={`blocks.${index}.height`}
            control={control}
            render={({ field }) => (
              <>
                <Input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {errors?.blocks?.[index]?.height && (
                  <span>{errors.blocks[index].height.message}</span>
                )}
              </>
            )}
          />
          {/* button to change mode to 'proportionalHeight' */}
          <Controller
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
        <Label>Width</Label>
        <div className="flex gap-2">
          <Controller
            name={`blocks.${index}.width`}
            control={control}
            render={({ field }) => (
              <>
                <Input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {errors?.blocks?.[index]?.width && (
                  <span>{errors.blocks[index].width.message}</span>
                )}
              </>
            )}
          />
          {/* button to change mode to 'fixed' */}
          <Controller
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
      <div className="grid gap-1.5">
        <Label>Height</Label>
        <Input type="number" disabled placeholder="Automatic proportional" />
      </div>
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
        <CardTitle>Resize Block</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {mode === 'fixed' && <ResizeFixed index={index} />}
        {mode === 'proportionalWidth' && <ResizeProportionalWidth index={index} />}
        {mode === 'proportionalHeight' && <ResizeProportionalHeight index={index} />}
      </CardContent>
    </Card>
  )
}
