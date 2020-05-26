import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as UserService from "../services/user";
import { Http400Error, Http500Error, HttpError } from "../errors/http";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json(await UserService.getAllUsers());
  } catch (err) {
    if (err instanceof HttpError) {
      return next(err);
    }
    return next(new Http500Error(err));
  }
};

export const createUser = async (
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
        await UserService.createUser(
          req.body.username,
          req.body.email,
          req.body.password
        )
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
      .json(await UserService.signin(req.body.username, req.body.password));
  } catch (err) {
    if (err instanceof HttpError) {
      return next(err);
    }
    return next(new Http500Error(err));
  }
};
