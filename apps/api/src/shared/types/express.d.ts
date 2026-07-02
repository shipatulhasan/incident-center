
import { UserDocument } from '../../modules/auth/auth.model'
declare global {
  namespace Express {
    interface User extends UserDocument {}
    interface Request {
      user: UserDocument;
    }
  }
}
export {};