import { Role } from '../util/role'
import { prop, getModelForClass } from '@typegoose/typegoose'

export class UserClass {
  @prop({ required: true, unique: true })
  username: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, unique: true, index: true })
  email: string;

  @prop({ required: true, default: Role.admin })
  role: Role;
}

export const UserModel = getModelForClass(UserClass, {
  schemaOptions: { timestamps: true }
})
