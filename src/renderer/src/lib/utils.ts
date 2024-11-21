import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const replaceVariables = (
  input: string,
  variables: Record<string, string>,
  allowedVariables: string[]
) => {
  // Define a regex to match variables in the input string
  const variableRegex = /\{ *([\w]+) *\}/g

  // Collect the matched variables
  const matchedVariables: Set<string> = new Set()

  // Replace variables in the input string
  const replacedString = input.replace(variableRegex, (_, variableName) => {
    const trimmedVariable = variableName.trim()
    if (allowedVariables.includes(trimmedVariable)) {
      matchedVariables.add(trimmedVariable)
      return variables[trimmedVariable] || ''
    }
    return `{${variableName}}` // Keep unchanged if not in allowed variables
  })

  // Log matched variables (if needed for debugging)
  // console.log(Array.from(matchedVariables));

  return replacedString
}
