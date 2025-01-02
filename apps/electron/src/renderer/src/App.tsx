import { ChevronDown, Play, PlusCircle } from 'lucide-react'
// import { Curve } from './assets/svg/curve'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './components/ui/DropdownMenu'
import { useState } from 'react'
import { ImageWithStatus, ImageStatus } from '@shared/types'
import { ResizeBlock } from './components/blocks/ResizeBlock'
import { NewBlockDropdownMenuContent } from './components/NewBlockDropdownMenuContent'
import { FieldErrors, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Block, BlockSchema } from './lib/schemas'
import { ConvertBlock } from './components/blocks/ConvertBlock'
import { CompressBlock } from './components/blocks/CompressBlock'
import { TrimBlock } from './components/blocks/TrimBlock'
import { RenameBlock } from './components/blocks/RenameBlock'
import { useImageProcessing } from './hooks/useImageProcessing'
import { Button } from './components/ui/Button'

import { FileBlock } from './components/FileBlock'
// import { Arrow } from './assets/svg/arrow'
import { ipcLink } from 'electron-trpc/renderer'
import { createTRPCReact } from '@trpc/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from 'src/main/ipc/api'
import {
  useAddImages,
  useGetDefaultDirectory,
  useSelectDirectory,
  useSelectImages
} from './hooks/system.hooks'
import { OutputDirectory } from './components/OutputDirectory'
import { ImageUpload } from './components/ImageUpload'
import { getUniqueImages, isTRPCClientError } from './lib/utils'
import { useSaveFile } from './hooks/file.hooks'
import { RemoveMetadataBlock } from './components/blocks/RemoveMetadataBlock'
import { Toaster } from './components/ui/Toaster'
import { useToast } from './hooks/useToast'
import { ALLOWED_FILE_TYPES } from '@shared/constants'
import { Form } from './components/ui/Form'

const FlowSchema = z.object({
  blocks: z.array(BlockSchema)
})

type FlowFormValues = z.infer<typeof FlowSchema>

const trpcReact = createTRPCReact<AppRouter>()

function App(): JSX.Element {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [ipcLink()]
    })
  )

  return (
    <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </trpcReact.Provider>
  )
}

const Main = () => {
  const [images, setImages] = useState<ImageWithStatus[]>([])
  const [selectedOutputDirectory, setSelectedOutputDirectory] = useState<string>()
  const { data: defaultOutputDirectory, isLoading: isLoadingOutputDirectory } =
    useGetDefaultDirectory()

  const { toast } = useToast()

  const isRunning = images.some((image) => image.status === 'processing') // maybe memoize this

  const outputDirectory = selectedOutputDirectory || defaultOutputDirectory || ''

  const { mutate: selectDirectory } = useSelectDirectory({
    onSuccess: (data) => {
      if (data) setSelectedOutputDirectory(data)
    }
  })

  const {
    createTempImage,
    renameImage,
    resizeImage,
    cropImage,
    convertImage,
    compressImage,
    trimImage,
    clearMetadata
  } = useImageProcessing()

  const methods = useForm<FlowFormValues>({
    resolver: zodResolver(FlowSchema),
    defaultValues: { blocks: [] }
  })

  const { control, handleSubmit } = methods

  const {
    fields: blocks,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'blocks'
  })

  const { mutate: selectImages } = useSelectImages({
    onSuccess: (data) => {
      // mark all images as idle
      const idleImages: ImageWithStatus[] = data.map((image) => ({ ...image, status: 'idle' }))
      // add images to state, don't add duplicates
      setImages((prevImages) => getUniqueImages(prevImages, idleImages))
    }
  })

  const { mutate: addImages } = useAddImages({
    onSuccess: (data) => {
      // mark all images as idle
      const idleImages: ImageWithStatus[] = data.map((image) => ({ ...image, status: 'idle' }))
      // add images to state, don't add duplicates
      setImages((prevImages) => getUniqueImages(prevImages, idleImages))
    }
  })

  const { mutateAsync: saveFile } = useSaveFile()

  const handleSelectImages = () => {
    selectImages()
  }

  const handleDropImages = (filePaths: string[]) => {
    // check the uploaded file extensions to make sure they are in the allow list
    // create a list of the paths of the files that are not allowed
    // if the list is not empty, show a toast message to the user with the list of the files that are not allowed

    const notAllowedFiles = filePaths.filter((filePath) => {
      const extension = filePath.split('.').pop()?.toLowerCase()
      if (!extension) return true
      const allowedFileTypes: string[] = [...ALLOWED_FILE_TYPES] // for typescript
      return !allowedFileTypes.includes(extension)
    })

    if (notAllowedFiles.length > 0) {
      toast({
        title: 'Invalid file type',
        description: (
          <div className="space-y-2">
            <p>Only the following file types are allowed: {ALLOWED_FILE_TYPES.join(', ')}</p>
            <div>
              <p>The following files are not allowed:</p>
              <ul className="list-disc">
                {notAllowedFiles.map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            </div>
          </div>
        ),
        variant: 'destructive',
        duration: 7000
      })
      return
    }

    addImages({ filePaths })
  }

  const handleRemoveImage = (path: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.path !== path))
  }

  const onAddBlock = (type: Block['type']) => {
    switch (type) {
      case 'resize':
        append({ type: 'resize', width: 1024, mode: 'proportionalHeight' })
        break
      case 'rename':
        append({ type: 'rename', newName: '' })
        break
      case 'crop':
        append({ type: 'crop', top: 0, left: 0, width: 100, height: 100 })
        break
      case 'convert':
        append({ type: 'convert', outputType: 'png' })
        break
      case 'compress':
        append({ type: 'compress', quality: 80 })
        break
      case 'trim':
        append({ type: 'trim' })
        break
      case 'removeMetadata':
        append({ type: 'removeMetadata' })
        break
    }
  }

  const updateImageStatus = (path: string, update: ImageStatus) => {
    setImages((prevImages) =>
      prevImages.map((image) => {
        if (image.path === path) {
          return { ...image, ...update }
        }

        return image
      })
    )
  }

  const processImage = async (image: ImageWithStatus, blocks: Block[], index: number) => {
    // create a temporary image to make changes to
    let tempImagePath = await createTempImage(image.path)

    let outputImagePathWithoutExtension = image.nameWithoutExtension

    try {
      for (const block of blocks) {
        switch (block.type) {
          case 'resize': {
            const dimensions =
              block.mode === 'proportionalHeight'
                ? { width: block.width }
                : block.mode === 'proportionalWidth'
                  ? { height: block.height }
                  : { width: block.width, height: block.height }

            await resizeImage(tempImagePath, dimensions)
            break
          }
          case 'rename': {
            // note were not passing in temp path here
            const newOutputWithoutExtension = await renameImage(
              image.nameWithoutExtension,
              block.newName,
              index
            )
            outputImagePathWithoutExtension = newOutputWithoutExtension
            break
          }
          case 'crop':
            await cropImage(tempImagePath, block.left, block.top, block.width, block.height)
            break
          case 'convert': {
            const convertedImage = await convertImage(tempImagePath, block.outputType)
            tempImagePath = convertedImage.path
            break
          }
          case 'compress': {
            await compressImage(tempImagePath, block.quality)
            break
          }
          case 'trim':
            await trimImage(tempImagePath)
            break
          case 'removeMetadata':
            await clearMetadata(tempImagePath)
            break
        }
      }

      // handle output image path
      const outputImage = await saveFile({
        currentFilePath: tempImagePath,
        outputDirectory,
        outputFileNameWithoutExt: outputImagePathWithoutExtension
      })

      // set image status to complete
      updateImageStatus(image.path, { status: 'success', output: outputImage })
    } catch (error) {
      console.error('Error processing image:', error)

      // set image status to error
      let errorMessage = 'An error occurred while processing this image'
      if (isTRPCClientError(error)) {
        errorMessage = error['message']
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      updateImageStatus(image.path, { status: 'error', errorMessage })
    }
  }

  const onSubmit = async (data: FlowFormValues, imageIndex?: number) => {
    if (images.length === 0) {
      toast({
        title: 'No images added',
        description: 'Please add images before running the flow',
        variant: 'destructive',
        duration: 2500
      })
      return
    }

    if (outputDirectory === '') {
      toast({
        title: 'No output directory selected',
        description: 'Please select an output directory before running the flow',
        variant: 'destructive',
        duration: 2500
      })
      return
    }

    if (data.blocks.length === 0) {
      toast({
        title: 'No blocks added',
        description: 'Please add a block to the flow before running',
        variant: 'destructive',
        duration: 2500
      })
      return
    }

    // Mark the images as processing based on imageIndex
    setImages((prevImages) =>
      prevImages.map((image, index) =>
        imageIndex === undefined || index === imageIndex
          ? { ...image, status: 'processing' }
          : image
      )
    )

    if (imageIndex !== undefined) {
      // Process only the specific image
      const image = images[imageIndex]
      if (image) {
        await processImage(image, data.blocks, imageIndex)
      }
    } else {
      // Process all images
      for (const [index, image] of images.entries()) {
        await processImage(image, data.blocks, index)
      }
    }
  }

  const clearAllImages = (isOnlyProcessed = false) => {
    if (isOnlyProcessed === true) {
      setImages((prevImages) => prevImages.filter((image) => image.status !== 'success'))
    } else {
      setImages([])
    }
  }

  const clearAllBlocks = () => {
    methods.reset({ blocks: [] })
  }

  const clearAll = () => {
    clearAllImages()
    clearAllBlocks()
  }

  const onInvalid = (data: FieldErrors<FlowFormValues>) => {
    const formBlocks = data.blocks
    if (!formBlocks) return
    // find the first block with an error and scroll the ref into view
    for (const block in formBlocks) {
      if (formBlocks[block]) {
        const fieldError = formBlocks[block]
        const fieldErrorRef = fieldError?.ref

        if (!fieldErrorRef) continue
        if (fieldErrorRef instanceof Element) {
          fieldErrorRef.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return
        }
      }
    }
  }

  return (
    <>
      <div className="font-sans pb-16 relative">
        <div className="p-3 draggable sticky top-0 z-50">
          <div className="bg-background py-2 rounded-lg border-2 border-slate-200 flex justify-end px-2 sticky top-0 gap-2">
            <div className="flex items-center no-drag">
              <Button variant="outline" className={'rounded-r-none'} onClick={clearAll}>
                Clear all
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={'rounded-l-none border-l-0 px-2'}>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      clearAllImages()
                    }}
                  >
                    Clear all images
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      clearAllImages(true)
                    }}
                  >
                    Clear completed images
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      clearAllBlocks()
                    }}
                  >
                    Clear all blocks
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button
              onClick={handleSubmit(
                (data) => onSubmit(data),
                (error) => onInvalid(error)
              )}
              className="no-drag"
              disabled={isRunning}
            >
              <Play size={16} strokeWidth={2} />
              Run
            </Button>
          </div>
        </div>

        <div className="px-3 flex space-x-3  max-w-5xl mx-auto">
          <div className="bg-background w-full rounded-3xl border-2 border-slate-200 relative flex flex-col max-w-xl mx-auto">
            <div className="p-3 ">
              <ImageUpload
                onHandleSelectImages={handleSelectImages}
                onFilesDrop={handleDropImages}
              />
            </div>
            <div className="border-slate-200 w-full border-b-2 " />

            <OutputDirectory
              outputDirectory={outputDirectory}
              onUpdateDirectory={selectDirectory}
              isLoading={isLoadingOutputDirectory}
            />
          </div>
        </div>
        {images.length > 0 && <div className="w-1 h-8 bg-slate-300 mx-auto my-2 rounded" />}
        <div className="w-full px-3 max-w-[900px] mx-auto flex flex-col gap-2">
          {images.map((image, index) => (
            <FileBlock
              key={image.path}
              image={image}
              remove={handleRemoveImage}
              onRunClick={handleSubmit(
                (data) => onSubmit(data, index),
                (error) => onInvalid(error)
              )}
            />
          ))}
          {/* {images.length === 0 && (
          <div className="  bg-white border-2 border-slate-200 rounded-lg mx-auto p-1 w-96 ">
            <div className="h-14 flex items-center justify-center">
              <span className="text-center text-sm text-slate-500 w-full">No images added yet</span>
            </div>
          </div>
        )} */}
          <div className="w-1 h-8 bg-slate-300 mx-auto my-2 rounded" />
        </div>
        {/* <div className="bg-background w-full rounded-3xl border-2 border-slate-200 relative flex items-center justify-center max-h-[500px]">
        <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2">
          <Curve className="scale-x-[-1] rotate-180" />
        </div>

        <div className="absolute top-[calc(100%+4.5px)] left-1/2 -translate-x-1/2">
          <Arrow />
        </div>
      </div> */}

        <div className="px-3 flex flex-col">
          {/* <div className="w-[calc(50%-20px)] mx-auto mt-[42px]  relative ">
          <div className="w-full relative flex space-x-12">
            <hr className="border-slate-300 border-[2px] w-full" />
            <hr className="border-slate-300 border-[2px] w-full" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 h-2 top-0">
            <Curve className="absolute left-[calc(50%+11px)] -translate-x-1/2" />
            <Curve className="scale-x-[-1] absolute top-0 left-[calc(50%-11px)] -translate-x-1/2" />
          </div>
        </div> */}

          <Form<FlowFormValues> {...methods}>
            <div className="">
              {blocks.length === 0 && (
                <div className="flex justify-center text-secondary-foreground">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="bg-background rounded-3xl border-2 border-slate-200 p-3 px-6 self-center flex items-center space-x-3">
                      <PlusCircle className="" />
                      <h2 className="font-medium text-sm">Add your first block</h2>
                    </DropdownMenuTrigger>
                    <NewBlockDropdownMenuContent addBlock={onAddBlock} />
                  </DropdownMenu>
                </div>
              )}

              <div className="flex flex-col items-center">
                {blocks.map((block, index) => {
                  let BlockComponent: JSX.Element | null = null
                  switch (block.type) {
                    case 'resize':
                      BlockComponent = <ResizeBlock key={block.id} index={index} remove={remove} />
                      break
                    case 'convert':
                      BlockComponent = <ConvertBlock key={block.id} index={index} remove={remove} />
                      break
                    case 'compress':
                      BlockComponent = (
                        <CompressBlock key={block.id} index={index} remove={remove} />
                      )
                      break
                    case 'trim':
                      BlockComponent = <TrimBlock key={block.id} index={index} remove={remove} />
                      break
                    case 'rename':
                      BlockComponent = <RenameBlock key={block.id} index={index} remove={remove} />
                      break
                    case 'removeMetadata':
                      BlockComponent = (
                        <RemoveMetadataBlock key={block.id} index={index} remove={remove} />
                      )
                      break
                    // Add cases for other block types

                    default:
                      BlockComponent = null
                  }

                  return (
                    <div key={index}>
                      {BlockComponent}
                      {index < blocks.length - 1 && (
                        <div className="w-1 h-8 bg-slate-300 mx-auto my-1" />
                      )}
                    </div>
                  )
                })}
              </div>

              {blocks.length > 0 && (
                <>
                  <div className="w-1 h-8 bg-slate-300 mx-auto mb-1 mt-2 rounded" />
                  <div className="flex justify-center text-secondary-foreground">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <PlusCircle
                          className="mx-auto text-slate-300 hover:text-indigo-500 hover:cursor-pointer"
                          strokeWidth={3}
                        />
                      </DropdownMenuTrigger>
                      <NewBlockDropdownMenuContent addBlock={onAddBlock} />
                    </DropdownMenu>
                  </div>
                </>
              )}
            </div>
          </Form>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default App
