import { Base } from './Base.js'

export class Permission extends Base {
  constructor(id: string, name: string, description: string) {
    super(id, name, description)
  }
}

export class PermissionNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionNotFoundError'
  }
}

export class PermissionAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionAlreadyExistsError'
  }
}
