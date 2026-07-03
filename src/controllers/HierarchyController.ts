import type { NextFunction, Request, Response } from 'express'
import { HierarchyService } from '../services/index.js'
import type { BaseRequest, IdRequest } from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  HierarchyAlreadyExistsError,
  HierarchyNotFoundError,
} from '../models/index.js'
import type { sqliteHierarciesTable } from '../db/schemas/sqlite.js'

const hierarchyService = new HierarchyService()

export class HierarchyController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await hierarchyService.add(req.body)

      res
        .status(201)
        .json({ message: 'Jerarquía agregada correctamente', state: true })

      return
    } catch (error) {
      if (error instanceof HierarchyAlreadyExistsError) {
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
      await hierarchyService.edit(req.body)

      res
        .status(200)
        .json({ message: 'Jerarquía editada correctamente', state: true })

      return
    } catch (error) {
      if (error instanceof HierarchyNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (error instanceof HierarchyAlreadyExistsError) {
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
      await hierarchyService.remove(req.body)

      res
        .status(200)
        .json({ message: 'Jerarquía eliminada correctamente', state: true })

      return
    } catch (error) {
      if (error instanceof HierarchyNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<(typeof sqliteHierarciesTable.$inferSelect)[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const hierarcies = await hierarchyService.findAll()

      res.status(200).json(hierarcies)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<typeof sqliteHierarciesTable.$inferSelect | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const hierarchy = await hierarchyService.findOne(req.params)

      res.status(200).json(hierarchy)
      return
    } catch (error) {
      if (error instanceof HierarchyNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
