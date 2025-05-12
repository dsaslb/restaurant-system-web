import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from 'packages/trpc/src/router';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from 'packages/trpc/src/router';

export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});

export const trpc = createTRPCReact<AppRouter>();
