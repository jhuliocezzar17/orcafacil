import axios from 'axios';

// Chave usada pra guardar o token no navegador
export const TOKEN_KEY = '@orcafacil:token';

// Instância do axios: todo pedido pra API sai daqui, já com o endereço base
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
});

// Interceptor de pedido: antes de cada requisição, coloca o token no header
// (é o "mostrar a pulseira" automaticamente em todo pedido)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: se a API responder 401 (token vencido/inválido),
// limpa o token e manda pro login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Pega a mensagem de erro que a API mandou ({ error: "..." })
export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente de novo.') {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { error?: string } | undefined)?.error ?? fallback;
  }
  return fallback;
}
