import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { getAllUsers, createUser, signin } from "../services/user";

export const getSlash = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(await getAllUsers());
  } catch (err) {
    next(err);
  }
};

export const postSlash = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }

  try {
    res.json(
      await createUser(req.body.username, req.body.email, req.body.password)
    );
  } catch (err) {
    next(err);
  }
};

export const postSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  try {
    res.json(await signin(req.body.username, req.body.password));
  } catch (err) {
    next(err);
  }
};
