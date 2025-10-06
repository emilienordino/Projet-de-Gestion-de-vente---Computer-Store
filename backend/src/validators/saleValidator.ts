import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';

export const createVenteSchema = z.object({
  date_vente: z.string().transform((str) => new Date(str)),
  id_caissier: z.string().min(1),
  id_client: z.string().optional(),
  total_brut: z.number().positive().transform(num => new Decimal(num)),
  remise_total: z.number().nonnegative().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  total_net: z.number().positive().transform(num => new Decimal(num)),
  statut_vente: z.enum(['COMMANDE', 'EN_COURS', 'PAYEE', 'REMBOURSEE', 'ANNULEE']).optional(),
  commentaire: z.string().max(500).optional(),
});

export const updateVenteSchema = z.object({
  date_vente: z.string().transform(str => new Date(str)).optional(),
  id_caissier: z.string().min(1).optional(),
  id_client: z.string().optional(),
  total_brut: z.number().positive().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  remise_total: z.number().nonnegative().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  total_net: z.number().positive().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  statut_vente: z.enum(['COMMANDE', 'EN_COURS', 'PAYEE', 'REMBOURSEE', 'ANNULEE']).optional(),
  commentaire: z.string().max(500).optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'Au moins un champ doit être fourni' });

export const changerStatutSchema = z.object({
  statut_vente: z.enum(['COMMANDE', 'EN_COURS', 'PAYEE', 'REMBOURSEE', 'ANNULEE']),
});

export const ajouterPaiementSchema = z.object({
  date_paiement: z.string().transform(str => new Date(str)),
  montant: z.number().positive().transform(num => new Decimal(num)),
  mode_paiement: z.enum(['CASH', 'CARTE', 'MOBILE_MONEY', 'CHEQUE', 'AUTRE']),
  reference: z.string().max(150).optional(),
  commentaire: z.string().max(500).optional(),
});

export const rembourserSchema = z.object({
  montant: z.number().positive().transform(num => new Decimal(num)), 
  commentaire: z.string().max(500).optional(),
});

export const createLigneSchema = z.object({
  id_produit: z.string().min(1),
  quantite: z.number().int().positive(),
  prix_unitaire: z.number().positive().transform(num => new Decimal(num)),
  type_remise_ligne: z.enum(['MONTANT', 'POURCENTAGE']).optional(),
  valeur_remise_ligne: z.number().nonnegative().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  sous_total: z.number().positive().optional().transform(num => num !== undefined ? new Decimal(num) : undefined)
});

export const updateLigneSchema = z.object({
  quantite: z.number().int().positive().optional(),
  prix_unitaire: z.number().positive().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  type_remise_ligne: z.enum(['MONTANT', 'POURCENTAGE']).optional(),
  valeur_remise_ligne: z.number().nonnegative().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  sous_total: z.number().positive().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
}).refine(data => Object.keys(data).length > 0, { message: 'Au moins un champ doit être fourni' });

export const periodeSchema = z.object({
  debut: z.string().transform(str => new Date(str)),
  fin: z.string().transform(str => new Date(str)),
});