import { Base } from './Base.js'

export class OperatorType extends Base {
  constructor(id: string, name: string, description: string) {
    super(id, name, description)
  }
}

export class OperatorTypeNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionNotFoundError'
  }
}

export class OperatorTypeAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionAlreadyExistsError'
  }
}
