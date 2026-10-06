import { api } from '../lib/api';
import type { User } from '../types';

// Cada função chama um endpoint da API. As telas usam estas funções.

export async function login(data: { email: string; password: string }) {
  const response = await api.post<{ token: string; user: User }>('/auth/login', data);
  return response.data;
}

export async function register(data: { name: string; email: string; password: string }) {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
}

export async function getMe() {
  const response = await api.get<User>('/me');
  return response.data;
}
