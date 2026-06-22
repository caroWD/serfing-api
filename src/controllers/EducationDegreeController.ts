import type { NextFunction, Request, Response } from 'express'
import { EducationDegreeService } from '../services/index.js'
import type { BaseRequest, IdRequest } from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  EducationDegreeAlreadyExistsError,
  EducationDegreeNotFoundError,
} from '../models/EducationDegree.js'
import type { sqliteEducationDegreesTable } from '../db/schemas/sqlite.js'

const educationDegreeService = new EducationDegreeService()

export class EducationDegreeController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await educationDegreeService.add(req.body)

      res.status(201).json({
        message: 'Grado de educación agregado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof EducationDegreeAlreadyExistsError) {
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
      await educationDegreeService.edit(req.body)

      res.status(200).json({
        message: 'Grado de educación editado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof EducationDegreeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (error instanceof EducationDegreeAlreadyExistsError) {
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
      await educationDegreeService.remove(req.body)

      res.status(200).json({
        message: 'Grado de educación eliminado correctamente',
        state: true,
      })

      return
    } catch (error) {
      if (error instanceof EducationDegreeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<(typeof sqliteEducationDegreesTable.$inferSelect)[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const educationDegrees = await educationDegreeService.findAll()

      res.status(200).json(educationDegrees)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<
      typeof sqliteEducationDegreesTable.$inferSelect | BaseResponse
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const educationDegree = await educationDegreeService.findOne(req.params)

      res.status(200).json(educationDegree)
      return
    } catch (error) {
      if (error instanceof EducationDegreeNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
