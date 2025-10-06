import { ModePaiement, StatutPaiement } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';

export const createPaiementSchema = z.object({
  id_vente: z.string().min(1, 'L\'ID de vente est requis'),
  date_paiement: z.string().transform(str => new Date(str)),
  montant: z.number().positive('Le montant doit être positif').transform(num => new Decimal(num)),
  mode_paiement: z.nativeEnum(ModePaiement)
  .refine(val => val !== undefined, { message: 'Le mode de paiement est requis' }),

  reference: z.string().max(150, 'La référence ne doit pas dépasser 150 caractères').optional(),
  commentaire: z.string().max(500, 'Le commentaire ne doit pas dépasser 500 caractères').optional(),
});

export const updatePaiementSchema = z.object({
  date_paiement: z.string().transform(str => new Date(str)).optional(),
  montant: z.number().positive('Le montant doit être positif').optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  mode_paiement: z.enum(['CASH', 'CARTE', 'MOBILE_MONEY', 'CHEQUE', 'AUTRE']).optional(),
  reference: z.string().max(150).optional(),
  commentaire: z.string().max(500).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour',
});

export const changerStatutPaiementSchema = z.object({
  statut: z.nativeEnum(StatutPaiement)
  .refine(val => val !== undefined, { message: 'Le statut est requis' }),
});

export const periodePaiementSchema = z.object({
  debut: z.string().transform(str => new Date(str)),
  fin: z.string().transform(str => new Date(str)),
});