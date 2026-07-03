import { User, type State, type Tempo, type TempoDeleted } from './User.js'

export class Collaborator extends User {
  private _salary: number
  private _yearsExperience: number
  private _hierarchyId: string
  private _businessAreaId: string
  private _educationDegreeId: string
  private _contractTypeId: string

  constructor(
    id: string,
    handle: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    salary: number,
    yearsExperience: number,
    hierarchyId: string,
    businessAreaId: string,
    educationDegreeId: string,
    contractTypeId: string,
    state: State,
    roleId: string,
    createdAt: Tempo,
    updatedAt: Tempo,
    deletedAt: TempoDeleted
  ) {
    super(
      id,
      handle,
      firstName,
      lastName,
      email,
      password,
      state,
      roleId,
      createdAt,
      updatedAt,
      deletedAt
    )
    this._salary = salary
    this._yearsExperience = yearsExperience
    this._hierarchyId = hierarchyId
    this._businessAreaId = businessAreaId
    this._educationDegreeId = educationDegreeId
    this._contractTypeId = contractTypeId
  }

  get salary(): number {
    return this._salary
  }

  get yearsExperience(): number {
    return this._yearsExperience
  }

  get hierarchyId(): string {
    return this._hierarchyId
  }

  get businessAreaId(): string {
    return this._businessAreaId
  }

  get educationDegreeId(): string {
    return this._educationDegreeId
  }

  get contractTypeId(): string {
    return this._contractTypeId
  }
}
