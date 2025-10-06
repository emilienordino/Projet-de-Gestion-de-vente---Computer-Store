import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

export interface TokenPayload {
  id_utilisateur: string;
  email: string;
  role: string;
  nom_utilisateur: string;
}

export class JWTService {
  static generateToken(payload: TokenPayload): string {
    const secret: Secret = jwtConfig.secret as Secret;
    const options: SignOptions = {
      expiresIn: jwtConfig.expiresIn as unknown as number | `${number}${'s'|'m'|'h'|'d'}`
    };

    return jwt.sign(payload as object, secret, options);
  }

  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, jwtConfig.secret) as TokenPayload;
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}