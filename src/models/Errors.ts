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
