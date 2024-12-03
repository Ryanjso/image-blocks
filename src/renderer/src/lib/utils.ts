import { clsx, type ClassValue } from 'clsx'
import { ProcessedImage } from 'src/types'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const replaceVariables = (input: string, variables: Record<string, string>) => {
  // Define a regex to match variables in the input string
  const variableRegex = /\{ *([\w]+) *\}/g

  // Replace variables in the input string
  const replacedString = input.replace(variableRegex, (_, variableName) => {
    const trimmedVariable = variableName.trim()
    if (Object.prototype.hasOwnProperty.call(variables, trimmedVariable)) {
      return variables[trimmedVariable] || ''
    }
    return `{${variableName}}` // Keep unchanged if not in variables
  })

  return replacedString
}

export const getUniqueImages = (prevImages: ProcessedImage[], newImages: ProcessedImage[]) => {
  const seenPaths = new Set<string>()

  // Helper function to filter unique images
  const filterUnique = (images: ProcessedImage[]) => {
    return images.filter((image) => {
      if (seenPaths.has(image.path)) {
        return false
      }
      seenPaths.add(image.path)
      return true
    })
  }

  const uniqueNewImages = filterUnique(newImages)
  const uniquePrevImages = filterUnique(prevImages)

  // Combine new images first, followed by previous images
  return [...uniqueNewImages, ...uniquePrevImages]
}
