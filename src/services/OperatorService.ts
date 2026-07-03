import type {
  sqliteCollaboratorsTable,
  sqliteOperatorsTable,
  sqliteUsersTable,
} from '../db/schemas/index.js'
import { getTemporalNow } from '../helpers/index.js'
import {
  BusinessAreaNotFoundError,
  ContractTypeNotFoundError,
  EducationDegreeNotFoundError,
  HierarchyNotFoundError,
  Operator,
  OperatorTypeNotFoundError,
  RoleNotFoundError,
  UserEmailAlreadyExistsError,
  UserHandleAlreadyExistsError,
  UserNotFoundError,
} from '../models/index.js'
import {
  SqliteBusinessAreaRepository,
  SqliteContractTypeRepository,
  SqliteEducationDegreeRepository,
  SqliteHierarchyRepository,
  SqliteOperatorRepository,
  SqliteOperatorTypeRepository,
  SqliteRoleRepository,
  SqliteUserRepository,
} from '../repositories/index.js'
import {
  addOperatorRequestSchema,
  editOperatorRequestSchema,
  idSchema,
  type AddOperatorRequest,
  type EditOperatorRequest,
  type IdRequest,
} from '../schemas/index.js'

export type OperatorResponse = Omit<
  typeof sqliteUsersTable.$inferSelect,
  'password'
> &
  Omit<typeof sqliteCollaboratorsTable.$inferSelect, 'userId'> &
  Omit<typeof sqliteOperatorsTable.$inferSelect, 'userId'>

const userRepository = new SqliteUserRepository()
const hierarchyRepository = new SqliteHierarchyRepository()
const businessAreaRepository = new SqliteBusinessAreaRepository()
const educationDegreeRepository = new SqliteEducationDegreeRepository()
const contractTypeRepository = new SqliteContractTypeRepository()
const operatorTypeRepository = new SqliteOperatorTypeRepository()
const roleRepository = new SqliteRoleRepository()
const operatorRepository = new SqliteOperatorRepository()

export class OperatorService {
  async add(req: AddOperatorRequest): Promise<void> {
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
      operatorTypeId,
      state,
      roleId,
    } = await addOperatorRequestSchema.parseAsync(req)

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

    const operatorType = await operatorTypeRepository.findOne(operatorTypeId)
    if (!operatorType)
      throw new OperatorTypeNotFoundError('El tipo de operador no existe')

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await operatorRepository.add(
      new Operator(
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
        operatorType.id,
        !state ? 'pending' : state,
        role.id,
        getTemporalNow(),
        getTemporalNow(),
        null
      )
    )
  }

  async edit(req: EditOperatorRequest): Promise<void> {
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
      operatorTypeId,
      state,
      roleId,
    } = await editOperatorRequestSchema.parseAsync(req)

    const operatorToEdit = await operatorRepository.findOne(id)
    if (!operatorToEdit) throw new UserNotFoundError('El operador no existe')

    if (handle !== operatorToEdit.handle) {
      const handleExists =
        await userRepository.ensureHandleAlreadyExists(handle)
      if (handleExists)
        throw new UserHandleAlreadyExistsError('El nombre de usuario ya existe')
    }

    if (email !== operatorToEdit.email) {
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

    const operatorType = await operatorTypeRepository.findOne(operatorTypeId)
    if (!operatorType)
      throw new OperatorTypeNotFoundError('El tipo de operador no existe')

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await operatorRepository.edit(
      new Operator(
        operatorToEdit.id,
        handle,
        firstName,
        lastName,
        email,
        operatorToEdit.password,
        salary,
        yearsExperience,
        hierarchy.id,
        businessArea.id,
        educationDegree.id,
        contractType.id,
        operatorType.id,
        !state ? 'pending' : state,
        role.id,
        operatorToEdit.createdAt,
        getTemporalNow(),
        operatorToEdit.deletedAt
      )
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const operatorToRemove = await operatorRepository.findOne(id)
    if (!operatorToRemove) throw new UserNotFoundError('El operador no existe')

    return await operatorRepository.remove(operatorToRemove.id)
  }

  async findAll(): Promise<OperatorResponse[]> {
    const operators = await operatorRepository.findAll()

    return !operators.length
      ? []
      : await Promise.all(
          operators.map(
            async (operator) => await this.mapToOperatorResponse(operator)
          )
        )
  }

  async findOne(req: IdRequest): Promise<OperatorResponse> {
    const { id } = await idSchema.parseAsync(req)

    const operator = await operatorRepository.findOne(id)
    if (!operator) throw new UserNotFoundError('El operador no existe')

    return await this.mapToOperatorResponse(operator)
  }

  private async mapToOperatorResponse(
    operator: Operator
  ): Promise<OperatorResponse> {
    return {
      id: operator.id,
      handle: operator.handle,
      firstName: operator.firstName,
      lastName: operator.lastName,
      email: operator.email,
      salary: operator.salary,
      yearsExperience: operator.yearsExperience,
      hierarcyId: operator.hierarchyId,
      businessAreaId: operator.businessAreaId,
      educationDegreeId: operator.educationDegreeId,
      contractTypeId: operator.contractTypeId,
      operatorTypeId: operator.operatorTypeId,
      state: operator.state,
      roleId: operator.roleId,
      createdAt: operator.createdAt.toJSON(),
      updatedAt: operator.updatedAt.toJSON(),
      deletedAt: operator.deletedAt?.toJSON() || null,
    }
  }
}
