import { useFlow, BlockConfig } from '@renderer/context/FlowContext'
import { Controller, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface ResizeBlockProps {
  index: number
  remove: (index: number) => void
}

export const ResizeBlock = ({ remove, index }: ResizeBlockProps) => {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  // const { updateBlockConfig } = useFlow()

  // Initialize React Hook Form with Zod validation
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm<ResizeSchema>({
  //   resolver: zodResolver(resizeSchema),
  //   defaultValues: config.settings
  // })

  // const onSubmit = (data: ResizeSchema) => {
  //   updateBlockConfig(index, data) // Update the widget config in FlowContext
  // }

  return (
    <div className="bg-background rounded-3xl border-2 border-slate-200 p-3 relative  min-w-96 ">
      <div>
        <h3>Resize Block</h3>
        <Controller
          name={`blocks.${index}.width`}
          control={control}
          render={({ field }) => (
            <div>
              <label>Width:</label>
              <input type="number" {...field} />
              {errors?.blocks?.[index]?.width && <span>{errors.blocks[index].width.message}</span>}
            </div>
          )}
        />
        <Controller
          name={`blocks.${index}.height`}
          control={control}
          render={({ field }) => (
            <div>
              <label>Height:</label>
              <input type="number" {...field} />
              {errors?.blocks?.[index]?.height && (
                <span>{errors.blocks[index].height.message}</span>
              )}
            </div>
          )}
        />
        <button onClick={() => remove(index)}>Remove</button>
      </div>
    </div>
  )
}
