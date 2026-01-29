import { type ReactNode, useMemo } from "react";
import {
  QueryClient,
  QueryClientProvider,
  type QueryClient as QueryClientType,
} from "@tanstack/react-query";

export interface ChatbotQueryClientProviderProps {
  children: ReactNode;
  /**
   * Optional QueryClient instance from the host app.
   * If not provided, a new QueryClient will be created internally.
   */
  queryClient?: QueryClientType;
}

/**
 * QueryClientProvider wrapper that can use an external QueryClient
 * or create an internal one if none is provided.
 * This allows the library to work standalone or share a QueryClient
 * with the host application.
 */
export function ChatbotQueryClientProvider({
  children,
  queryClient: externalQueryClient,
}: ChatbotQueryClientProviderProps) {
  // Create internal QueryClient only if external one is not provided
  const internalQueryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    []
  );

  // Use external QueryClient if provided, otherwise use internal one
  const queryClient = externalQueryClient ?? internalQueryClient;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
