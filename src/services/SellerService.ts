import type {
  sqliteCollaboratorsTable,
  sqliteSellersTable,
  sqliteUsersTable,
} from '../db/schemas/index.js'
import { getTemporalNow } from '../helpers/index.js'
import {
  UserEmailAlreadyExistsError,
  UserHandleAlreadyExistsError,
  BusinessAreaNotFoundError,
  HierarchyNotFoundError,
  EducationDegreeNotFoundError,
  ContractTypeNotFoundError,
  SaleTypeNotFoundError,
  RoleNotFoundError,
  Seller,
  UserNotFoundError,
} from '../models/index.js'
import {
  SqliteBusinessAreaRepository,
  SqliteContractTypeRepository,
  SqliteEducationDegreeRepository,
  SqliteHierarchyRepository,
  SqliteRoleRepository,
  SqliteSaleTypeRepository,
  SqliteSellerRepository,
  SqliteUserRepository,
} from '../repositories/index.js'
import {
  addSellerRequestSchema,
  editSellerRequestSchema,
  idSchema,
  type AddSellerRequest,
  type EditSellerRequest,
  type IdRequest,
} from '../schemas/index.js'

export type SellerResponse = Omit<
  typeof sqliteUsersTable.$inferSelect,
  'password'
> &
  Omit<typeof sqliteCollaboratorsTable.$inferSelect, 'userId'> &
  Omit<typeof sqliteSellersTable.$inferSelect, 'userId'>

const userRepository = new SqliteUserRepository()
const hierarchyRepository = new SqliteHierarchyRepository()
const businessAreaRepository = new SqliteBusinessAreaRepository()
const educationDegreeRepository = new SqliteEducationDegreeRepository()
const contractTypeRepository = new SqliteContractTypeRepository()
const saleTypeRepository = new SqliteSaleTypeRepository()
const roleRepository = new SqliteRoleRepository()
const sellerRepository = new SqliteSellerRepository()

export class SellerService {
  async add(req: AddSellerRequest): Promise<void> {
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
      commissionRate,
      saleTypeId,
      state,
      roleId,
    } = await addSellerRequestSchema.parseAsync(req)

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

    const saleType = await saleTypeRepository.findOne(saleTypeId)
    if (!saleType)
      throw new SaleTypeNotFoundError('El tipo de vendedor no existe')

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await sellerRepository.add(
      new Seller(
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
        commissionRate,
        saleType.id,
        !state ? 'pending' : state,
        role.id,
        getTemporalNow(),
        getTemporalNow(),
        null
      )
    )
  }

  async edit(req: EditSellerRequest): Promise<void> {
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
      commissionRate,
      saleTypeId,
      state,
      roleId,
    } = await editSellerRequestSchema.parseAsync(req)

    const sellerToEdit = await sellerRepository.findOne(id)
    if (!sellerToEdit) throw new UserNotFoundError('El vendedor no existe')

    if (handle !== sellerToEdit.handle) {
      const handleExists =
        await userRepository.ensureHandleAlreadyExists(handle)
      if (handleExists)
        throw new UserHandleAlreadyExistsError('El nombre de usuario ya existe')
    }

    if (email !== sellerToEdit.email) {
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

    const saleType = await saleTypeRepository.findOne(saleTypeId)
    if (!saleType)
      throw new SaleTypeNotFoundError('El tipo de vendedor no existe')

    const role = await roleRepository.findOne(roleId)
    if (!role) throw new RoleNotFoundError('El rol no existe')

    return await sellerRepository.edit(
      new Seller(
        sellerToEdit.id,
        handle,
        firstName,
        lastName,
        email,
        sellerToEdit.password,
        salary,
        yearsExperience,
        hierarchy.id,
        businessArea.id,
        educationDegree.id,
        contractType.id,
        commissionRate,
        saleType.id,
        !state ? 'pending' : state,
        role.id,
        sellerToEdit.createdAt,
        getTemporalNow(),
        sellerToEdit.deletedAt
      )
    )
  }

  async remove(req: IdRequest): Promise<void> {
    const { id } = await idSchema.parseAsync(req)

    const sellerToRemove = await sellerRepository.findOne(id)
    if (!sellerToRemove) throw new UserNotFoundError('El vendedor no existe')

    return await sellerRepository.remove(sellerToRemove.id)
  }

  async findAll(): Promise<SellerResponse[]> {
    const sellers = await sellerRepository.findAll()

    return !sellers.length
      ? []
      : await Promise.all(
          sellers.map(async (seller) => await this.mapToSellerResponse(seller))
        )
  }

  async findOne(req: IdRequest): Promise<SellerResponse> {
    const { id } = await idSchema.parseAsync(req)

    const sellerFinded = await sellerRepository.findOne(id)
    if (!sellerFinded) throw new UserNotFoundError('El vendedor no existe')

    return await this.mapToSellerResponse(sellerFinded)
  }

  private async mapToSellerResponse(seller: Seller): Promise<SellerResponse> {
    return {
      id: seller.id,
      handle: seller.handle,
      firstName: seller.firstName,
      lastName: seller.lastName,
      email: seller.email,
      salary: seller.salary,
      yearsExperience: seller.yearsExperience,
      hierarcyId: seller.hierarchyId,
      businessAreaId: seller.businessAreaId,
      educationDegreeId: seller.educationDegreeId,
      contractTypeId: seller.contractTypeId,
      commissionRate: seller.commissionRate,
      saleTypeId: seller.saleTypeId,
      state: seller.state,
      roleId: seller.roleId,
      createdAt: seller.createdAt.toJSON(),
      updatedAt: seller.updatedAt.toJSON(),
      deletedAt: seller.deletedAt?.toJSON() || null,
    }
  }
}
