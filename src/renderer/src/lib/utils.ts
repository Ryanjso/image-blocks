import { clsx, type ClassValue } from 'clsx'
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
