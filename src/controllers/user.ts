import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { Http400Error } from '../errors/http'
import * as UserService from '../services/user'

export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).json(await UserService.getAllUsers())
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new Http400Error(errors.array())
    }
    return res
      .status(200)
      .json(
        await UserService.createUser(
          req.body.username,
          req.body.email,
          req.body.password
        )
      )
  } catch (err) {
    next(err)
  }
}

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new Http400Error(errors.array())
    }
    return res
      .status(200)
      .json(await UserService.signin(req.body.email, req.body.password))
  } catch (err) {
    next(err)
  }
}
