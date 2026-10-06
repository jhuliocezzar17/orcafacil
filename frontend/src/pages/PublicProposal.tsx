import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StatusBadge } from '../components/StatusBadge';
import { getErrorMessage } from '../lib/api';
import { formatCurrency, formatDate } from '../lib/format';
import * as proposalService from '../services/proposals';

// Página que o CLIENTE FINAL abre pelo link. Não precisa de login.
export function PublicProposal() {
  const { id } = useParams<{ id: string }>(); // pega o :id da URL /orcamento/:id
  const queryClient = useQueryClient();

  const { data: proposal, isLoading, isError } = useQuery({
    queryKey: ['public-proposal', id],
    queryFn: () => proposalService.getPublicProposal(id!),
    enabled: !!id,
    retry: false,
  });

  const approveMutation = useMutation({
    mutationFn: () => proposalService.approvePublicProposal(id!), // PATCH .../approve
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['public-proposal', id] }),
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <p className="mb-6 text-center text-2xl font-bold text-indigo-700">OrçaFácil</p>

        {isLoading && <div className="card text-slate-500">Carregando orçamento...</div>}

        {isError && (
          <div className="card text-center">
            <p className="text-lg font-semibold text-slate-900">Orçamento não encontrado</p>
            <p className="mt-1 text-sm text-slate-500">Confira se o link está completo.</p>
          </div>
        )}

        {proposal && (
          <div className="card space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Orçamento para {proposal.client.name}</p>
                <h1 className="text-xl font-semibold text-slate-900">{proposal.title}</h1>
              </div>
              <StatusBadge status={proposal.status} />
            </div>

            <p className="text-3xl font-bold tabular-nums text-slate-900">{formatCurrency(proposal.totalValue)}</p>

            <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              <p>Enviado por <span className="font-medium text-slate-900">{proposal.user.name}</span></p>
              <p>{proposal.user.email} · {formatDate(proposal.createdAt)}</p>
            </div>

            {proposal.status === 'PENDING' && (
              <button onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending} className="btn-primary w-full py-3">
                {approveMutation.isPending ? 'Aprovando...' : 'Aprovar orçamento'}
              </button>
            )}

            {proposal.status === 'APPROVED' && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700">
                Orçamento aprovado. Obrigado!
              </p>
            )}

            {approveMutation.isError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{getErrorMessage(approveMutation.error)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
