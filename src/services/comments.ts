import { CommentModel, CommentClass } from "../models/comment";
import { UserClass } from "../models/user";
import { ApplicationModel } from "../models/application";
import { Http400Error, Http403Error } from "../errors/http";
import { DocumentType } from "@typegoose/typegoose";

export const getCommentsForApplication = async (application: string) => {
  return await CommentModel.find({ application });
};

export const createComment = async (
  body: CommentClass,
  applicationId: string,
  user: DocumentType<UserClass>
) => {
  const application = await ApplicationModel.findOne({
    _id: applicationId,
  }).populate("user");
  if (!application) {
    throw new Http400Error("unable to find matching application");
  }
  if ((application.user as UserClass).email !== user.email) {
    throw new Http403Error();
  }
  return await CommentModel.create({ ...body, application });
};
