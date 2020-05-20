import { prop, getModelForClass } from "@typegoose/typegoose";

export class ApplicationClass {
  @prop({ required: true })
  company: string;

  @prop({ required: true })
  position: string;

  @prop({ required: true })
  address: string;

  @prop({ required: true })
  status: string;
}

export const ApplicationModel = getModelForClass(ApplicationClass);
