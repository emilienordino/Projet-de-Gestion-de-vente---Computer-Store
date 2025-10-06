import { Request, Response } from 'express';
import { LigneVenteService } from '../services/saleLineService';
import { ResponseHandler } from '../utils/responseHandler';
import {
    appliquerRemiseSchema,
    createLigneVenteSchema,
    updateLigneVenteSchema
} from '../validators/saleLineValidator';

export class LigneVenteController {
  private service: LigneVenteService;

  constructor() {
    this.service = new LigneVenteService();
  }

  async getAllLignesVente(req: Request, res: Response) {
    try {
      const lignes = await this.service.getAllLignesVente();
      return ResponseHandler.success(res, lignes);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getLigneById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const ligne = await this.service.getLigneById(id);
      return ResponseHandler.success(res, ligne);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getLignesByVente(req: Request, res: Response) {
    try {
      const idVente = req.params.idVente;
      const lignes = await this.service.getLignesByVente(idVente);
      return ResponseHandler.success(res, lignes);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async createLigne(req: Request, res: Response) {
    try {
      const validatedData = createLigneVenteSchema.parse(req.body);
      const ligne = await this.service.createLigne(validatedData as any);
      return ResponseHandler.created(res, ligne, 'Ligne de vente ajoutée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async updateLigne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = updateLigneVenteSchema.parse(req.body);
      const ligne = await this.service.updateLigne(id, validatedData as any);
      return ResponseHandler.success(res, ligne, 'Ligne de vente mise à jour avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async deleteLigne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const ligne = await this.service.deleteLigne(id);
      return ResponseHandler.success(res, ligne, 'Ligne de vente supprimée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async calculerSousTotal(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await this.service.calculerSousTotal(id);
      return ResponseHandler.success(res, result);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async appliquerRemise(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = appliquerRemiseSchema.parse(req.body);
      const ligne = await this.service.appliquerRemise(id, validatedData as any);
      return ResponseHandler.success(res, ligne, 'Remise appliquée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }
}