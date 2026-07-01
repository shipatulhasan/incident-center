import jwt, { SignOptions } from "jsonwebtoken";
import { UserDocument } from "./auth.model";
import { envVars } from "@/config/env";
import { IUser } from "@/shared/types/user";



export const signToken = (user: UserDocument): string => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    envVars.JWT_SECRET,
    {
    expiresIn: envVars.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(
    token,
    envVars.JWT_SECRET,
  ) as jwt.JwtPayload;
};

export const serializeUser = (
  user: UserDocument,
): IUser => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    team: user.team,
    isOnCall: user.isOnCall,
  };
};