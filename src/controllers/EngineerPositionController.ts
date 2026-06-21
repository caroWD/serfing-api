import type { NextFunction, Request, Response } from 'express'
import { EngineerPositionService } from '../services/EngineerPositionService.js'
import type { BaseRequest, IdRequest } from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  EngineerPositionAlreadyExistsError,
  EngineerPositionNotFoundError,
} from '../models/index.js'
import type { sqliteEngineerPositionsTable } from '../db/schemas/sqlite.js'

const engineerPositionService = new EngineerPositionService()

export class EngineerPositionController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await engineerPositionService.add(req.body)

      res.status(201).json({
        message: 'Cargo de ingeniero agregado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof EngineerPositionAlreadyExistsError) {
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
      await engineerPositionService.edit(req.body)

      res.status(200).json({
        message: 'Cargo de ingeniero editado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof EngineerPositionNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (error instanceof EngineerPositionAlreadyExistsError) {
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
      await engineerPositionService.remove(req.body)

      res.status(200).json({
        message: 'Cargo de ingeniero eliminado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof EngineerPositionNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<(typeof sqliteEngineerPositionsTable.$inferSelect)[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const engineerPositions = await engineerPositionService.findAll()

      res.status(200).json(engineerPositions)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<
      typeof sqliteEngineerPositionsTable.$inferSelect | BaseResponse
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const engineerPosition = await engineerPositionService.findOne(req.params)

      res.status(200).json(engineerPosition)
      return
    } catch (error) {
      if (error instanceof EngineerPositionNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
