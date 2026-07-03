import type { NextFunction, Request, Response } from 'express'
import { OperatorService, type OperatorResponse } from '../services/index.js'
import type {
  AddOperatorRequest,
  EditOperatorRequest,
  IdRequest,
} from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  BusinessAreaNotFoundError,
  ContractTypeNotFoundError,
  EducationDegreeNotFoundError,
  HierarchyNotFoundError,
  OperatorTypeNotFoundError,
  RoleNotFoundError,
  UserEmailAlreadyExistsError,
  UserHandleAlreadyExistsError,
  UserNotFoundError,
} from '../models/index.js'

const operatorService = new OperatorService()

export class OperatorController {
  async add(
    req: Request<AddOperatorRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await operatorService.add(req.body)

      res
        .status(201)
        .json({ message: 'Operador agregado correctamente', state: true })

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
        error instanceof OperatorTypeNotFoundError ||
        error instanceof RoleNotFoundError
      ) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async edit(
    req: Request<EditOperatorRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await operatorService.edit(req.body)

      res
        .status(200)
        .json({ message: 'Operador editado correctamente', state: true })

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
        error instanceof OperatorTypeNotFoundError ||
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
      await operatorService.remove(req.body)

      res
        .status(200)
        .json({ message: 'Operador eliminado correctamente', state: true })

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
    res: Response<OperatorResponse[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const operators = await operatorService.findAll()

      res.status(200).json(operators)

      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<OperatorResponse | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const operator = await operatorService.findOne(req.params)

      res.status(200).json(operator)

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
