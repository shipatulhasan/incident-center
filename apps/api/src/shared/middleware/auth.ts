import type { NextFunction, Request, Response } from 'express'

import jwt from 'jsonwebtoken'

import AppError from '@/shared/errors/AppError'
import { envVars } from '@/config/env'
import { UserRole } from '../types/user'
import User from '@/modules/auth/auth.model'

interface JwtPayload {
  id: string
  role: UserRole
}

const auth =
  (...roles: UserRole[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers.authorization

      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new AppError(401, 'Not authorized. Missing token.')
      }

      const token = authorization.split(' ')[1]

      const decoded = jwt.verify(token, envVars.JWT_SECRET) as JwtPayload

      const user = await User.findById(decoded.id).select('-password')

      if (!user) {
        throw new AppError(401, 'User no longer exists.')
      }

      if (roles.length && !roles.includes(user.role)) {
        throw new AppError(403, 'You are not authorized.')
      }

      req.user = user

      next()
    } catch (error) {
      next(error)
    }
  }

export default auth
