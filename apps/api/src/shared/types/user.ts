export const USER_ROLES = [
  "admin",
  "engineer",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team: string;
  isOnCall: boolean;
}