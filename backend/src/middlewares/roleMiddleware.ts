import { NextFunction, Request, Response } from 'express';
import { ResponseHandler } from '../utils/responseHandler';

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ResponseHandler.error(res, 'Authentification requise', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ResponseHandler.error(
        res, 
        `Accès refusé. Rôle requis: ${allowedRoles.join(' ou ')}`, 
        403
      );
    }

    next();
  };
};