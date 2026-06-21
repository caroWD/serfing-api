import type { NextFunction, Request, Response } from 'express'
import { OperatorTypeService } from '../services/index.js'
import type { BaseRequest, IdRequest } from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  OperatorTypeAlreadyExistsError,
  OperatorTypeNotFoundError,
} from '../models/index.js'
import type { sqliteOperatorTypesTable } from '../db/schemas/sqlite.js'

const operatorTypeService = new OperatorTypeService()

export class OperatorTypeController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await operatorTypeService.add(req.body)

      res.status(201).json({
        message: 'Tipo de operario agregado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof OperatorTypeAlreadyExistsError) {
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
      await operatorTypeService.edit(req.body)

      res.status(200).json({
        message: 'Tipo de operario editado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof OperatorTypeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (error instanceof OperatorTypeAlreadyExistsError) {
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
      await operatorTypeService.remove(req.body)

      res.status(200).json({
        message: 'Tipo de operario eliminado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof OperatorTypeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<(typeof sqliteOperatorTypesTable.$inferSelect)[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const operatorTypes = await operatorTypeService.findAll()

      res.status(200).json(operatorTypes)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<typeof sqliteOperatorTypesTable.$inferSelect | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const operatorType = await operatorTypeService.findOne(req.params)

      res.status(200).json(operatorType)
      return
    } catch (error) {
      if (error instanceof OperatorTypeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
