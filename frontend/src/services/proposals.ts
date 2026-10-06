import { api } from '../lib/api';
import type { Proposal, PublicProposal } from '../types';

export async function listProposals() {
  const response = await api.get<Proposal[]>('/proposals');
  return response.data;
}

export async function createProposal(data: { title: string; totalValue: number; clientId: string }) {
  const response = await api.post<Proposal>('/proposals', data);
  return response.data;
}

// Rotas públicas: não precisam de token (o cliente final não tem conta)
export async function getPublicProposal(id: string) {
  const response = await api.get<PublicProposal>(`/public/proposals/${id}`);
  return response.data;
}

export async function approvePublicProposal(id: string) {
  const response = await api.patch(`/public/proposals/${id}/approve`); // PATCH: muda só o status
  return response.data;
}
