import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

import { UserDocument, UserModel } from "./types";

enum RoleType {
  Guest = "guest",
  Host = "host",
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String },
    role: { type: RoleType, default: RoleType.Host },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  const user = this;
  //   ????????????????/
  const plainpassword: any = user.password;
  console.log("coming from schema", plainpassword);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainpassword, 10);
    console.log(user.password);
  }
  next();
});

UserSchema.methods.toJSON = function (this: UserDocument) {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.__v;

  return userObject;
};

UserSchema.statics.checkIfExists = async function (
  email: string,
  plainPw: string
) {
  const user = await this.findOne({ email });
  if (user) {
    console.log("user already exists");
    return true;
  } else {
    console.log("new user");
    return false;
  }
};
UserSchema.statics.checkCredentials = async function (
  email: string,
  plainpassword: any
) {
  const user = await this.findOne({ email });

  if (user) {
    console.log("user find:", user);

    const isMatch = await bcrypt.compare(plainpassword, user.password);

    if (isMatch) return user;
    else return null;
  } else return null;
};

// userSchema.statics.checkResetCredentials = async function(email){
//     const user = await this.findOne({email: email});

//     if(user){

//     }
// }

export default model<UserDocument, UserModel>("user", UserSchema);
