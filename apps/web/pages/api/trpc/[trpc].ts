import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '@trpc/router';

export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
