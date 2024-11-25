import { Folder, Play, PlusCircle } from 'lucide-react'
import { Curve } from './assets/svg/curve'
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
import { Button, buttonVariants } from './components/ui/Button'
import { cn } from './lib/utils'

const FlowSchema = z.object({
  blocks: z.array(BlockSchema)
})

type FlowFormValues = z.infer<typeof FlowSchema>

function App(): JSX.Element {
  // const [blocks, setBlocks] = useState<Block[]>([new RenameBlock('1', 'Rename Image')])
  const [images, setImages] = useState<ProcessedImage[]>([])
  const [outputDirectory, setOutputDirectory] = useState<string>('')

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

  const handleAddImages = async (files: FileList) => {
    try {
      // Extract the paths of the files to be added
      const imagePaths = Array.from(files).map((file) => file.path)

      // Create a Set of the current image paths for efficient lookup
      const currentImagePaths = new Set(images.map((img) => img.path))

      // Filter out any images that are already in the current state
      const uniqueImagePaths = imagePaths.filter((path) => !currentImagePaths.has(path))

      // If there are no unique images, exit early
      if (uniqueImagePaths.length === 0) {
        console.log('No new images to add.')
        return
      }

      // Send only unique paths to the main process for processing
      const processedImages = await window.api.processImages(uniqueImagePaths)

      // Update state with only the new processed images
      setImages((prevImages) => [...prevImages, ...processedImages])
    } catch (error) {
      console.error('Error adding images:', error)
    }
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
      prevImages.map((image) => (image.path === path ? { ...image, ...update } : image))
    )
  }

  const processImage = async (image: ProcessedImage, blocks: Block[], index: number) => {
    // set image status to processing
    updateImageStatus(image.path, { status: 'processing' })

    // create a temporary image to make changes to
    const tempImagePath = await createTempImage(image.path)

    // append '-output' to the image path before the extension
    let outputImagePathWithoutExtension = image.nameWithoutExtension + '-output'

    try {
      for (const block of blocks) {
        switch (block.type) {
          case 'resize':
            await resizeImage(tempImagePath, block.width, block.height)
            break
          case 'rename': {
            // note were not passing in temp path here
            const newOutputWithoutExtension = await renameImage(image.path, block.newName, index)
            outputImagePathWithoutExtension = newOutputWithoutExtension
            break
          }
          case 'crop':
            await cropImage(tempImagePath, block.left, block.top, block.width, block.height)
            break
          case 'convert': {
            await convertImage(tempImagePath, block.outputType)
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

      // set image status to complete
      updateImageStatus(image.path, { status: 'complete' })
    } catch (error) {
      console.error('Error processing image:', error)

      // set image status to error
      updateImageStatus(image.path, 'error')
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    for (const [index, image] of images.entries()) {
      // eventually you can promise.allsettled or something equivalent here maybe with a max concurrency
      await processImage(image, data.blocks, index)
    }
  })

  return (
    <div className="font-sans pb-16 relative">
      <div className="p-3 draggable">
        <div className="bg-background h-20 rounded-t-lg rounded-b-3xl border-2 border-slate-200 flex justify-end px-5 sticky top-0">
          <button
            className="bg-indigo-500 text-white px-5 py-2 rounded-3xl self-center flex items-center space-x-4 no-drag hover:bg-indigo-600"
            onClick={onSubmit}
          >
            <span className="text-sm font-semibold">Run</span>
            <Play size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="px-3 flex space-x-3  max-w-5xl mx-auto">
        <div className="bg-background w-full rounded-3xl border-2 border-slate-200 relative flex flex-col max-w-xl mx-auto">
          <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2">
            <Curve className="scale-x-[-1] rotate-180" />
          </div>

          <div className="p-3 ">
            <div className="w-full h-full bg-indigo-100 border-dashed border-indigo-400 py-7 border-[3px] rounded-2xl flex flex-col justify-center space-y-4">
              <span className="text-indigo-400 font-medium text-center text-sm">
                Drag your files here
              </span>

              <div className="flex justify-center">
                <label
                  htmlFor="file-upload"
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'default' }),
                    'hover:cursor-pointer'
                  )}
                >
                  Browse Files
                </label>
                <input
                  id="file-upload"
                  className="hidden"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files

                    if (files) {
                      handleAddImages(files)
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div className="border-slate-200 w-full border-b-2 " />
          <div className="p-3">
            <div className="bg-slate-100 flex justify-between p-4 rounded-xl space-x-8 items-center">
              <div className="grid gap-1">
                <p className="text-sm text-slate-500 font-medium">Output Directory:</p>
                <p className="text-sm text-slate-800 font-semibold break break-all">
                  {outputDirectory}
                </p>
              </div>
              <Button
                variant={'outline'}
                onClick={async () => {
                  const path = await window.api.selectFolder()
                  console.log(path)
                  if (path) {
                    setOutputDirectory(path)
                  }
                }}
              >
                <Folder />
                Change Directory
              </Button>
            </div>
          </div>
          {/* {images.length > 0 ? (
            <div className="flex flex-col px-3 overflow-scroll">
              {images.map((image, index) => (
                <div
                  key={image.path}
                  className={`border-slate-200 py-2 ${index === images.length - 1 ? '' : 'border-b'}`}
                >
                  <FileBlock image={image} />
                </div>
              ))}
            </div>
          ) : (
            <div className="px-3 py-6 flex justify-center">
              <span className="text-muted-foreground text-sm font-medium text-center">
                No files added
              </span>
            </div>
          )} */}
        </div>
        {/* <div className="bg-background w-full rounded-3xl border-2 border-slate-200 relative flex items-center justify-center max-h-[500px]">
          <span className="text-sm text-muted-foreground font-medium">Output files</span>

          <div className="absolute top-[calc(100%+4.5px)] left-1/2 -translate-x-1/2">
            <Arrow />
          </div>
        </div> */}
      </div>
      <div className="px-3 flex flex-col">
        <div className="w-[calc(50%-20px)] mx-auto mt-[42px]  relative ">
          <div className="w-full relative flex space-x-12">
            <hr className="border-slate-300 border-[2px] w-full" />
            <hr className="border-slate-300 border-[2px] w-full" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 h-2 top-0">
            <Curve className="absolute left-[calc(50%+11px)] -translate-x-1/2" />
            <Curve className="scale-x-[-1] absolute top-0 left-[calc(50%-11px)] -translate-x-1/2" />
          </div>
        </div>

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
