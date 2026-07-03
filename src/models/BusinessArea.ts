import { Base } from './Base.js'

export class BusinessArea extends Base {
  constructor(id: string, name: string, description: string) {
    super(id, name, description)
  }
}

export class BusinessAreaNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BusinessAreaNotFoundError'
  }
}

export class BusinessAreaAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BusinessAreaAlreadyExistsError'
  }
}
