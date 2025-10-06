import { ActionAudit } from '@prisma/client';
import { Request, Response } from 'express';
import { AuditService } from '../services/auditService';
import { ResponseHandler } from '../utils/responseHandler';
import { deleteOldAuditsSchema, periodeAuditSchema } from '../validators/auditValidator';

export class AuditController {
  private service: AuditService;

  constructor() {
    this.service = new AuditService();
  }

  async getAllAudits(req: Request, res: Response) {
    try {
      const audits = await this.service.getAllAudits();
      return ResponseHandler.success(res, audits);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getAuditById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const audit = await this.service.getAuditById(id);
      return ResponseHandler.success(res, audit);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getAuditsByUser(req: Request, res: Response) {
    try {
      const idUtilisateur = req.params.idUtilisateur;
      const audits = await this.service.getAuditsByUser(idUtilisateur);
      return ResponseHandler.success(res, audits);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getAuditsByTable(req: Request, res: Response) {
    try {
      const table = req.params.table;
      const audits = await this.service.getAuditsByTable(table);
      return ResponseHandler.success(res, audits);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getAuditsByAction(req: Request, res: Response) {
    try {
      const action = req.params.action as ActionAudit;
      const audits = await this.service.getAuditsByAction(action);
      return ResponseHandler.success(res, audits);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getAuditsPeriode(req: Request, res: Response) {
    try {
      const validatedData = periodeAuditSchema.parse(req.query);
      const audits = await this.service.getAuditsPeriode(validatedData.debut, validatedData.fin);
      return ResponseHandler.success(res, audits);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getStatsAudits(req: Request, res: Response) {
    try {
      const stats = await this.service.getStatsAudits();
      return ResponseHandler.success(res, stats);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async deleteOldAudits(req: Request, res: Response) {
    try {
      const validatedData = deleteOldAuditsSchema.parse(req.body);
      const count = await this.service.deleteOldAudits(validatedData.joursAConserver);
      return ResponseHandler.success(res, { count }, `${count} audits supprimés avec succès`);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }
}