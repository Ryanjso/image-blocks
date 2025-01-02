import { ReactQueryOptions, trpc } from '@renderer/lib/trpc'

export const useRenameFile = (options?: ReactQueryOptions['file']['rename']) => {
  return trpc.file.rename.useMutation(options)
}

export const useCreateTempFile = (options?: ReactQueryOptions['file']['createTemp']) => {
  return trpc.file.createTemp.useMutation(options)
}

export const useSaveFile = (options?: ReactQueryOptions['file']['save']) => {
  return trpc.file.save.useMutation(options)
}
