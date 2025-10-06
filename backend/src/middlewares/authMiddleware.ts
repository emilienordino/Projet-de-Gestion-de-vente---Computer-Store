import { NextFunction, Request, Response } from 'express';
import { JWTService } from '../utils/jwtService';
import { ResponseHandler } from '../utils/responseHandler';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return ResponseHandler.error(res, 'Token d\'authentification manquant', 401);
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return ResponseHandler.error(res, 'Format du token invalide. Format attendu: Bearer [token]', 401);
    }

    const token = parts[1];

    const decoded = JWTService.verifyToken(token); 
    
    req.user = decoded;
    
    next();
  } catch (error) {
    return ResponseHandler.error(res, 'Token invalide ou expiré', 401);
  }
};