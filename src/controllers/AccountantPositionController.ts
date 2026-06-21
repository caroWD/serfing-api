import type { NextFunction, Request, Response } from 'express'
import { AccountantPositionService } from '../services/index.js'
import type { BaseRequest, IdRequest } from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  AccountantPositionAlreadyExistsError,
  AccountantPositionNotFoundError,
} from '../models/index.js'
import type { sqliteAccountantPositionsTable } from '../db/schemas/index.js'

const accountantPositionService = new AccountantPositionService()

export class AccountantPositionController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await accountantPositionService.add(req.body)

      res.status(201).json({
        message: 'Cargo de contador agregado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof AccountantPositionAlreadyExistsError) {
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
      await accountantPositionService.edit(req.body)

      res.status(200).json({
        message: 'Cargo de contador editado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof AccountantPositionNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }
      if (error instanceof AccountantPositionAlreadyExistsError) {
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
      await accountantPositionService.remove(req.body)

      res.status(200).json({
        message: 'Cargo de contador eliminado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof AccountantPositionNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<(typeof sqliteAccountantPositionsTable.$inferSelect)[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const accountantPositions = await accountantPositionService.findAll()

      res.status(200).json(accountantPositions)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<
      typeof sqliteAccountantPositionsTable.$inferSelect | BaseResponse
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const accountantPosition = await accountantPositionService.findOne(
        req.params
      )

      res.status(200).json(accountantPosition)
      return
    } catch (error) {
      if (error instanceof AccountantPositionNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
