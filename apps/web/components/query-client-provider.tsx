"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

/**
 * Provedor leve do React Query para ser reutilizado entre páginas do cliente.
 * Ele inicializa o QueryClient de forma preguiçosa (lazy) para evitar recriá-lo entre renderizações.
 */
export function QueryClientProviderWrapper({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 20 * 60_000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
