import { mongoose } from "@typegoose/typegoose";
import { Http403Error, Http404Error } from "../errors/http";
import { ApplicationClass, ApplicationModel } from "../models/application";

export const getAllApplications = async () => {
  return await ApplicationModel.find().populate("user");
};

export const getApplicationsForUser = async (user: mongoose.Types.ObjectId) => {
  return await ApplicationModel.find({ user, archived: false });
};

export const createApplication = async (
  body: ApplicationClass,
  user: mongoose.Types.ObjectId
) => {
  return await ApplicationModel.create({ ...body, user });
};

export const updateApplication = async (
  body: any,
  user: mongoose.Types.ObjectId
) => {
  return await ApplicationModel.updateOne({_id: body._id, user:user}, { ...body, user });
};

export const deleteApplication = async (
  applicationId: string,
  userId: mongoose.Types.ObjectId
) => {
  const application = await ApplicationModel.findOne({ _id: applicationId });
  if (!application) {
    throw new Http404Error();
  }
  if (application.user != userId) {
    throw new Http403Error();
  }
  application.archived = true;
  return await application.save();
};
