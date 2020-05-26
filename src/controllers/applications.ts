import { Request, Response, NextFunction } from "express";
import { DocumentType } from "@typegoose/typegoose";

import { Http400Error } from "../errors/http";
import * as ApplicationService from "../services/application";
import { UserClass } from "../models/user";
import { ApplicationClass } from "../models/application";
import { validationResult } from "express-validator";

export const getApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json(
        await ApplicationService.getApplicationsForUser(
          (req.user as DocumentType<UserClass>)._id
        )
      );
  } catch (err) {
    return next(err);
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
    return next(err);
  }
};

export const createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new Http400Error(errors));
  }
  try {
    res
      .status(200)
      .json(
        await ApplicationService.createApplication(
          req.body as ApplicationClass,
          (req.user as DocumentType<UserClass>)._id
        )
      );
  } catch (err) {
    return next(err);
  }
};

export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json(await ApplicationService.deleteApplication(req.params["id"]));
  } catch (err) {
    return next(err);
  }
};
