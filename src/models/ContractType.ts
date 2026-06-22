import { Base } from './Base.js'

export class ContractType extends Base {
  constructor(id: string, name: string, description: string) {
    super(id, name, description)
  }
}

export class ContractTypeNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContractTypeNotFoundError'
  }
}

export class ContractTypeAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContractTypeAlreadyExistsError'
  }
}
