import type { NextFunction, Request, Response } from 'express'
import type { BaseRequest, IdRequest } from '../schemas/index.js'
import { BusinessAreaService } from '../services/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  BusinessAreaAlreadyExistsError,
  BusinessAreaNotFoundError,
} from '../models/BusinessArea.js'
import type { sqliteBusinessAreasTable } from '../db/schemas/sqlite.js'

const businessAreaService = new BusinessAreaService()

export class BusinessAreaController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await businessAreaService.add(req.body)

      res.status(201).json({
        message: 'Área de trabajo agregada correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof BusinessAreaAlreadyExistsError) {
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
      await businessAreaService.edit(req.body)

      res.status(200).json({
        message: 'Área de trabajo editado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof BusinessAreaNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (error instanceof BusinessAreaAlreadyExistsError) {
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
      await businessAreaService.remove(req.body)

      res.status(200).json({
        message: 'Área de trabajo eliminado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof BusinessAreaNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<(typeof sqliteBusinessAreasTable.$inferSelect)[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const businessAreas = await businessAreaService.findAll()

      res.status(200).json(businessAreas)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<typeof sqliteBusinessAreasTable.$inferSelect | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const businessArea = await businessAreaService.findOne(req.params)

      res.status(200).json(businessArea)
      return
    } catch (error) {
      if (error instanceof BusinessAreaNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
