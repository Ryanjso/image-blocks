export type BlockType = 'rename' | 'resize' | 'convert' | 'compress' | 'trim'

export abstract class Block {
  id: string
  title: string

  constructor(id: string, title: string) {
    this.id = id
    this.title = title
  }

  abstract render(): JSX.Element
  //   abstract updateData(data: any): void
}

export class RenameBlock extends Block {
  constructor(id: string, title: string) {
    super(id, title)
  }

  render(): JSX.Element {
    return <div>slay slay</div>
  }
}
