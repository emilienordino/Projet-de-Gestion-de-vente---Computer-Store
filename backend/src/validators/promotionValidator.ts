import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';

export const createPromotionSchema = z.object({
  nom: z.string().min(1).max(150),
  code_promotion: z.string().min(3).max(20).optional(),
  description: z.string().optional(),
  type_promo: z.enum(['MONTANT', 'POURCENTAGE']),
  valeur: z.number().positive().transform(num => new Decimal(num)),
  date_debut: z.string().transform(str => new Date(str)),
  date_fin: z.string().transform(str => new Date(str)),
  id_produit: z.string().optional(),
  id_categorie: z.string().optional(),
});

export const updatePromotionSchema = z.object({
  nom: z.string().min(1).max(150).optional(),
  description: z.string().optional(),
  type_promo: z.enum(['MONTANT', 'POURCENTAGE']).optional(),
  valeur: z.number().positive().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  date_debut: z.string().transform(str => new Date(str)).optional(),
  date_fin: z.string().transform(str => new Date(str)).optional(),
  id_produit: z.string().optional(),
  id_categorie: z.string().optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'Au moins un champ doit être fourni' });

export const appliquerPromotionSchema = z.object({
  code_promotion: z.string().min(3).max(20),
  montant: z.number().positive().transform(num => new Decimal(num)),
});