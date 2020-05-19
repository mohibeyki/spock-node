import { Role } from "./role";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

export const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

// export function authorize(roles: Role[]) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (roles.length && !roles.includes((req.user) as UserModel).role)) {
//       console.log(
//         "Req inside authorize:",
//         roles,
//         req.user,
//         !roles.includes(req.user.role)
//       );
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     next();
//   };
// }
