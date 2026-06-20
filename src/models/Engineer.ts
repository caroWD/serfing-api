import { Collaborator } from './Collaborator.js'
import type { State, Tempo, TempoDeleted } from './User.js'

export class Engineer extends Collaborator {
  private _engineerPositionId: string

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
    engineerPositionId: string,
    state: State,
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
      createdAt,
      updatedAt,
      deletedAt
    )
    this._engineerPositionId = engineerPositionId
  }

  get engineerPositionId(): string {
    return this._engineerPositionId
  }
}
