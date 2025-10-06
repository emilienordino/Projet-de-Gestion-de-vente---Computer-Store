import { z } from 'zod';

export const createUtilisateurSchema = z.object({
  nom_utilisateur: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(100),
  email: z.string().email('Email invalide').max(150),
  role: z.enum(['ADMIN', 'RESP_STOCK', 'CAISSIER']).optional(),
});

export const updateUtilisateurSchema = z.object({
  nom_utilisateur: z.string().min(3).max(100).optional(),
  email: z.string().email().max(150).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ doit être fourni pour la mise à jour',
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'L\'ancien mot de passe est requis'),
  newPassword: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/[!@#$%^&*]/, 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)'),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export const changeStatutSchema = z.object({
  statut: z.enum(['ACTIF', 'INACTIF', 'BLOQUE'])
});

export const changeRoleSchema = z.object({
  role: z.enum(['ADMIN', 'RESP_STOCK', 'CAISSIER'])
});