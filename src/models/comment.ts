import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { ApplicationClass } from "./application";

export class CommentClass {
  @prop({ required: true, ref: ApplicationClass })
  application: Ref<ApplicationClass>;

  @prop({ required: true })
  text: string;
}

export const CommentModel = getModelForClass(CommentClass, {
  schemaOptions: { timestamps: true },
});
