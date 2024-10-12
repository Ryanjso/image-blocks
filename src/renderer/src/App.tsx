import { Play, PlusCircle } from 'lucide-react'
import { Arrow } from './assets/svg/arrow'
import { Curve } from './assets/svg/curve'
import { DropdownMenu, DropdownMenuTrigger } from './components/ui/DropdownMenu'
import { Block, BlockType, RenameBlock } from './lib/blocks'
import { useState } from 'react'
import { NewBlockDropdownMenuContent } from './components/NewBlockDropdownMenuContent'

function App(): JSX.Element {
  const [blocks, setBlocks] = useState<Block[]>([new RenameBlock('1', 'Rename Image')])
  const [images, setImages] = useState<
    {
      path: string
      filename: string
    }[]
  >([])

  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const removeBlock = (id: string) => {
    setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== id))
  }

  const attemptToRenameTest = async (oldPath: string) => {
    const newPath = await window.api.renameFile(oldPath, 'mister')
    console.log(oldPath, newPath)
  }

  const addBlock = (blockType: BlockType) => {
    switch (blockType) {
      case 'rename':
        setBlocks((prevBlocks) => [
          ...prevBlocks,
          new RenameBlock(String(prevBlocks.length + 1), 'Rename Image')
        ])
        break
      case 'resize':
        break
      case 'convert':
        break
      case 'compress':
        break
      case 'trim':
        break
      default:
        break
    }
  }

  console.log(images)

  return (
    <div className="font-sans pb-16">
      <div className="p-3 draggable">
        <div className="bg-background h-20 rounded-t-lg rounded-b-3xl border-2 border-slate-200 flex justify-end px-5">
          <button className="bg-indigo-500 text-white px-5 py-2 rounded-3xl self-center flex items-center space-x-4 no-drag hover:bg-indigo-600">
            <span className="text-sm font-semibold">Run</span>
            <Play size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="px-3 flex space-x-3">
        <div className="bg-background w-full h-64 rounded-3xl border-2 border-slate-200 p-3 relative">
          <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2">
            <Curve className="scale-x-[-1] rotate-180" />
          </div>

          {images.length === 0 ? (
            <div className="w-full h-full bg-indigo-100 border-dashed border-indigo-400 border-[3px] rounded-2xl flex flex-col justify-center space-y-4">
              <span className="text-indigo-400 font-medium text-center text-sm">
                Drop files here
              </span>

              <div className="flex justify-center">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-block px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600"
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
                    // if (files) {
                    //   for (let i = 0; i < files.length; i++) {
                    //     attemptToRenameTest(files[i].path)
                    //   }
                    // }

                    if (files)
                      setImages((prevImages) => [
                        ...prevImages,
                        ...Array.from(files).map((file) => {
                          return { path: file.path, filename: file.name }
                        })
                      ])
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              {images.map((image) => (
                <div key={image.path} className="relative w-full h-full bg-blue-600">
                  <span>{image.filename}</span>
                  <img
                    src={'local-file://' + encodeURIComponent(image.path)}
                    alt="image"
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>
              ))}
            </>
          )}
        </div>
        <div className="bg-background w-full h-64 rounded-3xl border-2 p-3 border-slate-200 relative">
          <div className="absolute top-[calc(100%+4.5px)] left-1/2 -translate-x-1/2">
            <Arrow />
          </div>
        </div>
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
        <div className="mt-10">
          {blocks.length === 0 && (
            <div className="flex justify-center text-secondary-foreground">
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-background rounded-3xl border-2 border-slate-200 p-3 px-6 self-center flex items-center space-x-3">
                  <PlusCircle className="" />
                  <h2 className="font-medium text-sm">Add your first block</h2>
                </DropdownMenuTrigger>
                <NewBlockDropdownMenuContent addBlock={addBlock} />
              </DropdownMenu>
            </div>
          )}

          <div className="flex flex-col">
            {blocks.map((block, index) => (
              <div key={block.id} className="self-center">
                <div className="bg-background rounded-3xl border-2 border-slate-200 p-3 relative  min-w-96 ">
                  <h2 className="font-semibold">{block.title}</h2>
                  {block.render()}
                </div>
                {index < blocks.length - 1 && (
                  <div className="w-1 h-8 bg-slate-300 mx-auto my-1"></div>
                )}
              </div>
            ))}
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
                  <NewBlockDropdownMenuContent addBlock={addBlock} />
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
