import type { NextFunction, Request, Response } from 'express'
import { SellerService, type SellerResponse } from '../services/index.js'
import type {
  AddSellerRequest,
  EditSellerRequest,
  IdRequest,
} from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  UserEmailAlreadyExistsError,
  UserHandleAlreadyExistsError,
  UserNotFoundError,
  HierarchyNotFoundError,
  BusinessAreaNotFoundError,
  EducationDegreeNotFoundError,
  ContractTypeNotFoundError,
  SaleTypeNotFoundError,
  RoleNotFoundError,
} from '../models/index.js'

const sellerService = new SellerService()

export class SellerController {
  async add(
    req: Request<AddSellerRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await sellerService.add(req.body)

      res
        .status(201)
        .json({ message: 'Vendedor agregado correctamente', state: true })

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
        error instanceof SaleTypeNotFoundError ||
        error instanceof RoleNotFoundError
      ) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async edit(
    req: Request<EditSellerRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await sellerService.edit(req.body)

      res
        .status(200)
        .json({ message: 'Vendedor editado correctamente', state: true })

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
        error instanceof SaleTypeNotFoundError ||
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
      await sellerService.remove(req.body)

      res
        .status(200)
        .json({ message: 'Vendedor eliminado correctamente', state: true })

      return
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<SellerResponse[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const sellers = await sellerService.findAll()

      res.status(200).json(sellers)

      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<SellerResponse | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const seller = await sellerService.findOne(req.params)

      res.status(200).json(seller)

      return
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
