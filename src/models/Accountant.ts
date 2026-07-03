import { Collaborator } from './Collaborator.js'
import type { State, Tempo, TempoDeleted } from './User.js'

export class Accountant extends Collaborator {
  private _accountantPositionId: string

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
    accountantPositionId: string,
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
      salary,
      yearsExperience,
      hierarchyId,
      businessAreaId,
      educationDegreeId,
      contractTypeId,
      state,
      roleId,
      createdAt,
      updatedAt,
      deletedAt
    )
    this._accountantPositionId = accountantPositionId
  }

  get accountantPositionId(): string {
    return this._accountantPositionId
  }
}
