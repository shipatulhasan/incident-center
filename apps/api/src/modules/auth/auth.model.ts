import { IUser, USER_ROLES } from "@/shared/types/user";
import bcrypt from "bcryptjs";
import {
  HydratedDocument,
  Model,
  Schema,
  model,
} from "mongoose";



interface IUserForModel extends IUser {
  password: string;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<
  IUserForModel,
  IUserMethods
>;

export type UserModel = Model<
  IUserForModel,
  {},
  IUserMethods
>;

const userSchema = new Schema<
  IUserForModel,
  UserModel,
  IUserMethods
>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      default: "engineer",
    },

    team: {
      type: String,
      default: "Reliability",
    },

    isOnCall: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.method(
  "comparePassword",
  async function (
    candidatePassword: string,
  ) {
    return bcrypt.compare(
      candidatePassword,
      this.password,
    );
  },
);

const User = model<
  IUserForModel,
  UserModel
>("User", userSchema);

export default User;