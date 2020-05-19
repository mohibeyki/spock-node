import jwt from "jsonwebtoken";

import { UserModel, UserClass } from "../models/User";
import { Role } from "../util/role";
import { hashPassword, checkPassword } from "../util/auth";
import { JWT_SECRET } from "../util/secrets";

const filterUser = (user: UserClass) => {
  const { role, username, email } = user;
  return { role, username, email };
};

export const getAllUsers = async () => {
  return (await UserModel.find()).map((user) => filterUser(user));
};

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  const found = await Promise.all([
    UserModel.findOne({ username }),
    UserModel.findOne({ email }),
  ]);

  if (found[0] || found[1]) {
    throw new Error("A user with the same username or email exists");
  }
  password = await hashPassword(password);

  return filterUser(
    await UserModel.create({
      username,
      email,
      password,
      role: Role.user,
    })
  );
};

export const signin = async (username: string, password: string) => {
  const user = await UserModel.findOne({
    username,
  });

  if (user && (await checkPassword(password, user.password))) {
    return {
      user: filterUser(user),
      token: jwt.sign(filterUser(user), JWT_SECRET),
    };
  }
  throw new Error("invalid username or password");
};
