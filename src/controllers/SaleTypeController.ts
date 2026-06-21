import type { NextFunction, Request, Response } from 'express'
import { SaleTypeService } from '../services/index.js'
import type { BaseRequest, IdRequest } from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  SaleTypeAlreadyExistsError,
  SaleTypeNotFoundError,
} from '../models/index.js'
import type { sqliteSaleTypesTable } from '../db/schemas/index.js'

const saleTypeService = new SaleTypeService()

export class SaleTypeController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await saleTypeService.add(req.body)

      res
        .status(201)
        .json({ message: 'Tipo de venta agregado correctamente', state: true })

      return
    } catch (error) {
      if (error instanceof SaleTypeAlreadyExistsError) {
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
      await saleTypeService.edit(req.body)

      res
        .status(200)
        .json({ message: 'Tipo de venta editado correctamente', state: true })

      return
    } catch (error) {
      if (error instanceof SaleTypeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (error instanceof SaleTypeAlreadyExistsError) {
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
      await saleTypeService.remove(req.body)

      res
        .status(200)
        .json({ message: 'Tipo de venta eliminado correctamente', state: true })

      return
    } catch (error) {
      if (error instanceof SaleTypeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<(typeof sqliteSaleTypesTable.$inferSelect)[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const saleTypes = await saleTypeService.findAll()

      res.status(200).json(saleTypes)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<typeof sqliteSaleTypesTable.$inferSelect | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const saleType = await saleTypeService.findOne(req.params)

      res.status(200).json(saleType)
      return
    } catch (error) {
      if (error instanceof SaleTypeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
