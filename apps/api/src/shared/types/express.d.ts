import type { UserDocument } from "@/modules/auth/user.model";

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}
export {};