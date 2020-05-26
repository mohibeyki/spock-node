import { CommentModel, CommentClass } from "../models/comment";
import { ApplicationModel } from "../models/application";
import { Http403Error, Http404Error } from "../errors/http";
import { mongoose } from "@typegoose/typegoose";

export const getCommentsForApplication = async (
  applicationId: string,
  userId: mongoose.Types.ObjectId
) => {
  const application = await ApplicationModel.findOne({ _id: applicationId });
  if (application.user != userId) {
    throw new Http403Error();
  }
  return await CommentModel.find({
    application: applicationId,
    archived: false,
  });
};

export const createComment = async (
  body: CommentClass,
  applicationId: string,
  userId: mongoose.Types.ObjectId
) => {
  const application = await ApplicationModel.findOne({
    _id: applicationId,
  }).populate("user");
  if (!application) {
    throw new Http404Error();
  }
  if (application.user !== userId) {
    throw new Http403Error();
  }
  return await CommentModel.create({ ...body, application });
};

export const deleteComment = async (
  commentId: string,
  userId: mongoose.Types.ObjectId
) => {
  const comment = await CommentModel.findOne({ _id: commentId }).populate(
    "application"
  );
  if (!comment) {
    throw new Http404Error();
  }
  if (comment.application != userId) {
    throw new Http403Error();
  }
  comment.archived = true;
  return await comment.save();
};
