import { z } from 'zod';

export const createCategorieSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom ne doit pas dépasser 100 caractères'),
  description: z.string().max(500, 'La description ne doit pas dépasser 500 caractères').optional(),
});

export const updateCategorieSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom ne doit pas dépasser 100 caractères').optional(),
  description: z.string().max(500, 'La description ne doit pas dépasser 500 caractères').optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour',
});  