import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';

export const createFactureSchema = z.object({
  id_vente: z.string().min(1, 'L\'ID de vente est requis')
});

export const updateFactureSchema = z.object({
  date_emission: z.string().transform(str => new Date(str)).optional(),
  montant_total: z.number().positive('Le montant doit être positif').optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  pdf_url: z.string().max(255, 'L\'URL du PDF ne doit pas dépasser 255 caractères').optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour',
});

export const periodeFactureSchema = z.object({
  debut: z.string().transform(str => new Date(str)),
  fin: z.string().transform(str => new Date(str)),
});