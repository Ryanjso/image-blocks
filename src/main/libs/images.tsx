import sharp from 'sharp'

// sharp cant be imported into the renderer process
export class Image {
  path: string
  filename: string

  constructor(path: string, filename: string) {
    this.path = path
    this.filename = filename
  }

  // get file size
  async getSize() {
    const metadata = await sharp(this.path).metadata()
    return metadata.size
  }
}
