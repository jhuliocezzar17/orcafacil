// Tipos que espelham as respostas da API (o "formato" dos dados)

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  userId: string;
}

export type ProposalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Proposal {
  id: string;
  title: string;
  totalValue: number;
  status: ProposalStatus;
  createdAt: string;
  clientId: string;
  client: { name: string };
}

export interface PublicProposal {
  id: string;
  title: string;
  totalValue: number;
  status: ProposalStatus;
  createdAt: string;
  client: { name: string };
  user: { name: string; email: string };
}
