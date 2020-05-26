import { Request, Response, NextFunction } from "express";

import { Http500Error, HttpError } from "../errors/http";
import * as ApplicationService from "../services/application";
import { UserClass } from "../models/user";
import { ApplicationClass } from "../models/application";

export const getApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json(
        await ApplicationService.getApplicationsForUser(req.user as UserClass)
      );
  } catch (err) {
    if (err instanceof HttpError) {
      return next(err);
    }
    return next(new Http500Error(err));
  }
};

export const getAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(await ApplicationService.getAllApplications());
  } catch (err) {
    if (err instanceof HttpError) {
      return next(err);
    }
    return next(new Http500Error(err));
  }
};

export const createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json(
        await ApplicationService.createApplication(
          req.body as ApplicationClass,
          req.user as UserClass
        )
      );
  } catch (err) {
    if (err instanceof HttpError) {
      return next(err);
    }
    return next(new Http500Error(err));
  }
};
