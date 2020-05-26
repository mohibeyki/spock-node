import { Request, Response, NextFunction } from "express";
import { DocumentType } from "@typegoose/typegoose";

import { Http500Error, HttpError } from "../errors/http";
import * as CommentsService from "../services/comments";
import { UserClass } from "../models/user";

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json(await CommentsService.getCommentsForApplication(req.params["id"]));
  } catch (err) {
    if (err instanceof HttpError) {
      return next(err);
    }
    return next(new Http500Error(err));
  }
};

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json(
        await CommentsService.createComment(
          req.body,
          req.params["id"],
          req.user as DocumentType<UserClass>
        )
      );
  } catch (err) {
    if (err instanceof HttpError) {
      return next(err);
    }
    return next(new Http500Error(err));
  }
};
