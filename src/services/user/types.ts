import { Document, Model } from "mongoose";

enum RoleType {
  Guest = "guest",
  Host = "host",
}

export interface User {
  email: string;
  password?: any;
  role?: RoleType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends Document, User {}
export interface UserModel extends Model<UserDocument> {
  checkCredentials(
    email: string,
    plainPw: string
  ): Promise<UserDocument | null>;
}
