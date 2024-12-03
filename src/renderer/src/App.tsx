import { Play, PlusCircle } from 'lucide-react'
// import { Curve } from './assets/svg/curve'
import { DropdownMenu, DropdownMenuTrigger } from './components/ui/DropdownMenu'
import { useState } from 'react'
import { ProcessedImage, ProcessedImagePayload } from 'src/types'
import { FlowProvider } from './context/FlowContext'
import { ResizeBlock } from './components/blocks/ResizeBlock'
import { NewBlockDropdownMenuContent } from './components/NewBlockDropdownMenuContent'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
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
import { getUniqueImages } from './lib/utils'
import { useSaveFile } from './hooks/file.hooks'

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
  const [images, setImages] = useState<ProcessedImage[]>([])
  const [selectedOutputDirectory, setSelectedOutputDirectory] = useState<string>()
  const { data: defaultOutputDirectory, isLoading: isLoadingOutputDirectory } =
    useGetDefaultDirectory()

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
    trimImage
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
      // add images to state, don't add duplicates
      setImages((prevImages) => getUniqueImages(prevImages, data))
    }
  })

  const { mutate: addImages } = useAddImages({
    onSuccess: (data) => {
      // add images to state, don't add duplicates
      setImages((prevImages) => getUniqueImages(prevImages, data))
    }
  })

  const { mutateAsync: saveFile } = useSaveFile()

  const handleSelectImages = () => {
    selectImages()
  }

  const handleDropImages = (filePaths: string[]) => {
    addImages({ filePaths })
  }

  const handleRemoveImage = (path: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.path !== path))
  }

  const onAddBlock = (type: Block['type']) => {
    switch (type) {
      case 'resize':
        append({ type: 'resize', width: 100, height: 100 })
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
    }
  }

  const updateImageStatus = (path: string, update: ProcessedImagePayload) => {
    setImages((prevImages) =>
      prevImages.map((image) => {
        if (image.path === path) {
          return { ...image, ...update }
        }

        return image
      })
    )
  }

  const processImage = async (image: ProcessedImage, blocks: Block[], index: number) => {
    // create a temporary image to make changes to
    let tempImagePath = await createTempImage(image.path)

    let outputImagePathWithoutExtension = image.nameWithoutExtension

    try {
      for (const block of blocks) {
        switch (block.type) {
          case 'resize':
            await resizeImage(tempImagePath, block.width, block.height)
            break
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
      updateImageStatus(image.path, { status: 'error', errorMessage: error.message })
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    // mark all images as processing
    setImages((prevImages) =>
      prevImages.map((image) => ({
        ...image,
        status: 'processing'
      }))
    )

    for (const [index, image] of images.entries()) {
      // eventually you can promise.allsettled or something equivalent here maybe with a max concurrency
      await processImage(image, data.blocks, index)
    }
  })

  return (
    <div className="font-sans pb-16 relative">
      <div className="p-3 draggable sticky top-0 z-10">
        <div className="bg-background py-2 rounded-lg border-2 border-slate-200 flex justify-end px-2 sticky top-0">
          <Button onClick={onSubmit} className="no-drag">
            <Play size={16} strokeWidth={2} />
            Run
          </Button>
        </div>
      </div>

      <div className="px-3 flex space-x-3  max-w-5xl mx-auto">
        <div className="bg-background w-full rounded-3xl border-2 border-slate-200 relative flex flex-col max-w-xl mx-auto">
          <div className="p-3 ">
            <ImageUpload onHandleSelectImages={handleSelectImages} onFilesDrop={handleDropImages} />
          </div>
          <div className="border-slate-200 w-full border-b-2 " />

          <OutputDirectory
            outputDirectory={outputDirectory}
            onUpdateDirectory={selectDirectory}
            isLoading={isLoadingOutputDirectory}
          />
        </div>
      </div>
      <div className="grid gap-2 w-full mt-12 px-3 max-w-[900px] mx-auto">
        {images.map((image) => (
          <FileBlock key={image.path} image={image} remove={handleRemoveImage} />
        ))}
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

        <FormProvider {...methods}>
          <div className="mt-10">
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
                    BlockComponent = <CompressBlock key={block.id} index={index} remove={remove} />
                    break
                  case 'trim':
                    BlockComponent = <TrimBlock key={block.id} index={index} remove={remove} />
                    break
                  case 'rename':
                    BlockComponent = <RenameBlock key={block.id} index={index} remove={remove} />
                    break
                  // Add cases for other block types

                  default:
                    BlockComponent = null
                }

                return (
                  <div key={index}>
                    {BlockComponent}
                    {index < blocks.length - 1 && (
                      <div className="w-1 h-8 bg-slate-300 mx-auto my-1"></div>
                    )}
                  </div>
                )
              })}
            </div>

            {blocks.length > 0 && (
              <>
                <div className="w-1 h-8 bg-slate-300 mx-auto my-1"></div>
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
        </FormProvider>
      </div>
    </div>
  )
}

const WrappedApp = () => {
  return (
    <FlowProvider>
      <App />
    </FlowProvider>
  )
}

export default WrappedApp
