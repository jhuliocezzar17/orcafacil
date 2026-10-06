import { api } from '../lib/api';
import type { Client } from '../types';

type ClientInput = { name: string; email: string };

export async function listClients() {
  const response = await api.get<Client[]>('/clients'); // GET: busca
  return response.data;
}

export async function createClient(data: ClientInput) {
  const response = await api.post<Client>('/clients', data); // POST: cria
  return response.data;
}

export async function updateClient(id: string, data: ClientInput) {
  const response = await api.put<Client>(`/clients/${id}`, data); // PUT: atualiza tudo
  return response.data;
}

export async function deleteClient(id: string) {
  await api.delete(`/clients/${id}`); // DELETE: apaga
}
