import { TypeRemise } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';

export const createLigneVenteSchema = z.object({
  id_vente: z.string().min(1, 'L\'ID de vente est requis'),
  id_produit: z.string().min(1, 'L\'ID du produit est requis'),
  quantite: z.number().int().positive('La quantité doit être un nombre entier positif'),
  prix_unitaire: z.number().positive().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  type_remise_ligne: z.enum(['MONTANT', 'POURCENTAGE']).optional(),
  valeur_remise_ligne: z.number().nonnegative().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
});

export const updateLigneVenteSchema = z.object({
  quantite: z.number().int().positive('La quantité doit être un nombre entier positif').optional(),
  prix_unitaire: z.number().positive().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
  type_remise_ligne: z.enum(['MONTANT', 'POURCENTAGE']).optional(),
  valeur_remise_ligne: z.number().nonnegative().optional().transform(num => num !== undefined ? new Decimal(num) : undefined),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour',
});

export const appliquerRemiseSchema = z.object({
  type_remise: z.nativeEnum(TypeRemise, {
    // pas de required_error ici
  }).refine(val => val !== undefined, {
    message: "Le type de remise est requis"
  }),

  valeur_remise: z.number()
    .nonnegative("La valeur de remise doit être positive ou nulle")
    .transform(num => new Decimal(num))
});