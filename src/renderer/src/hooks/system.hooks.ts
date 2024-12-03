import { ReactQueryOptions, trpc } from '@renderer/lib/trpc'

export const useGetDefaultDirectory = () => {
  return trpc.system.getDefaultDirectory.useQuery()
}

export const useSelectDirectory = () => {
  const utils = trpc.useUtils()
  return trpc.system.selectDirectory.useMutation({
    onSuccess(data) {
      console.log('data', data)
      if (data) {
        utils.system.getDefaultDirectory.setData(undefined, () => data)
      }
    }
  })
}

export const useSelectImages = (options?: ReactQueryOptions['system']['selectImages']) => {
  return trpc.system.selectImages.useMutation(options)
}

export const useAddImages = () => {
  return trpc.system.addImages.useMutation()
}
