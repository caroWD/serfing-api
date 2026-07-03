import type {
  sqliteAccountantsTable,
  sqliteCollaboratorsTable,
  sqliteUsersTable,
} from '../db/schemas/index.js'
import { getTemporalNow } from '../helpers/index.js'
import {
  Accountant,
  AccountantPositionNotFoundError,
  BusinessAreaNotFoundError,
  ContractTypeNotFoundError,
  EducationDegreeNotFoundError,
  HierarchyNotFoundError,
  RoleNotFoundError,
  UserEmailAlreadyExistsError,
  UserHandleAlreadyExistsError,
  UserNotFoundError,
} from '../models/index.js'
import {
  SqliteAccountantPositionRepository,
  SqliteAccountantRepository,
  SqliteBusinessAreaRepository,
  SqliteContractTypeRepository,
  SqliteEducationDegreeRepository,
  SqliteHierarchyRepository,
  SqliteRoleRepository,
  SqliteUserRepository,
} from '../repositories/index.js'
import {
  addAccountantRequestSchema,
  editAccountantRequestSchema,
  idSchema,
  type AddAccountantRequest,
  type EditAccountantRequest,
  type IdRequest,
} from '../schemas/index.js'

export type AccountantResponse = Omit<
  typeof sqliteUsersTable.$inferSelect,
  'password'
> &
  Omit<typeof sqliteCollaboratorsTable.$inferSelect, 'userId'> &
  Omit<typeof sqliteAccountantsTable.$inferSelect, 'userId'>

const userRepository = new SqliteUserRepository()
const hierarchyRepository = new SqliteHierarchyRepository()
const businessAreaRepository = new SqliteBusinessAreaRepository()
const educationDegreeRepository = new SqliteEducationDegreeRepository()
const contractTypeRepository = new SqliteContractTypeRepository()
const accountantPositionRepository = new SqliteAccountantPositionRepository()
const roleRepository = new SqliteRoleRepository()
const accountantRepository = new SqliteAccountantRepository()

export class AccountantService {
  async add(req: AddAccountantRequest): Promise<void> {
    const {
      id,
      handle,
      firstName,
      lastName,
      email,
      password,
      salary,
      yearsExperience,
      hierarcyId,
      businessAreaId,
      educationDegreeId,
      contractTypeId,
      accountantPositionId,
      state,
      roleId,
    } = await addAccountantRequestSchema.parseAsync(req)

    const handleExists = await userRepository.ensureHandleAlreadyExists(handle)
    if (handleExists)
      throw new UserHandleAlreadyExistsError('El nombre de usuario ya existe')

    const emailExists = await userRepository.ensureEmailAlreadyExists(email)
    if (emailExists)
      throw new UserEmailAlreadyExistsError('El correo electrónico ya existe')

    const hierarchy = await hierarchyRepository.findOne(hierarcyId)
    if (!hierarchy) throw new HierarchyNotFoundError('La jerarquía no existe')

    const businessArea = await businessAreaRepository.findOne(businessAreaId)
    if (!businessArea)
      throw new BusinessAreaNotFoundError('El área de trabajo no existe')

    const educationDegree =
      await educationDegreeRepository.findOne(educationDegreeId)
    if (!educationDegree)
      throw new EducationDegreeNotFoundError('El grado de educación no existe')

    const contractType = await contractTypeRepository.findOne(contractTypeId)
    if (!contractType)
      throw new ContractTypeNotFoundError('El tipo de contrato no existe')

    const accountantPosition =
      await accountantPositionRepository.findOne(accountantPositionId)
    if (!accountantPosition)
      throw new AccountantPositionNotFoundError(
        'El cargo de contador no existe'
      )

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await accountantRepository.add(
      new Accountant(
        id,
        handle,
        firstName,
        lastName,
        email,
        password,
        salary,
        yearsExperience,
        hierarchy.id,
        businessArea.id,
        educationDegree.id,
        contractType.id,
        accountantPosition.id,
        !state ? 'pending' : state,
        role.id,
        getTemporalNow(),
        getTemporalNow(),
        null
      )
    )
  }

  async edit(req: EditAccountantRequest): Promise<void> {
    const {
      id,
      handle,
      firstName,
      lastName,
      email,
      salary,
      yearsExperience,
      hierarcyId,
      businessAreaId,
      educationDegreeId,
      contractTypeId,
      accountantPositionId,
      state,
      roleId,
    } = await editAccountantRequestSchema.parseAsync(req)

    const accountantToEdit = await accountantRepository.findOne(id)
    if (!accountantToEdit) throw new UserNotFoundError('El contador no existe')

    if (handle !== accountantToEdit.handle) {
      const handleExists =
        await userRepository.ensureHandleAlreadyExists(handle)
      if (handleExists)
        throw new UserHandleAlreadyExistsError('El nombre de usuario ya existe')
    }

    if (email !== accountantToEdit.email) {
      const emailExists = await userRepository.ensureEmailAlreadyExists(email)
      if (emailExists)
        throw new UserEmailAlreadyExistsError('El correo electrónico ya existe')
    }

    const hierarchy = await hierarchyRepository.findOne(hierarcyId)
    if (!hierarchy) throw new HierarchyNotFoundError('La jerarquía no existe')

    const businessArea = await businessAreaRepository.findOne(businessAreaId)
    if (!businessArea)
      throw new BusinessAreaNotFoundError('El área de trabajo no existe')

    const educationDegree =
      await educationDegreeRepository.findOne(educationDegreeId)
    if (!educationDegree)
      throw new EducationDegreeNotFoundError('El grado de educación no existe')

    const contractType = await contractTypeRepository.findOne(contractTypeId)
    if (!contractType)
      throw new ContractTypeNotFoundError('El tipo de contrato no existe')

    const accountantPosition =
      await accountantPositionRepository.findOne(accountantPositionId)
    if (!accountantPosition)
      throw new AccountantPositionNotFoundError(
        'El cargo de contador no existe'
      )

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await accountantRepository.edit(
      new Accountant(
        accountantToEdit.id,
        handle,
        firstName,
        lastName,
        email,
        accountantToEdit.password,
        salary,
        yearsExperience,
        hierarchy.id,
        businessArea.id,
        educationDegree.id,
        contractType.id,
        accountantPosition.id,
        !state ? 'pending' : state,
        role.id,
        accountantToEdit.createdAt,
        getTemporalNow(),
        accountantToEdit.deletedAt
      )
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const accountantToRemove = await accountantRepository.findOne(id)
    if (!accountantToRemove)
      throw new UserNotFoundError('El contador no existe')

    return await accountantRepository.remove(accountantToRemove.id)
  }

  async findAll(): Promise<AccountantResponse[]> {
    const accountants = await accountantRepository.findAll()

    return !accountants.length
      ? []
      : await Promise.all(
          accountants.map(
            async (accountant) => await this.mapToAccountantResponse(accountant)
          )
        )
  }

  async findOne(req: IdRequest): Promise<AccountantResponse> {
    const { id } = await idSchema.parseAsync(req)

    const accountantFinded = await accountantRepository.findOne(id)
    if (!accountantFinded) throw new UserNotFoundError('El contador no existe')

    return await this.mapToAccountantResponse(accountantFinded)
  }

  private async mapToAccountantResponse(
    accountant: Accountant
  ): Promise<AccountantResponse> {
    return {
      id: accountant.id,
      handle: accountant.handle,
      firstName: accountant.firstName,
      lastName: accountant.lastName,
      email: accountant.email,
      salary: accountant.salary,
      yearsExperience: accountant.yearsExperience,
      hierarcyId: accountant.hierarchyId,
      businessAreaId: accountant.businessAreaId,
      educationDegreeId: accountant.educationDegreeId,
      contractTypeId: accountant.contractTypeId,
      accountantPositionId: accountant.accountantPositionId,
      state: accountant.state,
      roleId: accountant.roleId,
      createdAt: accountant.createdAt.toJSON(),
      updatedAt: accountant.updatedAt.toJSON(),
      deletedAt: accountant.deletedAt?.toJSON() || null,
    }
  }
}
