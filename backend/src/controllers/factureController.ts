import { Request, Response } from 'express';
import { FactureService } from '../services/factureService';
import { ResponseHandler } from '../utils/responseHandler';
import {
    createFactureSchema,
    periodeFactureSchema,
    updateFactureSchema
} from '../validators/factureValidator';

export class FactureController {
  private service: FactureService;

  constructor() {
    this.service = new FactureService();
  }

  async getAllFactures(req: Request, res: Response) {
    try {
      const factures = await this.service.getAllFactures();
      return ResponseHandler.success(res, factures);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getFactureById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const facture = await this.service.getFactureById(id);
      return ResponseHandler.success(res, facture);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getFactureByNumero(req: Request, res: Response) {
    try {
      const numero = req.params.numero;
      const facture = await this.service.getFactureByNumero(numero);
      return ResponseHandler.success(res, facture);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getFactureByVente(req: Request, res: Response) {
    try {
      const idVente = req.params.idVente;
      const facture = await this.service.getFactureByVente(idVente);
      return ResponseHandler.success(res, facture);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getFacturesPeriode(req: Request, res: Response) {
    try {
      const validatedData = periodeFactureSchema.parse(req.query);
      const factures = await this.service.getFacturesPeriode(validatedData.debut, validatedData.fin);
      return ResponseHandler.success(res, factures);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async createFacture(req: Request, res: Response) {
    try {
      const validatedData = createFactureSchema.parse(req.body);
      const facture = await this.service.createFacture(validatedData.id_vente);
      return ResponseHandler.created(res, facture, 'Facture générée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async updateFacture(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = updateFactureSchema.parse(req.body);
      const facture = await this.service.updateFacture(id, validatedData as any);
      return ResponseHandler.success(res, facture, 'Facture mise à jour avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async annulerFacture(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const facture = await this.service.annulerFacture(id);
      return ResponseHandler.success(res, facture, 'Facture annulée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async deleteFacture(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const facture = await this.service.deleteFacture(id);
      return ResponseHandler.success(res, facture, 'Facture supprimée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async regenererPDF(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const facture = await this.service.regenererPDF(id);
      return ResponseHandler.success(res, facture, 'PDF régénéré avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getStatsFactures(req: Request, res: Response) {
    try {
      const stats = await this.service.getStatsFactures();
      return ResponseHandler.success(res, stats);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }
}