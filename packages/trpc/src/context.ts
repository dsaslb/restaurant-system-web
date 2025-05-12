import { prisma } from '@restaurant-system/config';

export interface Context {
  prisma: typeof prisma;
}

export const createContext = (): Context => ({
  prisma,
}); 