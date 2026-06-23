import { Temporal } from 'temporal-polyfill'

export type State = 'pending' | 'enabled' | 'disabled'

export type Tempo = Temporal.PlainDate

export type TempoDeleted = Tempo | null

export class User {
  private _id: string
  private _handle: string
  private _firstName: string
  private _lastName: string
  private _email: string
  private _password: string
  private _state: State
  private _roleId: string
  private _createdAt: Tempo
  private _updatedAt: Tempo
  private _deletedAt: TempoDeleted

  constructor(
    id: string,
    handle: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    state: State,
    roleId: string,
    createdAt: Tempo,
    updatedAt: Tempo,
    deletedAt: TempoDeleted
  ) {
    this._id = id
    this._handle = handle
    this._firstName = firstName
    this._lastName = lastName
    this._email = email
    this._password = password
    this._state = state
    this._roleId = roleId
    this._createdAt = createdAt
    this._updatedAt = updatedAt
    this._deletedAt = deletedAt
  }

  get id(): string {
    return this._id
  }

  get handle(): string {
    return this._handle
  }

  get firstName(): string {
    return this._firstName
  }

  get lastName(): string {
    return this._lastName
  }

  get email(): string {
    return this._email
  }

  get password(): string {
    return this._password
  }

  get state(): State {
    return this._state
  }

  get roleId(): string {
    return this._roleId
  }

  get createdAt(): Tempo {
    return this._createdAt
  }

  get updatedAt(): Tempo {
    return this._updatedAt
  }

  get deletedAt(): TempoDeleted {
    return this._deletedAt
  }
}

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserNotFoundError'
  }
}

export class UserHandleAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserHandleAlreadyExistsError'
  }
}

export class UserEmailAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserEmailAlreadyExistsError'
  }
}

export class UserUnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserUnauthorizedError'
  }
}
