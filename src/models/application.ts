import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { UserClass } from "./user";

export class ApplicationClass {
  @prop({ required: true })
  company: string;

  @prop({ required: true })
  position: string;

  @prop({ required: true })
  submissionLink: string;

  @prop({ required: true })
  status: string;

  @prop({ required: true, default: Date.now() })
  submissionDate: Date;

  @prop({ required: true, ref: UserClass })
  user: Ref<UserClass>;
}

export const ApplicationModel = getModelForClass(ApplicationClass, {
  schemaOptions: { timestamps: true },
});
