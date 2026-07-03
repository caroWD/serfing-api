import type {
  sqliteCollaboratorsTable,
  sqliteEngineersTable,
  sqliteUsersTable,
} from '../db/schemas/index.js'
import { getTemporalNow } from '../helpers/index.js'
import {
  BusinessAreaNotFoundError,
  ContractTypeNotFoundError,
  EducationDegreeNotFoundError,
  Engineer,
  EngineerPositionNotFoundError,
  HierarchyNotFoundError,
  RoleNotFoundError,
  UserEmailAlreadyExistsError,
  UserHandleAlreadyExistsError,
  UserNotFoundError,
} from '../models/index.js'
import {
  SqliteBusinessAreaRepository,
  SqliteContractTypeRepository,
  SqliteEducationDegreeRepository,
  SqliteEngineerPositionRepository,
  SqliteEngineerRepository,
  SqliteHierarchyRepository,
  SqliteRoleRepository,
  SqliteUserRepository,
} from '../repositories/index.js'
import {
  addEngineerRequestSchema,
  editEngineerRequestSchema,
  idSchema,
  type AddEngineerRequest,
  type EditEngineerRequest,
  type IdRequest,
} from '../schemas/index.js'

export type EngineerResponse = Omit<
  typeof sqliteUsersTable.$inferSelect,
  'password'
> &
  Omit<typeof sqliteCollaboratorsTable.$inferSelect, 'userId'> &
  Omit<typeof sqliteEngineersTable.$inferSelect, 'userId'>

const userRepository = new SqliteUserRepository()
const hierarchyRepository = new SqliteHierarchyRepository()
const businessAreaRepository = new SqliteBusinessAreaRepository()
const educationDegreeRepository = new SqliteEducationDegreeRepository()
const contractTypeRepository = new SqliteContractTypeRepository()
const engineerPositionRepository = new SqliteEngineerPositionRepository()
const roleRepository = new SqliteRoleRepository()
const engineerRepository = new SqliteEngineerRepository()

export class EngineerService {
  async add(req: AddEngineerRequest): Promise<void> {
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
      engineerPositionId,
      roleId,
      state,
    } = await addEngineerRequestSchema.parseAsync(req)

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

    const engineerPosition =
      await engineerPositionRepository.findOne(engineerPositionId)
    if (!engineerPosition)
      throw new EngineerPositionNotFoundError('El cargo de ingeniero no existe')

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await engineerRepository.add(
      new Engineer(
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
        engineerPosition.id,
        !state ? 'pending' : state,
        role.id,
        getTemporalNow(),
        getTemporalNow(),
        null
      )
    )
  }

  async edit(req: EditEngineerRequest): Promise<void> {
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
      engineerPositionId,
      roleId,
      state,
    } = await editEngineerRequestSchema.parseAsync(req)

    const engineerToEdit = await userRepository.findOne(id)
    if (!engineerToEdit) throw new UserNotFoundError('El ingeniero no existe')

    if (handle !== engineerToEdit.handle) {
      const handleExists =
        await userRepository.ensureHandleAlreadyExists(handle)
      if (handleExists)
        throw new UserHandleAlreadyExistsError('El nombre de usuario ya existe')
    }

    if (email !== engineerToEdit.email) {
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

    const engineerPosition =
      await engineerPositionRepository.findOne(engineerPositionId)
    if (!engineerPosition)
      throw new EngineerPositionNotFoundError('El cargo de ingeniero no existe')

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await engineerRepository.edit(
      new Engineer(
        engineerToEdit.id,
        handle,
        firstName,
        lastName,
        email,
        engineerToEdit.password,
        salary,
        yearsExperience,
        hierarchy.id,
        businessArea.id,
        educationDegree.id,
        contractType.id,
        engineerPosition.id,
        !state ? 'pending' : state,
        role.id,
        engineerToEdit.createdAt,
        getTemporalNow(),
        engineerToEdit.deletedAt
      )
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const engineerToRemove = await engineerRepository.findOne(id)
    if (!engineerToRemove) throw new UserNotFoundError('El ingeniero no existe')

    return await engineerRepository.remove(engineerToRemove.id)
  }

  async findAll(): Promise<EngineerResponse[]> {
    const engineers = await engineerRepository.findAll()

    return !engineers.length
      ? []
      : await Promise.all(
          engineers.map(
            async (engineer) => await this.mapToEngineerResponse(engineer)
          )
        )
  }

  async findOne(req: IdRequest): Promise<EngineerResponse> {
    const { id } = await idSchema.parseAsync(req)

    const engineerFinded = await engineerRepository.findOne(id)
    if (!engineerFinded) throw new UserNotFoundError('El ingeniero no existe')

    return await this.mapToEngineerResponse(engineerFinded)
  }

  private async mapToEngineerResponse(
    engineer: Engineer
  ): Promise<EngineerResponse> {
    return {
      id: engineer.id,
      handle: engineer.handle,
      firstName: engineer.firstName,
      lastName: engineer.lastName,
      email: engineer.email,
      salary: engineer.salary,
      yearsExperience: engineer.yearsExperience,
      hierarcyId: engineer.hierarchyId,
      businessAreaId: engineer.businessAreaId,
      educationDegreeId: engineer.educationDegreeId,
      contractTypeId: engineer.contractTypeId,
      engineerPositionId: engineer.engineerPositionId,
      roleId: engineer.roleId,
      state: engineer.state,
      createdAt: engineer.createdAt.toJSON(),
      updatedAt: engineer.updatedAt.toJSON(),
      deletedAt: engineer.deletedAt?.toJSON() || null,
    }
  }
}
