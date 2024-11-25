import { registerImageHandlers } from './image'
import { registerFileHandlers } from './file'
import { registerSystemHandlers } from './system'

// Eventually break these out into separate files based on resource
export const registerHandlers = () => {
  registerFileHandlers()
  registerImageHandlers()
  registerSystemHandlers()
}
