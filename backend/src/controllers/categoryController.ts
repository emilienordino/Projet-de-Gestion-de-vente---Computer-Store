import { Request, Response } from 'express';
import { CategorieProduitService } from "../services/categoryService";
import { ResponseHandler } from '../utils/responseHandler';
import { createCategorieSchema, updateCategorieSchema } from "../validators/categorieValidator";

export class CategorieProduitController {
  private service: CategorieProduitService;

  constructor() {
    this.service = new CategorieProduitService();
  }

  async getAllCategories(_req: Request, res: Response) {
    try {
      const categories = await this.service.getAllCategories();
      return ResponseHandler.success(res, categories);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getCategorieById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const categorie = await this.service.getCategorieById(id);
      return ResponseHandler.success(res, categorie);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async createCategorie(req: Request, res: Response) {
    try {
      const validatedData = createCategorieSchema.parse(req.body);
      const categorie = await this.service.createCategorie(validatedData);
      return ResponseHandler.created(res, categorie, 'Catégorie créée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async updateCategorie(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = updateCategorieSchema.parse(req.body);
      const categorie = await this.service.updateCategorie(id, validatedData);
      return ResponseHandler.success(res, categorie, 'Catégorie mise à jour avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async supprimerCategorie(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const categorie = await this.service.supprimerCategorie(id);
      return ResponseHandler.success(res, categorie, 'Catégorie supprimée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getCategoriesSupprimes(_req: Request, res: Response) {
    try {
      const categories = await this.service.getCategoriesSupprimes();
      return ResponseHandler.success(res, categories);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async restaurerCategorie(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const categorie = await this.service.restaurerCategorie(id);
      return ResponseHandler.success(res, categorie, 'Catégorie restaurée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }
}