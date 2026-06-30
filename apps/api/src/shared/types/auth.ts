import type { IUser } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: IUser;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;

  role?: IUser["role"];

  team?: string;

  isOnCall?: boolean;
}