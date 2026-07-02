import type { NextFunction, Request, Response } from 'express'
import {
  CollaboratorService,
  type CollaboratorResponse,
} from '../services/index.js'
import type {
  AddCollaboratorRequest,
  EditCollaboratorRequest,
  IdRequest,
} from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  UserEmailAlreadyExistsError,
  UserHandleAlreadyExistsError,
  HierarchyNotFoundError,
  BusinessAreaNotFoundError,
  EducationDegreeNotFoundError,
  ContractTypeNotFoundError,
  RoleNotFoundError,
  UserNotFoundError,
} from '../models/index.js'

const collaboratorService = new CollaboratorService()

export class CollaboratorController {
  async add(
    req: Request<AddCollaboratorRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await collaboratorService.add(req.body)

      res
        .status(201)
        .json({ message: 'Colaborador agregado correctamente', state: true })

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
        error instanceof RoleNotFoundError
      ) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async edit(
    req: Request<EditCollaboratorRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await collaboratorService.edit(req.body)

      res
        .status(200)
        .json({ message: 'Colaborador editado correctamente', state: true })

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
      await collaboratorService.remove(req.body)

      res
        .status(200)
        .json({ message: 'Colaborador eliminado correctamente', state: true })

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
    res: Response<CollaboratorResponse[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const collaborators = await collaboratorService.findAll()

      res.status(200).json(collaborators)

      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<CollaboratorResponse | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const collaborator = await collaboratorService.findOne(req.params)

      res.status(200).json(collaborator)

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
