import { z } from 'zod';

export const periodeAuditSchema = z.object({
  debut: z.string().transform(str => new Date(str)),
  fin: z.string().transform(str => new Date(str)),
});

export const deleteOldAuditsSchema = z.object({
  joursAConserver: z.number().int().positive('Le nombre de jours doit être positif')
});