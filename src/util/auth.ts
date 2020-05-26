import { Role } from "./role";
import { Request, Response, NextFunction } from "express";
import { UserClass } from "../models/user";
import bcrypt from "bcrypt";
import { Http403Error } from "../errors/http";

const saltRounds = 10;

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

export const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export function authorize(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (roles.length && !roles.includes((req.user as UserClass).role)) {
      throw new Http403Error("Unauthorized");
    } else {
      next();
    }
  };
}
