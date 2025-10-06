import { Request, Response } from 'express';
import { ProduitService } from '../services/productService';
import { createProduitSchema, searchProduitSchema, updateProduitSchema, updateStockSchema } from '../validators/productValidator';

export class ProduitController {
  private service: ProduitService; 

  constructor() {
    this.service = new ProduitService();
  }

  async getAllProduits(_req: Request, res: Response) {
    try {
      const produits = await this.service.getAllProduits(); 
      res.status(200).json({ 
        success: true, 
        data: produits 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async getProduitById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const produit = await this.service.getProduitById(id);
      res.status(200).json({ 
        success: true, 
        data: produit 
      });
    } catch (error) {
      res.status(404).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async getProduitByCode(req: Request, res: Response) {
    try {
      const code = req.params.code;
      const produit = await this.service.getProduitByCode(code);
      res.status(200).json({ 
        success: true, 
        data: produit 
      });
    } catch (error) {
      res.status(404).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async createProduit(req: Request, res: Response) {
    try {
      const validatedData = createProduitSchema.parse(req.body);
      const produit = await this.service.createProduit(validatedData);
      res.status(201).json({ 
        success: true, 
        message: 'Produit ajouté avec succès', 
        data: produit 
      });
    } catch (error: any) {
      if (error.name === 'ZodError' && error.issues) {
        const errorMessages = error.issues.map((issue: any) => ({
          field: issue.path[0] || 'field',
          message: issue.message,
        }));
        return res.status(400).json({ 
          success: false,
          message: 'Données invalides',
          errors: errorMessages 
        });
      }
      res.status(400).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async updateProduit(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = updateProduitSchema.parse(req.body);
      const produit = await this.service.updateProduit(id, validatedData);
      res.status(200).json({ 
        success: true, 
        message: 'Produit mis à jour avec succès', 
        data: produit 
      });
    } catch (error: any) {
      if (error.name === 'ZodError' && error.issues) {
        const errorMessages = error.issues.map((issue: any) => ({
          field: issue.path[0] || 'field',
          message: issue.message,
        }));
        return res.status(400).json({ 
          success: false,
          message: 'Données invalides',
          errors: errorMessages 
        });
      }
      res.status(400).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async supprimerProduit(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const produit = await this.service.supprimerProduit(id);
      res.status(200).json({ 
        success: true, 
        message: 'Produit supprimé avec succès', 
        data: produit 
      });
    } catch (error) {
      res.status(404).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async updateStock(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const validatedData = updateStockSchema.parse(req.body);
      const produit = await this.service.updateStock(id, validatedData.stock);
      res.status(200).json({ 
        success: true, 
        message: 'Stock mis à jour avec succès', 
        data: produit 
      });
    } catch (error: any) {
      if (error.name === 'ZodError' && error.issues) {
        const errorMessages = error.issues.map((issue: any) => ({
          field: issue.path[0] || 'field',
          message: issue.message,
        }));
        return res.status(400).json({ 
          success: false,
          message: 'Données invalides',
          errors: errorMessages 
        });
      }
      res.status(400).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async getProduitsEnRupture(_req: Request, res: Response) {
    try {
      const produits = await this.service.getProduitsEnRupture();
      res.status(200).json({ 
        success: true, 
        data: produits 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async getProduitsAlerte(_req: Request, res: Response) {
    try {
      const produits = await this.service.getProduitsAlerte();
      res.status(200).json({ 
        success: true, 
        data: produits 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async getProduitsByCategorie(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const produits = await this.service.getProduitsByCategorie(id);
      res.status(200).json({ 
        success: true, 
        data: produits 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async searchProduits(req: Request, res: Response) {
    try {
      const validatedParams = searchProduitSchema.parse(req.query);
      const produits = await this.service.searchProduits(validatedParams);
      res.status(200).json({ 
        success: true, 
        data: produits 
      });
    } catch (error: any) {
      if (error.name === 'ZodError' && error.issues) {
        const errorMessages = error.issues.map((issue: any) => ({
          field: issue.path[0] || 'field',
          message: issue.message,
        }));
        return res.status(400).json({ 
          success: false,
          message: 'Paramètres de recherche invalides',
          errors: errorMessages 
        });
      }
      res.status(400).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async getProduitsActifs(_req: Request, res: Response) {
    try {
      const produits = await this.service.getProduitsActifs();
      res.status(200).json({ 
        success: true, 
        data: produits 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async getProduitsSupprimes(_req: Request, res: Response) {
    try {
      const produits = await this.service.getProduitsSupprimes();
      res.status(200).json({ 
        success: true, 
        data: produits 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async restaurerProduit(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const produit = await this.service.restaurerProduit(id);
      res.status(200).json({ 
        success: true, 
        message: 'Produit restauré avec succès', 
        data: produit 
      });
    } catch (error) {
      res.status(404).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async getStatsStock(_req: Request, res: Response) {
    try {
      const stats = await this.service.getStatsStock();
      res.status(200).json({ 
        success: true, 
        data: stats 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }

  async getHistoriquePrix(_req: Request, res: Response) {
    try {
      const historique = await this.service.getHistoriquePrix();
      res.status(200).json({ 
        success: true, 
        data: historique 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: (error as Error).message 
      });
    }
  }
}