import { Play, PlusCircle } from 'lucide-react'
import { Arrow } from './assets/svg/arrow'
import { Curve } from './assets/svg/curve'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div>
      <div className="p-3 draggable">
        <div className="bg-white h-20 rounded-t-lg rounded-b-3xl border-2 border-slate-200 flex justify-end px-5">
          <button className="bg-indigo-500 text-white px-5 py-2 rounded-3xl self-center flex items-center space-x-4 no-drag">
            <span className="text-sm font-semibold">Run</span>
            <Play size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="px-3 flex space-x-3">
        <div className="bg-white w-full h-64 rounded-3xl border-2 border-slate-200 p-3 relative">
          <div className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2">
            <Curve className="scale-x-[-1] rotate-180" />
          </div>
          <div className="w-full h-full bg-indigo-100 border-dashed border-indigo-400 border-[3px] rounded-2xl flex flex-col justify-center ">
            <span className="text-indigo-400 font-bold text-center text-sm">Drop files here</span>

            <div>
              <label>Image Upload</label>
              <input
                className="inline"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    for (let i = 0; i < files.length; i++) {
                      console.log(files[i])
                      console.log(files[i].name)
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="bg-white w-full h-64 rounded-3xl border-2 p-3 border-slate-200 relative">
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
          <div className="absolute left-1/2 -translate-x-1/2 h-2  top-0">
            <Curve className="absolute left-[calc(50%+11px)] -translate-x-1/2" />
            <Curve className="scale-x-[-1] absolute top-0 left-[calc(50%-11px)] -translate-x-1/2" />
          </div>
        </div>
        <div className="flex justify-center mt-11">
          <button className="bg-white rounded-3xl border-2 border-slate-200 p-3 px-6 self-center flex items-center space-x-3">
            <PlusCircle />
            <h2 className="font-medium text-sm">Add your first block</h2>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
