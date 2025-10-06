import { Request, Response } from 'express';
import { ClientService } from '../services/clientService';
import { ResponseHandler } from '../utils/responseHandler';

export class ClientController {
  private service: ClientService;

  constructor() {
    this.service = new ClientService();
  }

  async getAll(req: Request, res: Response) {
    try {
      const clients = await this.service.getAll();
      return ResponseHandler.success(res, clients);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const client = await this.service.getById(req.params.id);
      return ResponseHandler.success(res, client);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getByCode(req: Request, res: Response) {
    try {
      const client = await this.service.getByCode(req.params.code);
      return ResponseHandler.success(res, client);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const auditInfo = {
        id_utilisateur: req.user!.id_utilisateur,
        ip_adresse: req.ip || req.socket.remoteAddress || 'unknown'
      };
      
      const client = await this.service.create(req.body, auditInfo);
      return ResponseHandler.created(res, client, 'Client ajouté avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const auditInfo = {
        id_utilisateur: req.user!.id_utilisateur,
        ip_adresse: req.ip || req.socket.remoteAddress || 'unknown'
      };
      
      const client = await this.service.update(req.params.id, req.body, auditInfo);
      return ResponseHandler.success(res, client, 'Client mis à jour avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async supprimer(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const auditInfo = {
        id_utilisateur: req.user!.id_utilisateur,
        ip_adresse: req.ip || req.socket.remoteAddress || 'unknown'
      };
      
      const client = await this.service.supprimer(id, auditInfo);
      return ResponseHandler.success(res, client, 'Client supprimé avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async search(req: Request, res: Response) {
    try {
      const clients = await this.service.search(req.query as { nom?: string; telephone?: string });
      return ResponseHandler.success(res, clients);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getActifs(req: Request, res: Response) {
    try {
      const clients = await this.service.getActifs(); 
      return ResponseHandler.success(res, clients);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getSupprimes(req: Request, res: Response) {
    try {
      const clients = await this.service.getSupprimes();
      return ResponseHandler.success(res, clients);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getHistoriqueVentes(req: Request, res: Response) {
    try {
      const ventes = await this.service.getHistoriqueVentes(req.params.id);
      return ResponseHandler.success(res, ventes);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getStatsClient(req: Request, res: Response) {
    try {
      const stats = await this.service.getStatsClient(req.params.id);
      return ResponseHandler.success(res, stats);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async restaurer(req: Request, res: Response) {
    try {
      const auditInfo = {
        id_utilisateur: req.user!.id_utilisateur,
        ip_adresse: req.ip || req.socket.remoteAddress || 'unknown'
      };
      
      const client = await this.service.restaurer(req.params.id, auditInfo);
      return ResponseHandler.success(res, client, 'Client restauré avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }
}