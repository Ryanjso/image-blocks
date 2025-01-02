import * as fs from 'fs'
import * as path from 'path'
import { z, ZodSchema } from 'zod'
import { app } from 'electron'

class JsonStorage<T> {
  private filePath: string
  private schema: ZodSchema<T>

  constructor(fileName: string, schema: ZodSchema<T>) {
    const userDataPath = app.getPath('userData') // Electron-specific path for app data
    this.filePath = path.join(userDataPath, fileName)
    this.schema = schema

    // Ensure the file exists; create an empty JSON file if it doesn't
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({}))
    }
  }

  // Save data to the JSON file
  save(data: T): void {
    const parsedData = this.schema.parse(data) // Validate data with zod
    fs.writeFileSync(this.filePath, JSON.stringify(parsedData, null, 2), 'utf-8')
  }

  // Load data from the JSON file
  load(): T | null {
    if (!fs.existsSync(this.filePath)) {
      return null
    }

    try {
      const rawData = fs.readFileSync(this.filePath, 'utf-8')
      const parsedData = this.schema.parse(JSON.parse(rawData)) // Validate data with zod
      return parsedData
    } catch (error) {
      console.error('Failed to load or parse data:', error)
      return null
    }
  }

  // Delete the JSON file
  delete(): void {
    if (fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath)
    }
  }
}

const userPreferencesSchema = z.object({
  defaultOutputDirectory: z.string().optional()
})
export type UserPreferences = z.infer<typeof userPreferencesSchema>

export const userPreferencesStorage = new JsonStorage('userPreferences.json', userPreferencesSchema)
