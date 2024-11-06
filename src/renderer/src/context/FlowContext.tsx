import { ResizeSchema } from '@renderer/lib/schemas'
import React, { createContext, useContext, useState, useCallback } from 'react'

export type BlockConfig = {
  type: 'Resize' | 'Crop' | 'Filter' // Extend with other types
  settings: ResizeSchema
}

interface FlowContextType {
  imagePaths: string[]
  blocks: BlockConfig[]
  addBlock: (block: BlockConfig) => void
  updateImages: (images: string[]) => void
  updateBlockConfig: (index: number, settings: ResizeSchema) => void
}

const FlowContext = createContext<FlowContextType | undefined>(undefined)

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [imagePaths, setImagePaths] = useState<string[]>([])
  const [blocks, setBlocks] = useState<BlockConfig[]>([])

  const addBlock = useCallback((block: BlockConfig) => {
    setBlocks((prev) => [...prev, block])
  }, [])

  const updateBlockConfig = useCallback((index: number, settings: ResizeSchema) => {
    setBlocks((prev) => prev.map((block, i) => (i === index ? { ...block, settings } : block)))
  }, [])

  return (
    <FlowContext.Provider
      value={{ imagePaths, blocks, addBlock, updateImages: setImagePaths, updateBlockConfig }}
    >
      {children}
    </FlowContext.Provider>
  )
}

export const useFlow = () => {
  const context = useContext(FlowContext)
  if (!context) throw new Error('useFlow must be used within a FlowProvider')
  return context
}
