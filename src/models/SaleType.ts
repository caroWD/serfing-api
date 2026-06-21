import { Base } from './Base.js'

export class SaleType extends Base {
  constructor(id: string, name: string, description: string) {
    super(id, name, description)
  }
}

export class SaleTypeNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionNotFoundError'
  }
}

export class SaleTypeAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionAlreadyExistsError'
  }
}
