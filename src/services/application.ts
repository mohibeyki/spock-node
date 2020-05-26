import { UserClass } from "../models/user";
import { ApplicationModel, ApplicationClass } from "../models/application";

export const getAllApplications = async () => {
  return await ApplicationModel.find().populate("user");
};

export const getApplicationsForUser = async (user: UserClass) => {
  return await ApplicationModel.find({ user });
};

export const createApplication = async (
  body: ApplicationClass,
  user: UserClass
) => {
  return await ApplicationModel.create({ ...body, user });
};
