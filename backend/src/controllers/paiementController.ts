import { ModePaiement } from '@prisma/client';
import { Request, Response } from 'express';
import { PaiementService } from '../services/paiementService';
import { ResponseHandler } from '../utils/responseHandler';
import {
    changerStatutPaiementSchema,
    createPaiementSchema,
    periodePaiementSchema,
    updatePaiementSchema
} from '../validators/paiementValidator';

export class PaiementController {
  private service: PaiementService;

  constructor() {
    this.service = new PaiementService();
  }

  async getAllPaiements(req: Request, res: Response) {
    try {
      const paiements = await this.service.getAllPaiements();
      return ResponseHandler.success(res, paiements);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getPaiementById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const paiement = await this.service.getPaiementById(id);
      return ResponseHandler.success(res, paiement);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getPaiementsByVente(req: Request, res: Response) {
    try {
      const idVente = req.params.idVente;
      const paiements = await this.service.getPaiementsByVente(idVente);
      return ResponseHandler.success(res, paiements);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getPaiementsByMode(req: Request, res: Response) {
    try {
      const mode = req.params.mode as ModePaiement;
      const paiements = await this.service.getPaiementsByMode(mode);
      return ResponseHandler.success(res, paiements);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getPaiementsPeriode(req: Request, res: Response) {
    try {
      const validatedData = periodePaiementSchema.parse(req.query);
      const paiements = await this.service.getPaiementsPeriode(validatedData.debut, validatedData.fin);
      return ResponseHandler.success(res, paiements);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async createPaiement(req: Request, res: Response) {
    try {
      const validatedData = createPaiementSchema.parse(req.body);
      const paiement = await this.service.createPaiement(validatedData as any);
      return ResponseHandler.created(res, paiement, 'Paiement enregistré avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async updatePaiement(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = updatePaiementSchema.parse(req.body);
      const paiement = await this.service.updatePaiement(id, validatedData as any);
      return ResponseHandler.success(res, paiement, 'Paiement mis à jour avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async changerStatutPaiement(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = changerStatutPaiementSchema.parse(req.body);
      const paiement = await this.service.changerStatutPaiement(id, validatedData.statut);
      return ResponseHandler.success(res, paiement, 'Statut du paiement modifié avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async validerPaiement(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const paiement = await this.service.validerPaiement(id);
      return ResponseHandler.success(res, paiement, 'Paiement validé avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async refuserPaiement(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const paiement = await this.service.refuserPaiement(id);
      return ResponseHandler.success(res, paiement, 'Paiement refusé');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async deletePaiement(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const paiement = await this.service.deletePaiement(id);
      return ResponseHandler.success(res, paiement, 'Paiement supprimé avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getStatsPaiements(req: Request, res: Response) {
    try {
      const stats = await this.service.getStatsPaiements();
      return ResponseHandler.success(res, stats);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }
}