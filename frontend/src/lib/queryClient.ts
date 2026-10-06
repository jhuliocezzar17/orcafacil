import { QueryClient } from '@tanstack/react-query';

// React Query: guarda em cache os dados buscados da API e cuida de carregando/erro
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});
