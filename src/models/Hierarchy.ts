import { Base } from './Base.js'

export class Hierarchy extends Base {
  constructor(id: string, name: string, description: string) {
    super(id, name, description)
  }
}

export class HierarchyNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HierarchyNotFoundError'
  }
}

export class HierarchyAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HierarchyAlreadyExistsError'
  }
}
