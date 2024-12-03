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
  const uniqueImages = new Map<string, ProcessedImage>()

  // Add previous images to the map, using their path as the key
  for (const image of prevImages) {
    uniqueImages.set(image.path, image)
  }

  // Add new images to the map, overriding duplicates
  for (const image of newImages) {
    uniqueImages.set(image.path, image)
  }

  // Convert the map values back to an array
  return Array.from(uniqueImages.values())
}
