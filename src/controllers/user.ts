import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { getAllUsers, createUser, signin } from "../services/user";
import { Role } from "../util/role";
import { UserClass } from "../models/User";
import {
  Http400Error,
  Http403Error,
  Http500Error,
  HttpError,
} from "../errors/http";

export const getSlash = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if ((req.user as UserClass).role === Role.admin) {
      return res.status(200).json(await getAllUsers());
    } else {
      next(new Http403Error());
    }
  } catch (err) {
    if (err instanceof HttpError) {
      return next(err);
    }
    return next(new Http500Error(err));
  }
};

export const postSlash = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new Http400Error(errors));
  }

  try {
    return res
      .status(200)
      .json(
        await createUser(req.body.username, req.body.email, req.body.password)
      );
  } catch (err) {
    if (err instanceof HttpError) {
      return next(err);
    }
    return next(new Http500Error(err));
  }
};

export const postSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new Http400Error(errors));
  }
  try {
    return res
      .status(200)
      .json(await signin(req.body.username, req.body.password));
  } catch (err) {
    if (err instanceof HttpError) {
      return next(err);
    }
    return next(new Http500Error(err));
  }
};
