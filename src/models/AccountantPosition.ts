import { Base } from './Base.js'

export class AccountantPosition extends Base {
  constructor(id: string, name: string, description: string) {
    super(id, name, description)
  }
}

export class AccountantPositionNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionNotFoundError'
  }
}

export class AccountantPositionAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PermissionAlreadyExistsError'
  }
}
