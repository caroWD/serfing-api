import type { NextFunction, Request, Response } from 'express'
import { PermissionService } from '../services/index.js'
import type { BaseRequest, IdRequest } from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  PermissionAlreadyExistsError,
  PermissionNotFoundError,
} from '../models/index.js'
import type { sqlitePermissionsTable } from '../db/schemas/index.js'

const permissionService = new PermissionService()

export class PermissionController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await permissionService.add(req.body)

      res
        .status(201)
        .json({ message: 'Permiso agregado correctamente', state: true })
      return
    } catch (error) {
      if (error instanceof PermissionAlreadyExistsError) {
        res.status(422).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async edit(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await permissionService.edit(req.body)

      res
        .status(200)
        .json({ message: 'Permiso editado correctamente', state: true })
      return
    } catch (error) {
      if (error instanceof PermissionNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (error instanceof PermissionAlreadyExistsError) {
        res.status(422).json({ message: error.message, state: false })
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
      await permissionService.remove(req.body)

      res
        .status(200)
        .json({ message: 'Permiso eliminado correctamente', state: true })
      return
    } catch (error) {
      if (error instanceof PermissionNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<(typeof sqlitePermissionsTable.$inferSelect)[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const permissions = await permissionService.findAll()

      res.status(200).json(permissions)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<typeof sqlitePermissionsTable.$inferSelect | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const permission = await permissionService.findOne(req.params)

      res.status(200).json(permission)
      return
    } catch (error) {
      if (error instanceof PermissionNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
