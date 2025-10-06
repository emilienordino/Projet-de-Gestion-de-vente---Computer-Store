import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { errorResponse } from '../utils/response';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      // Formatage des erreurs Zod pour une meilleure lisibilité
      const details = err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      // Création d'un message d'erreur lisible
      const errorMessages = details.map(detail => 
        detail.field ? `${detail.field}: ${detail.message}` : detail.message
      ).join(', ');

      return errorResponse(res, `${errorMessages}`, 400);
    }
    return errorResponse(res, 'Erreur de validation inconnue', 400);
  }
};