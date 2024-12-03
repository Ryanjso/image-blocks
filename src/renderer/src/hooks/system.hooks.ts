import { ReactQueryOptions, trpc } from '@renderer/lib/trpc'

export const useGetDefaultDirectory = () => {
  return trpc.system.getDefaultDirectory.useQuery()
}

export const useSelectDirectory = (options?: ReactQueryOptions['system']['selectDirectory']) => {
  return trpc.system.selectDirectory.useMutation(options)
}

export const useSelectImages = (options?: ReactQueryOptions['system']['selectImages']) => {
  return trpc.system.selectImages.useMutation(options)
}

export const useAddImages = (options?: ReactQueryOptions['system']['addImages']) => {
  return trpc.system.addImages.useMutation(options)
}

export const useOpenFileManagerToPath = (
  options?: ReactQueryOptions['system']['openFileManagerToPath']
) => {
  return trpc.system.openFileManagerToPath.useMutation(options)
}
