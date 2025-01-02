import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/Form'
import { Code, P } from '../ui/Typography'
import { RemoveBlock } from '../RemoveBlock'
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
      <RemoveBlock onClick={() => remove(index)} />
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
          <FormField
            name={`blocks.${index}.newName`}
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="e.g. {name}_{index}_compressed"
                  />
                </FormControl>
                {errors?.blocks?.[index]?.newName && <FormMessage />}
              </FormItem>
            )}
          />
          <FormDescription>
            Don’t include the file extension, it will be added automatically.
          </FormDescription>
        </div>
      </CardContent>
    </Card>
  )
}
