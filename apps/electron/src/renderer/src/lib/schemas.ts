import { z } from 'zod'

export const FixedResizeBlockSchema = z.object({
  mode: z.literal('fixed'),
  type: z.literal('resize'),
  width: z.number().positive().int(),
  height: z.number().positive().int()
})

export const ProportionalWidthResizeBlockSchema = z.object({
  mode: z.literal('proportionalWidth'),
  type: z.literal('resize'),
  height: z.number().positive().int()
})

export const ProportionalHeightResizeBlockSchema = z.object({
  mode: z.literal('proportionalHeight'),
  type: z.literal('resize'),
  width: z.number().positive().int()
})

export const ResizeBlockSchema = z.discriminatedUnion('mode', [
  FixedResizeBlockSchema,
  ProportionalWidthResizeBlockSchema,
  ProportionalHeightResizeBlockSchema
])

export const RenameBlockSchema = z.object({
  type: z.literal('rename'),
  newName: z.string().min(1, {
    message: 'New Name must not be empty'
  })
})

export const CropBlockSchema = z.object({
  type: z.literal('crop'),
  top: z.number().nonnegative().int(),
  left: z.number().nonnegative().int(),
  width: z.number().positive().int(),
  height: z.number().positive().int()
})

export const ConvertBlockSchema = z.object({
  type: z.literal('convert'),
  outputType: z.enum(['png', 'jpeg', 'webp'])
})

export const CompressBlockSchema = z.object({
  type: z.literal('compress'),
  quality: z.number().int().min(1).max(100)
  // maxSize: eventually recursively compress until the image is under this size, optional
})

export const TrimBlockSchema = z.object({
  type: z.literal('trim')
  // threshold: z.number().int().min(0).max(255)
})

export const RemoveMetadataBlockSchema = z.object({
  type: z.literal('removeMetadata')
})

export const BlockSchema = z.union([
  ResizeBlockSchema,
  RenameBlockSchema,
  CropBlockSchema,
  ConvertBlockSchema,
  CompressBlockSchema,
  TrimBlockSchema,
  RemoveMetadataBlockSchema
])

export type Block = z.infer<typeof BlockSchema>
