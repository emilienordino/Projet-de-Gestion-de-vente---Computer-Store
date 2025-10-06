import { Request, Response } from 'express';
import { PromotionService } from '../services/promotionService';
import { ResponseHandler } from '../utils/responseHandler';
import {
    appliquerPromotionSchema,
    createPromotionSchema,
    updatePromotionSchema
} from '../validators/promotionValidator';

export class PromotionController {
  private service: PromotionService;

  constructor() {
    this.service = new PromotionService();
  }

  async getAllPromotions(req: Request, res: Response) {
    try {
      const promotions = await this.service.getAllPromotions();
      return ResponseHandler.success(res, promotions);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getPromotionById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const promotion = await this.service.getPromotionById(id);
      return ResponseHandler.success(res, promotion);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getPromotionByCode(req: Request, res: Response) {
    try {
      const code = req.params.code;
      const promotion = await this.service.getPromotionByCode(code);
      return ResponseHandler.success(res, promotion);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getPromotionsActives(req: Request, res: Response) {
    try {
      const promotions = await this.service.getPromotionsActives();
      return ResponseHandler.success(res, promotions);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getPromotionsByProduit(req: Request, res: Response) {
    try {
      const idProduit = req.params.idProduit;
      const promotions = await this.service.getPromotionsByProduit(idProduit);
      return ResponseHandler.success(res, promotions);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getPromotionsByCategorie(req: Request, res: Response) {
    try {
      const idCategorie = req.params.idCategorie;
      const promotions = await this.service.getPromotionsByCategorie(idCategorie);
      return ResponseHandler.success(res, promotions);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async createPromotion(req: Request, res: Response) {
    try {
      const validatedData = createPromotionSchema.parse(req.body);
      const promotion = await this.service.createPromotion(validatedData as any);
      return ResponseHandler.created(res, promotion, 'Promotion créée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async updatePromotion(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = updatePromotionSchema.parse(req.body);
      const promotion = await this.service.updatePromotion(id, validatedData as any);
      return ResponseHandler.success(res, promotion, 'Promotion mise à jour avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async supprimerPromotion(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const promotion = await this.service.supprimerPromotion(id);
      return ResponseHandler.success(res, promotion, 'Promotion supprimée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getPromotionsSupprimes(req: Request, res: Response) {
    try {
      const promotions = await this.service.getPromotionsSupprimes();
      return ResponseHandler.success(res, promotions);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async restaurerPromotion(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const promotion = await this.service.restaurerPromotion(id);
      return ResponseHandler.success(res, promotion, 'Promotion restaurée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async appliquerPromotion(req: Request, res: Response) {
    try {
      const validatedData = appliquerPromotionSchema.parse(req.body);
      const result = await this.service.appliquerPromotion(
        validatedData.code_promotion as any,
        validatedData.montant as any
      );
      return ResponseHandler.success(res, result, 'Promotion appliquée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }
}