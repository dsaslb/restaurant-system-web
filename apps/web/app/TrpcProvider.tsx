'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '../src/utils/trpc';
import { ReactNode, useState } from 'react';
import { httpBatchLink } from '@trpc/client';

export default function TrpcProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
} 