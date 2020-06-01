import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as UserService from "../services/user";
import { Http400Error } from "../errors/http";

export const getUsers = async (req: Request, res: Response) => {
  return res.status(200).json(await UserService.getAllUsers());
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Http400Error(errors.array());
    }
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
    return next(err);
  }
};

export const postSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Http400Error(errors.array());
    }
    return res
      .status(200)
      .json(await UserService.signin(req.body.email, req.body.password));
  } catch (err) {
    return next(err);
  }
};
