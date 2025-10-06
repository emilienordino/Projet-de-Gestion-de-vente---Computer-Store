import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateCode = async (prefix: string, model: any, field: string): Promise<string> => {
  const count = await model.count();
  return `${prefix}-${(count + 1).toString().padStart(5, '0')}`;
};