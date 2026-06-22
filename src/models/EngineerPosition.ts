import { Base } from './Base.js'

export class EngineerPosition extends Base {
  constructor(id: string, name: string, description: string) {
    super(id, name, description)
  }
}

export class EngineerPositionNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EngineerPositionNotFoundError'
  }
}

export class EngineerPositionAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EngineerPositionAlreadyExistsError'
  }
}
