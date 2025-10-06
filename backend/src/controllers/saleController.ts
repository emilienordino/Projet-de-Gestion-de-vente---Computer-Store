import { StatutVente } from '@prisma/client';
import { Request, Response } from 'express';
import { VenteService } from '../services/saleService';
import { ResponseHandler } from '../utils/responseHandler';
import {
  ajouterPaiementSchema,
  changerStatutSchema,
  createLigneSchema,
  createVenteSchema,
  periodeSchema,
  rembourserSchema,
  updateLigneSchema,
  updateVenteSchema
} from '../validators/saleValidator';

export class VenteController {
  private service: VenteService;

  constructor() {
    this.service = new VenteService();
  }

  async getAllVentes(req: Request, res: Response) {
    try {
      const ventes = await this.service.getAllVentes();
      return ResponseHandler.success(res, ventes);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getVenteById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const vente = await this.service.getVenteById(id);
      return ResponseHandler.success(res, vente);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getVenteByNumero(req: Request, res: Response) {
    try {
      const numero = req.params.numero;
      const vente = await this.service.getVenteByNumero(numero);
      return ResponseHandler.success(res, vente);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getVentesByStatut(req: Request, res: Response) {
    try {
      const statut = req.params.statut as StatutVente;
      const ventes = await this.service.getVentesByStatut(statut);
      return ResponseHandler.success(res, ventes);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async createVente(req: Request, res: Response) {
    try {
      const validatedData = createVenteSchema.parse(req.body);
      const vente = await this.service.createVente(validatedData as any);
      return ResponseHandler.created(res, vente, 'Vente créée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async updateVente(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = updateVenteSchema.parse(req.body);
      const vente = await this.service.updateVente(id, validatedData as any);
      return ResponseHandler.success(res, vente, 'Vente mise à jour avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async changerStatutVente(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = changerStatutSchema.parse(req.body);
      const vente = await this.service.changerStatutVente(id, validatedData);
      return ResponseHandler.success(res, vente, 'Statut changé avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async ajouterPaiement(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = ajouterPaiementSchema.parse(req.body);
      const paiement = await this.service.ajouterPaiement(id, {
        date_paiement: validatedData.date_paiement,
        montant: validatedData.montant,
        mode_paiement: validatedData.mode_paiement,
        reference: validatedData.reference,
        commentaire: validatedData.commentaire
      } as any);
      return ResponseHandler.created(res, paiement, 'Paiement ajouté avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async rembourserVente(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = rembourserSchema.parse(req.body);
      const vente = await this.service.rembourserVente(id, validatedData as any);
      return ResponseHandler.success(res, vente, 'Vente remboursée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async annulerVente(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const vente = await this.service.annulerVente(id);
      return ResponseHandler.success(res, vente, 'Vente annulée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getLignesVente(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const lignes = await this.service.getLignesVente(id);
      return ResponseHandler.success(res, lignes);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async ajouterLigne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = createLigneSchema.parse(req.body);
      const ligne = await this.service.ajouterLigne(id, validatedData as any);
      return ResponseHandler.created(res, ligne, 'Ligne ajoutée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async updateLigne(req: Request, res: Response) {
    try {
      const idVente = req.params.id;
      const idLigne = req.params.idLigne;
      const validatedData = updateLigneSchema.parse(req.body);
      const ligne = await this.service.updateLigne(idVente, idLigne, validatedData as any);
      return ResponseHandler.success(res, ligne, 'Ligne mise à jour avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async supprimerLigne(req: Request, res: Response) {
    try {
      const idVente = req.params.id;
      const idLigne = req.params.idLigne;
      const ligne = await this.service.supprimerLigne(idVente, idLigne);
      return ResponseHandler.success(res, ligne, 'Ligne supprimée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getVentesPeriode(req: Request, res: Response) {
    try {
      const validatedData = periodeSchema.parse(req.query);
      const ventes = await this.service.getVentesPeriode(validatedData.debut, validatedData.fin);
      return ResponseHandler.success(res, ventes);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getStatsVentes(req: Request, res: Response) {
    try {
      const stats = await this.service.getStatsVentes();
      return ResponseHandler.success(res, stats);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getVentesByCaissier(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const ventes = await this.service.getVentesByCaissier(id);
      return ResponseHandler.success(res, ventes);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getVentesByClient(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const ventes = await this.service.getVentesByClient(id);
      return ResponseHandler.success(res, ventes);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async genererFacture(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const facture = await this.service.genererFacture(id);
      return ResponseHandler.created(res, facture, 'Facture générée avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async exportVentes(req: Request, res: Response) {
    try {
      const ventes = await this.service.exportVentes();
      return ResponseHandler.success(res, ventes, 'Ventes exportées avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }
}