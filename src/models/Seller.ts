import { Collaborator } from './Collaborator.js'
import type { State, Tempo, TempoDeleted } from './User.js'

export class Seller extends Collaborator {
  private _commissionRate: number
  private _saleTypeId: string

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
    commissionRate: number,
    saleTypeId: string,
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
    this._commissionRate = commissionRate
    this._saleTypeId = saleTypeId
  }

  get commissionRate(): number {
    return this._commissionRate
  }

  get saleTypeId(): string {
    return this._saleTypeId
  }
}
