import { Role, Statut } from '@prisma/client';
import { Request, Response } from 'express';
import { UtilisateurService } from '../services/userService';
import { ResponseHandler } from '../utils/responseHandler';
import {
  changePasswordSchema,
  changeRoleSchema,
  changeStatutSchema,
  createUtilisateurSchema,
  loginSchema,
  updateUtilisateurSchema
} from '../validators/userValidator';

export class UtilisateurController {
  private service: UtilisateurService;

  constructor() {
    this.service = new UtilisateurService();
  }

  async getAllUtilisateurs(req: Request, res: Response) {
    try {
      const users = await this.service.getAllUtilisateurs();
      return ResponseHandler.success(res, users);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getUtilisateurById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await this.service.getUtilisateurById(id);
      return ResponseHandler.success(res, user);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async getUtilisateursByRole(req: Request, res: Response) {
    try {
      const role = req.params.role as Role;
      const users = await this.service.getUtilisateursByRole(role);
      return ResponseHandler.success(res, users);
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async createUtilisateur(req: Request, res: Response) {
    try {
      const validatedData = createUtilisateurSchema.parse(req.body);
      const result = await this.service.createUtilisateur(validatedData);
      
      return ResponseHandler.created(res, {
        user: result.user,
        message: 'Utilisateur créé avec succès. Un email avec le mot de passe temporaire a été envoyé.'
      }, 'Utilisateur créé avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async updateUtilisateur(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = updateUtilisateurSchema.parse(req.body);
      const user = await this.service.updateUtilisateur(id, validatedData);
      return ResponseHandler.success(res, user, 'Utilisateur mis à jour avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async changeStatut(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = changeStatutSchema.parse(req.body);
      const user = await this.service.changeStatut(id, validatedData.statut as Statut);
      return ResponseHandler.success(res, user, 'Statut modifié avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async changeRole(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = changeRoleSchema.parse(req.body);
      const user = await this.service.changeRole(id, validatedData.role as Role);
      return ResponseHandler.success(res, user, 'Rôle modifié avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = changePasswordSchema.parse(req.body);
      await this.service.changePassword(id, validatedData.oldPassword, validatedData.newPassword);
      return ResponseHandler.success(res, null, 'Mot de passe modifié avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.service.login(validatedData.email, validatedData.password);
      
      return ResponseHandler.success(res, {
        user: result.user,
        token: result.token,
        message: 'Connexion réussie'
      });
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      if (!req.user) {
        return ResponseHandler.error(res, 'Utilisateur non authentifié', 401);
      }
      
      await this.service.logout(req.user.id_utilisateur);
      return ResponseHandler.success(res, null, 'Déconnexion réussie');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }

  async deleteUtilisateur(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await this.service.deleteUtilisateur(id);
      return ResponseHandler.success(res, user, 'Utilisateur désactivé avec succès');
    } catch (error) {
      return ResponseHandler.handleError(error, res);
    }
  }
}