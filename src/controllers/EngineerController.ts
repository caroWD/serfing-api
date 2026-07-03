import type { NextFunction, Request, Response } from 'express'
import { EngineerService, type EngineerResponse } from '../services/index.js'
import type {
  AddEngineerRequest,
  EditEngineerRequest,
  IdRequest,
} from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  BusinessAreaNotFoundError,
  ContractTypeNotFoundError,
  EducationDegreeNotFoundError,
  EngineerPositionNotFoundError,
  HierarchyNotFoundError,
  RoleNotFoundError,
  UserEmailAlreadyExistsError,
  UserHandleAlreadyExistsError,
  UserNotFoundError,
} from '../models/index.js'

const engineerService = new EngineerService()

export class EngineerController {
  async add(
    req: Request<AddEngineerRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await engineerService.add(req.body)

      res
        .status(201)
        .json({ message: 'Ingeniero agregado correctamente', state: true })

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
        error instanceof EngineerPositionNotFoundError ||
        error instanceof RoleNotFoundError
      ) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async edit(
    req: Request<EditEngineerRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await engineerService.edit(req.body)

      res
        .status(200)
        .json({ message: 'Ingeniero editado correctamente', state: true })

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
        error instanceof EngineerPositionNotFoundError ||
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
      await engineerService.remove(req.body)

      res
        .status(200)
        .json({ message: 'Ingeniero eliminado correctamente', state: true })

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
    res: Response<EngineerResponse[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const engineers = await engineerService.findAll()

      res.status(200).json(engineers)

      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<EngineerResponse | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const engineer = await engineerService.findOne(req.params)

      res.status(200).json(engineer)

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
