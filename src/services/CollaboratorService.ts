import {
  sqliteCollaboratorsTable,
  type sqliteUsersTable,
} from '../db/schemas/sqlite.js'
import { getTemporalNow } from '../helpers/index.js'
import {
  BusinessAreaNotFoundError,
  Collaborator,
  ContractTypeNotFoundError,
  EducationDegreeNotFoundError,
  HierarchyNotFoundError,
  RoleNotFoundError,
  UserEmailAlreadyExistsError,
  UserHandleAlreadyExistsError,
  UserNotFoundError,
} from '../models/index.js'
import {
  SqliteBusinessAreaRepository,
  SqliteCollaboratorRepository,
  SqliteContractTypeRepository,
  SqliteEducationDegreeRepository,
  SqliteHierarchyRepository,
  SqliteRoleRepository,
  SqliteUserRepository,
} from '../repositories/index.js'
import {
  addCollaboratorRequestSchema,
  editCollaboratorRequestSchema,
  idSchema,
  type AddCollaboratorRequest,
  type EditCollaboratorRequest,
  type IdRequest,
} from '../schemas/index.js'

const userRepository = new SqliteUserRepository()
const roleRepository = new SqliteRoleRepository()
const hierarchyRepository = new SqliteHierarchyRepository()
const businessAreaRepository = new SqliteBusinessAreaRepository()
const educationDegreeRepository = new SqliteEducationDegreeRepository()
const contractTypeRepository = new SqliteContractTypeRepository()
const collaboratorRepository = new SqliteCollaboratorRepository()

export type CollaboratorResponse = Omit<
  typeof sqliteUsersTable.$inferSelect,
  'password'
> &
  Omit<typeof sqliteCollaboratorsTable.$inferSelect, 'userId'>

export class CollaboratorService {
  async add(req: AddCollaboratorRequest): Promise<void> {
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
      state,
      roleId,
    } = await addCollaboratorRequestSchema.parseAsync(req)

    const handleExists = await userRepository.ensureHandleAlreadyExists(handle)
    if (handleExists)
      throw new UserHandleAlreadyExistsError(
        'El nombre del colaborador ya existe'
      )

    const emailExists = await userRepository.ensureEmailAlreadyExists(email)
    if (emailExists)
      throw new UserEmailAlreadyExistsError('El correo electrónico ya existe')

    const hierarchy = await hierarchyRepository.findOne(hierarcyId)
    if (!hierarchy) throw new HierarchyNotFoundError('La jerarquía no existe')

    const businessArea = await businessAreaRepository.findOne(businessAreaId)
    if (!businessArea)
      throw new BusinessAreaNotFoundError('El área de trabajo no eexiste')

    const educationDegree =
      await educationDegreeRepository.findOne(educationDegreeId)
    if (!educationDegree)
      throw new EducationDegreeNotFoundError('El grado de educación no existe')

    const contractType = await contractTypeRepository.findOne(contractTypeId)
    if (!contractType)
      throw new ContractTypeNotFoundError('El tipo de contrato no existe')

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await collaboratorRepository.add(
      new Collaborator(
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
        !state ? 'pending' : state,
        role.id,
        getTemporalNow(),
        getTemporalNow(),
        null
      )
    )
  }

  async edit(req: EditCollaboratorRequest): Promise<void> {
    const {
      id,
      handle,
      firstName,
      lastName,
      email,
      state,
      roleId,
      salary,
      yearsExperience,
      hierarcyId,
      businessAreaId,
      educationDegreeId,
      contractTypeId,
    } = await editCollaboratorRequestSchema.parseAsync(req)

    const collaboratorToEdit = await collaboratorRepository.findOne(id)
    if (!collaboratorToEdit)
      throw new UserNotFoundError('El colaborador no existe')

    if (handle !== collaboratorToEdit.handle) {
      const handleExists =
        await userRepository.ensureHandleAlreadyExists(handle)
      if (handleExists)
        throw new UserHandleAlreadyExistsError(
          'El nombre del colaborador ya existe'
        )
    }

    if (email !== collaboratorToEdit.email) {
      const emailExists = await userRepository.ensureEmailAlreadyExists(email)
      if (emailExists)
        throw new UserEmailAlreadyExistsError('El correo electrónico ya existe')
    }

    const hierarchy = await hierarchyRepository.findOne(hierarcyId)
    if (!hierarchy) throw new HierarchyNotFoundError('La jerarquía no existe')

    const businessArea = await businessAreaRepository.findOne(businessAreaId)
    if (!businessArea)
      throw new BusinessAreaNotFoundError('El área de trabajo no eexiste')

    const educationDegree =
      await educationDegreeRepository.findOne(educationDegreeId)
    if (!educationDegree)
      throw new EducationDegreeNotFoundError('El grado de educación no existe')

    const contractType = await contractTypeRepository.findOne(contractTypeId)
    if (!contractType)
      throw new ContractTypeNotFoundError('El tipo de contrato no existe')

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await collaboratorRepository.edit(
      new Collaborator(
        collaboratorToEdit.id,
        handle,
        firstName,
        lastName,
        email,
        collaboratorToEdit.password,
        salary,
        yearsExperience,
        hierarchy.id,
        businessArea.id,
        educationDegree.id,
        contractType.id,
        !state ? 'pending' : state,
        role.id,
        collaboratorToEdit.createdAt,
        getTemporalNow(),
        collaboratorToEdit.deletedAt
      )
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const collaboratorToRemove = await collaboratorRepository.findOne(id)
    if (!collaboratorToRemove)
      throw new UserNotFoundError('El colaborador no existe')

    return await collaboratorRepository.remove(collaboratorToRemove.id)
  }

  async findAll(): Promise<CollaboratorResponse[]> {
    const collaborators = await collaboratorRepository.findAll()

    return !collaborators.length
      ? []
      : collaborators.map((collaborator) => ({
          id: collaborator.id,
          handle: collaborator.handle,
          firstName: collaborator.firstName,
          lastName: collaborator.lastName,
          email: collaborator.email,
          salary: collaborator.salary,
          yearsExperience: collaborator.yearsExperience,
          hierarcyId: collaborator.hierarchyId,
          businessAreaId: collaborator.businessAreaId,
          educationDegreeId: collaborator.educationDegreeId,
          contractTypeId: collaborator.contractTypeId,
          state: collaborator.state,
          roleId: collaborator.roleId,
          createdAt: collaborator.createdAt.toJSON(),
          updatedAt: collaborator.updatedAt.toJSON(),
          deletedAt: collaborator.deletedAt?.toJSON() || null,
        }))
  }

  async findOne(req: IdRequest): Promise<CollaboratorResponse> {
    const { id } = await idSchema.parseAsync(req)

    const collaboratorToFinded = await collaboratorRepository.findOne(id)
    if (!collaboratorToFinded)
      throw new UserNotFoundError('El colaborador no existe')

    return {
      id: collaboratorToFinded.id,
      handle: collaboratorToFinded.handle,
      firstName: collaboratorToFinded.firstName,
      lastName: collaboratorToFinded.lastName,
      email: collaboratorToFinded.email,
      salary: collaboratorToFinded.salary,
      yearsExperience: collaboratorToFinded.yearsExperience,
      hierarcyId: collaboratorToFinded.hierarchyId,
      businessAreaId: collaboratorToFinded.businessAreaId,
      educationDegreeId: collaboratorToFinded.educationDegreeId,
      contractTypeId: collaboratorToFinded.contractTypeId,
      state: collaboratorToFinded.state,
      roleId: collaboratorToFinded.roleId,
      createdAt: collaboratorToFinded.createdAt.toJSON(),
      updatedAt: collaboratorToFinded.updatedAt.toJSON(),
      deletedAt: collaboratorToFinded.deletedAt?.toJSON() || null,
    }
  }
}
