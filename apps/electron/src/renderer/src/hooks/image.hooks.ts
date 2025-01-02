import { ReactQueryOptions, trpc } from '@renderer/lib/trpc'

export const useConvertImage = (options?: ReactQueryOptions['image']['convert']) => {
  return trpc.image.convert.useMutation(options)
}

export const useCompressImage = (options?: ReactQueryOptions['image']['compress']) => {
  return trpc.image.compress.useMutation(options)
}

export const useTrimImage = (options?: ReactQueryOptions['image']['trim']) => {
  return trpc.image.trim.useMutation(options)
}

export const useResizeImage = (options?: ReactQueryOptions['image']['resize']) => {
  return trpc.image.resize.useMutation(options)
}

export const useClearMetadata = (options?: ReactQueryOptions['image']['clearMetadata']) => {
  return trpc.image.clearMetadata.useMutation(options)
}
