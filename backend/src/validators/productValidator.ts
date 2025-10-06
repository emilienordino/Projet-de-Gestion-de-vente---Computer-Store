import { z } from 'zod';

export const createProduitSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(150, 'Le nom ne doit pas dépasser 150 caractères'),
  description: z.string().max(500, 'La description ne doit pas dépasser 500 caractères').optional(),
  prix_unitaire: z.number().positive('Le prix doit être positif'),
  photo: z.string().optional(),
  stock: z.number().int().nonnegative('Le stock ne peut pas être négatif'),
  stock_min: z.number().int().nonnegative('Le stock minimum ne peut pas être négatif').optional(),
  id_categorie: z.string().min(1, 'L\'ID de catégorie est requis'),
  actif: z.boolean().optional(),
});

export const updateProduitSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(150, 'Le nom ne doit pas dépasser 150 caractères').optional(),
  description: z.string().max(500, 'La description ne doit pas dépasser 500 caractères').optional(),
  prix_unitaire: z.number().positive('Le prix doit être positif').optional(),
  photo: z.string().optional(),
  stock: z.number().int().nonnegative('Le stock ne peut pas être négatif').optional(),
  stock_min: z.number().int().nonnegative('Le stock minimum ne peut pas être négatif').optional(),
  id_categorie: z.string().min(1, 'L\'ID de catégorie est requis').optional(),
  actif: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour',
});

export const updateStockSchema = z.object({
  stock: z.number().int().nonnegative('Le stock ne peut pas être négatif'),
});

export const searchProduitSchema = z.object({
  query: z.string().optional(),
  categorieId: z.string().min(1).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un paramètre de recherche doit être fourni',
});