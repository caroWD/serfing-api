import type { NextFunction, Request, Response } from 'express'
import { RoleService } from '../services/index.js'
import type {
  BaseRequest,
  IdRequest,
  RolePermissionRequest,
} from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  PermissionNotFoundError,
  RoleAlreadyExistsError,
  RoleAlreadyHasThatPermissionError,
  RoleDoesNotHaveThatPermissionError,
  RoleNotFoundError,
} from '../models/index.js'
import type {
  sqlitePermissionsTable,
  sqliteRolesTable,
} from '../db/schemas/index.js'

const roleService = new RoleService()

export class RoleController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await roleService.add(req.body)

      res
        .status(201)
        .json({ message: 'Rol agregado correctamente', state: true })
      return
    } catch (error) {
      if (error instanceof RoleAlreadyExistsError) {
        res.status(422).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async addPermissionToRole(
    req: Request<RolePermissionRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await roleService.addPermissionToRole(req.body)

      res
        .status(201)
        .json({ message: 'Permiso agregado al rol correctamente', state: true })
      return
    } catch (error) {
      if (
        error instanceof RoleNotFoundError ||
        error instanceof PermissionNotFoundError
      ) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (error instanceof RoleAlreadyHasThatPermissionError) {
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
      await roleService.edit(req.body)

      res
        .status(200)
        .json({ message: 'Rol editado correctamente', state: true })
      return
    } catch (error) {
      if (error instanceof RoleNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (error instanceof RoleAlreadyExistsError) {
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
      await roleService.remove(req.body)

      res
        .status(200)
        .json({ message: 'Rol eliminado correctamente', state: true })
      return
    } catch (error) {
      if (error instanceof RoleNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async removePermissionToRole(
    req: Request<RolePermissionRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await roleService.removePermissionToRole(req.body)

      res.status(200).json({
        message: 'Permiso eliminado del rol correctamente',
        state: true,
      })
      return
    } catch (error) {
      if (
        error instanceof RoleNotFoundError ||
        error instanceof PermissionNotFoundError ||
        error instanceof RoleDoesNotHaveThatPermissionError
      ) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<(typeof sqliteRolesTable.$inferSelect)[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const roles = await roleService.findAll()

      res.status(200).json(roles)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<typeof sqliteRolesTable.$inferSelect | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const role = await roleService.findOne(req.params)

      res.status(200).json(role)
      return
    } catch (error) {
      if (error instanceof RoleNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findPermissionsForRole(
    req: Request<IdRequest>,
    res: Response<
      (typeof sqlitePermissionsTable.$inferSelect)[] | BaseResponse
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const permissions = await roleService.findPermissionsForRole(req.params)

      res.status(200).json(permissions)
      return
    } catch (error) {
      if (error instanceof RoleNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
