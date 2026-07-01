
import { UserDocument } from '../../modules/auth/auth.model'
declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}
export {};