import type { NextFunction, Request, Response } from 'express'
import { ContractTypeService } from '../services/index.js'
import type { BaseRequest, IdRequest } from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  ContractTypeAlreadyExistsError,
  ContractTypeNotFoundError,
} from '../models/index.js'
import type { sqliteContractTypesTable } from '../db/schemas/sqlite.js'

const contractTypeService = new ContractTypeService()

export class ContractTypeController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await contractTypeService.add(req.body)

      res.status(201).json({
        message: 'Tipo de contrato agregado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof ContractTypeAlreadyExistsError) {
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
      await contractTypeService.edit(req.body)

      res.status(200).json({
        message: 'Tipo de contrato editado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof ContractTypeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (error instanceof ContractTypeAlreadyExistsError) {
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
      await contractTypeService.remove(req.body)

      res.status(200).json({
        message: 'Tipo de contrato eliminado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof ContractTypeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<(typeof sqliteContractTypesTable.$inferSelect)[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const contractTypes = await contractTypeService.findAll()

      res.status(200).json(contractTypes)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<typeof sqliteContractTypesTable.$inferSelect | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const contractType = await contractTypeService.findOne(req.params)

      res.status(200).json(contractType)
      return
    } catch (error) {
      if (error instanceof ContractTypeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
