import { Controller, useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Label } from '../ui/Label'
import { Input } from '../ui/Input'
import { FormDescription } from '../ui/Form'
import { Code, P } from '../ui/Typography'
interface RenameBlockProps {
  index: number
  remove: (index: number) => void
}

export const RenameBlock = ({ remove, index }: RenameBlockProps) => {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  return (
    <Card className="bg-background  relative w-96 ">
      <CardHeader>
        <CardTitle>Rename File</CardTitle>
        <CardDescription>
          Rename the file using a custom pattern. You can use variables to include the original file
          name and index.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <P className="text-sm">You can use the following variables:</P>
          <table className="table-auto border text-sm">
            <thead className="text-left">
              <tr>
                <th className="px-4 py-2">Variable</th>
                <th className="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">
                  <Code>{'{name}'}</Code>
                </td>
                <td className="border px-4 py-2">Original file name</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">
                  <Code>{'{index}'}</Code>
                </td>
                <td className="border px-4 py-2">
                  Index of the image in the list, starting from 1
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid gap-1.5">
          <Label>New Name</Label>
          <Controller
            name={`blocks.${index}.newName`}
            control={control}
            render={({ field }) => (
              <>
                <Input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full"
                  placeholder="e.g. {name}_{index}_compressed"
                />
                {errors?.blocks?.[index]?.newName && (
                  <span>{errors.blocks[index].newName.message}</span>
                )}
              </>
            )}
          />
          <FormDescription>
            Don’t include the file extension, it will be added automatically.
          </FormDescription>
        </div>
      </CardContent>
      {/* <button onClick={() => remove(index)}>Remove</button> */}
    </Card>
  )
}
