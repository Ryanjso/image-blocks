import { describe, it, expect } from 'vitest'
import { replaceVariables } from './utils'

describe('replaceVariables', () => {
  const allowedVariables = ['name', 'day']

  it('should replace valid variables with their values', () => {
    const input = 'image_{name}_tuesday'
    const variables = { name: 'pancake', day: 'friday' }
    const result = replaceVariables(input, variables, allowedVariables)
    expect(result).toBe('image_pancake_tuesday')
  })

  it('should ignore invalid variables', () => {
    const input = 'image_{unknown}_tuesday'
    const variables = { name: 'pancake', day: 'friday' }
    const result = replaceVariables(input, variables, allowedVariables)
    expect(result).toBe('image_{unknown}_tuesday')
  })

  it('should handle spaces inside brackets', () => {
    const input = 'image_{ name }_on_{ day }'
    const variables = { name: 'pancake', day: 'tuesday' }
    const result = replaceVariables(input, variables, allowedVariables)
    expect(result).toBe('image_pancake_on_tuesday')
  })

  it('should handle duplicate variables', () => {
    const input = '{name}_{name}_{day}'
    const variables = { name: 'test', day: 'monday' }
    const result = replaceVariables(input, variables, allowedVariables)
    expect(result).toBe('test_test_monday')
  })

  it('should return the original string if no valid variables are found', () => {
    const input = 'image_without_variables'
    const variables = { name: 'pancake', day: 'tuesday' }
    const result = replaceVariables(input, variables, allowedVariables)
    expect(result).toBe('image_without_variables')
  })

  it('should leave unmatched variables intact', () => {
    const input = 'image_{name}_{unknown}'
    const variables = { name: 'pancake' }
    const result = replaceVariables(input, variables, allowedVariables)
    expect(result).toBe('image_pancake_{unknown}')
  })

  it('should replace variables that are missing values with empty strings', () => {
    const input = 'image_{name}_for_{day}'
    const variables = { name: 'pancake' }
    const result = replaceVariables(input, variables, allowedVariables)
    expect(result).toBe('image_pancake_for_')
  })
})
