import { DocumentType } from '@typegoose/typegoose'
import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { Http400Error } from '../errors/http'
import { ApplicationClass } from '../models/application'
import { UserClass } from '../models/user'
import * as ApplicationService from '../services/application'

export const getApplications = async (req: Request, res: Response) => {
  res
    .status(200)
    .json(await ApplicationService.getApplicationsForUser((req.user as DocumentType<UserClass>)._id))
}

export const getAllApplications = async (req: Request, res: Response) => {
  res.status(200).json(await ApplicationService.getAllApplications())
}

export const createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new Http400Error(errors.array())
    }
    res
      .status(200)
      .json(
        await ApplicationService.createApplication(
          req.body as ApplicationClass,
          (req.user as DocumentType<UserClass>)._id
        )
      )
  } catch (err) {
    return next(err)
  }
}

export const updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new Http400Error(errors.array())
    }
    res
      .status(200)
      .json(
        await ApplicationService.updateApplication(
          req.body as ApplicationClass,
          (req.user as DocumentType<UserClass>)._id
        )
      )
  } catch (err) {
    return next(err)
  }
}

export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json(
        await ApplicationService.deleteApplication(
          req.params.id,
          (req.user as DocumentType<UserClass>)._id
        )
      )
  } catch (err) {
    return next(err)
  }
}
