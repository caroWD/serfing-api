import { Base } from './Base.js'

export class Role extends Base {
  constructor(id: string, name: string, description: string) {
    super(id, name, description)
  }
}

export class RoleNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RoleNotFoundError'
  }
}

export class RoleAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RoleAlreadyExistsError'
  }
}

export class RoleDoesNotHaveThatPermissionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RoleDoesNotHaveThatPermissionError'
  }
}

export class RoleAlreadyHasThatPermissionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RoleAlreadyHasThatPermissionError'
  }
}
