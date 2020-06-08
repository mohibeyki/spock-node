import { Request, Response, NextFunction } from 'express'
import { DocumentType } from '@typegoose/typegoose'

import { Http400Error } from '../errors/http'
import * as CommentsService from '../services/comments'
import { UserClass } from '../models/user'
import { validationResult } from 'express-validator'

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json(
        await CommentsService.getCommentsForApplication(
          req.params.id,
          (req.user as DocumentType<UserClass>)._id
        )
      )
  } catch (err) {
    return next(err)
  }
}

export const createComment = async (
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
        await CommentsService.createComment(
          req.body,
          req.params.id,
          (req.user as DocumentType<UserClass>)._id
        )
      )
  } catch (err) {
    return next(err)
  }
}

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json(
        await CommentsService.deleteComment(
          req.params.id,
          (req.user as DocumentType<UserClass>)._id
        )
      )
  } catch (err) {
    return next(err)
  }
}
