import { X } from 'lucide-react'

export const RemoveBlock = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-sm border-2 border-slate-200 absolute bg-white -top-2 -right-2 p-1"
    >
      <X className="text-slate-500" size={14} />
    </button>
  )
}
