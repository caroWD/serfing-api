import type { NextFunction, Request, Response } from 'express'
import { UserService } from '../services/index.js'
import type {
  AddUserRequest,
  AuthResponse,
  AuthUserRequest,
  ChangePasswordRequest,
  EditUserRequest,
  IdRequest,
} from '../schemas/index.js'
import type { BaseResponse } from '../types/index.js'
import {
  RoleNotFoundError,
  UserEmailAlreadyExistsError,
  UserHandleAlreadyExistsError,
  UserNotFoundError,
  UserUnauthorizedError,
} from '../models/index.js'
import { SignJWT } from 'jose'
import {
  JWT_ALG,
  JWT_CLAIM,
  JWT_ISSUER,
  JWT_SECRET,
  NODE_ENV,
} from '../config/index.js'
import type { sqliteUsersTable } from '../db/schemas/index.js'

const userService = new UserService()

export class UserController {
  async add(
    req: Request<AddUserRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await userService.add(req.body)

      res
        .status(201)
        .json({ message: 'Usuario agregado correctamente', state: true })

      return
    } catch (error) {
      if (
        error instanceof UserHandleAlreadyExistsError ||
        error instanceof UserEmailAlreadyExistsError
      ) {
        res.status(422).json({ message: error.message, state: false })
        return
      }

      if (error instanceof RoleNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async edit(
    req: Request<EditUserRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await userService.edit(req.body)

      res
        .status(200)
        .json({ message: 'Usuario editado correctamente', state: true })

      return
    } catch (error) {
      if (
        error instanceof UserNotFoundError ||
        error instanceof RoleNotFoundError
      ) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (
        error instanceof UserHandleAlreadyExistsError ||
        error instanceof UserEmailAlreadyExistsError
      ) {
        res.status(422).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async changePassword(
    req: Request<ChangePasswordRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await userService.changePassword(req.body)

      res
        .status(200)
        .json({ message: 'Usuario editado correctamente', state: true })

      return
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      if (error instanceof UserUnauthorizedError) {
        res.status(401).json({ message: error.message, state: false })
      }

      next(error)
    }
  }

  async softRemove(
    req: Request<IdRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      await userService.softRemove(req.body)

      res
        .status(200)
        .json({ message: 'Usuario ocultado correctamente', state: true })

      return
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
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
      await userService.remove(req.body)

      res
        .status(200)
        .json({ message: 'Usuario eliminado correctamente', state: true })

      return
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }

  async auth(
    req: Request<AuthUserRequest>,
    res: Response<AuthResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await userService.auth(req.body)

      const token = await new SignJWT({
        [JWT_CLAIM]: true,
        id: user.id,
        handle: user.handle,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        roleId: user.roleId,
      })
        .setProtectedHeader({ alg: JWT_ALG })
        .setIssuedAt()
        .setIssuer(JWT_ISSUER)
        .setAudience(user.id)
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(JWT_SECRET))

      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60,
        })
        .json({ message: 'Usuario autorizado', state: true, token })

      return
    } catch (error) {
      if (error instanceof UserUnauthorizedError) {
        res
          .status(401)
          .json({ message: error.message, state: false, token: null })
        return
      }

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<Omit<typeof sqliteUsersTable.$inferSelect, 'password'>[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await userService.findAll()

      res.status(200).json(users)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<
      Omit<typeof sqliteUsersTable.$inferSelect, 'password'> | BaseResponse
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await userService.findOne(req.params)

      res.status(200).json(user)
      return
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ message: error.message, state: false })
        return
      }

      next(error)
    }
  }
}
