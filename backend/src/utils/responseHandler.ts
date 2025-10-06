import { Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';

export class ResponseHandler {
  // Méthodes pour les réponses de succès
  static success(res: Response, data: any, message?: string) {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data
    });
  }

  static created(res: Response, data: any, message: string) {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message,
      data
    });
  }

  // Méthodes pour les réponses d'erreur
  static error(res: Response, message: string, statusCode = HTTP_STATUS.INTERNAL_ERROR) {
    return res.status(statusCode).json({
      success: false,
      message
    });
  }

  static badRequest(res: Response, message: string, errors?: any[]) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message,
      errors
    });
  }

  static notFound(res: Response, message: string) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message
    });
  }

  static internalError(res: Response, message = 'Erreur interne du serveur') {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message
    });
  }

  // Méthode principale pour gérer toutes les erreurs automatiquement
  static handleError(error: any, res: Response) {
    // Gestion des erreurs de validation Zod
    if (error.name === 'ZodError' && error.issues) {
      const errorMessages = error.issues.map((issue: any) => ({
        field: issue.path[0] || 'field',
        message: issue.message,
      }));
      return this.badRequest(res, 'Données invalides', errorMessages);
    }

    const message = error.message || 'Une erreur est survenue';

    // Erreurs 404 - Ressource non trouvée
    if (this.isNotFoundError(message)) {
      return this.notFound(res, message);
    }

    // Erreurs 400 - Requête invalide
    if (this.isBadRequestError(message)) {
      return this.badRequest(res, message);
    }

    // Erreur 500 - Erreur serveur
    console.error('Erreur non gérée:', error);
    return this.internalError(res);
  }

  private static isNotFoundError(message: string): boolean {
    const notFoundKeywords = [
      'non trouvé',
      'non trouvée',
      'introuvable',
      'n\'existe pas',
      'supprimé non trouvé',
      'supprimée non trouvée'
    ];
    return notFoundKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  private static isBadRequestError(message: string): boolean {
    const badRequestKeywords = [
      'existe déjà',
      'déjà existant',
      'déjà actif',
      'déjà payée',
      'déjà payé',
      'annulée',
      'annulé',
      'invalide',
      'incorrect',
      'manquant',
      'requis',
      'négatif',
      'positif',
      'format incorrect',
      'données invalides',
      'insuffisant',
      'inactif',
      'supprimé',
      'dépasser',
      'supérieure à',
      'zéro',
      'remboursée', 
      'refusé', 
      'dépasse', 
      'restant', 
      'totalement',
      'sans lignes', 
      'régénérer',
      'antérieure',
      'pas active actuellement'
    ];
    return badRequestKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }
}