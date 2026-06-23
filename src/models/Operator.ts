import { Collaborator } from './Collaborator.js'
import type { State, Tempo, TempoDeleted } from './User.js'

export class Operator extends Collaborator {
  private _operatorTypeId: string

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
    operatorTypeId: string,
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
    this._operatorTypeId = operatorTypeId
  }

  get operatorTypeId(): string {
    return this._operatorTypeId
  }
}
