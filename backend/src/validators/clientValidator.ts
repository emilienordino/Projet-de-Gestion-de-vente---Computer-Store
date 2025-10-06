import { z } from 'zod';

export const createClientSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().optional(),
  telephone: z.string().min(1, 'Le téléphone est requis').regex(/^\+?[1-9]\d{9,14}$/, 'Téléphone invalide'),
  email: z.string().email().optional(),
  adresse: z.string().optional(),
});

export const updateClientSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').optional(),
  prenom: z.string().optional(),
  telephone: z.string().min(1, 'Le téléphone est requis').regex(/^\+?[1-9]\d{9,14}$/, 'Téléphone invalide').optional(),
  email: z.string().email().optional(),
  adresse: z.string().optional(),
});

export const searchClientSchema = z.object({
  nom: z.string().optional(), 
  telephone: z.string().optional(),
}).strict();