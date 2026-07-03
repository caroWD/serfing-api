import { Base } from './Base.js'

export class EducationDegree extends Base {
  constructor(id: string, name: string, description: string) {
    super(id, name, description)
  }
}

export class EducationDegreeNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EducationDegreeNotFoundError'
  }
}

export class EducationDegreeAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EducationDegreeAlreadyExistsError'
  }
}
