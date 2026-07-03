import type { NextFunction, Request, Response } from 'express'
import {
  AccountantService,
  type AccountantResponse,
} from '../services/index.js'
import type {
  AddAccountantRequest,
  EditAccountantRequest,
  IdRequest,
} from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
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

const accountantService = new AccountantService()

export class AccountantController {
  async add(
    req: Request<AddAccountantRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await accountantService.add(req.body)

      res
        .status(201)
        .json({ message: 'Contador agregado correctamente', state: true })

      return
    } catch (error) {
      if (
        error instanceof UserHandleAlreadyExistsError ||
        error instanceof UserEmailAlreadyExistsError
      ) {
        res.status(422).json({ message: error.message, state: false })
        return
      }

      if (
        error instanceof HierarchyNotFoundError ||
        error instanceof BusinessAreaNotFoundError ||
        error instanceof EducationDegreeNotFoundError ||
        error instanceof ContractTypeNotFoundError ||
        error instanceof AccountantPositionNotFoundError ||
        error instanceof RoleNotFoundError
      ) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async edit(
    req: Request<EditAccountantRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await accountantService.edit(req.body)

      res
        .status(200)
        .json({ message: 'Contador editado correctamente', state: true })

      return
    } catch (error) {
      if (
        error instanceof UserHandleAlreadyExistsError ||
        error instanceof UserEmailAlreadyExistsError
      ) {
        res.status(422).json({ message: error.message, state: false })
        return
      }

      if (
        error instanceof HierarchyNotFoundError ||
        error instanceof BusinessAreaNotFoundError ||
        error instanceof EducationDegreeNotFoundError ||
        error instanceof ContractTypeNotFoundError ||
        error instanceof AccountantPositionNotFoundError ||
        error instanceof RoleNotFoundError ||
        error instanceof UserNotFoundError
      ) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async remove(
    req: Request<IdRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await accountantService.remove(req.body)

      res
        .status(200)
        .json({ message: 'Contador eliminado correctamente', state: true })

      return
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<AccountantResponse[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const accountants = await accountantService.findAll()

      res.status(200).json(accountants)

      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<AccountantResponse | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const accountant = await accountantService.findOne(req.params)

      res.status(200).json(accountant)

      return
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
      }

      next(error)
    }
  }
}
