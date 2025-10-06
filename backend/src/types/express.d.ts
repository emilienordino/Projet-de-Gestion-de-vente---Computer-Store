import { TokenPayload } from '../utils/jwtService';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}