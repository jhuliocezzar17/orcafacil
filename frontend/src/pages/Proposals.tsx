import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StatusBadge } from '../components/StatusBadge';
import { getErrorMessage } from '../lib/api';
import { formatCurrency, formatDate } from '../lib/format';
import * as clientService from '../services/clients';
import * as proposalService from '../services/proposals';

export function Proposals() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: '', totalValue: '', clientId: '' });
  const [message, setMessage] = useState<{ type: 'error' | 'ok'; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Duas buscas: os orçamentos (pra lista) e os clientes (pro select do formulário)
  const { data: proposals, isLoading } = useQuery({ queryKey: ['proposals'], queryFn: proposalService.listProposals });
  const { data: clients } = useQuery({ queryKey: ['clients'], queryFn: clientService.listClients });

  const createMutation = useMutation({
    mutationFn: () =>
      proposalService.createProposal({
        title: form.title,
        totalValue: Number(form.totalValue),
        clientId: form.clientId,
      }),
    onSuccess: () => {
      setMessage({ type: 'ok', text: 'Orçamento criado. Copie o link e envie pro cliente.' });
      setForm({ title: '', totalValue: '', clientId: '' });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
    onError: (err) => setMessage({ type: 'error', text: getErrorMessage(err) }),
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    createMutation.mutate();
  }

  // Monta o link público e copia pra área de transferência
  async function copyLink(id: string) {
    const link = `${window.location.origin}/orcamento/${id}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const total = proposals?.reduce((sum, p) => sum + p.totalValue, 0) ?? 0;
  const approved = proposals?.filter((p) => p.status === 'APPROVED').length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Orçamentos</h1>
        {proposals && proposals.length > 0 && (
          <p className="text-sm text-slate-500">
            {proposals.length} orçamento(s) · {approved} aprovado(s) · total {formatCurrency(total)}
          </p>
        )}
      </div>

      {clients?.length === 0 ? (
        <div className="card text-slate-600">
          Pra criar um orçamento, primeiro <Link to="/clientes" className="font-medium text-indigo-600 hover:underline">cadastre um cliente</Link>.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card grid gap-3 sm:grid-cols-[2fr_1fr_1.5fr_auto] sm:items-end">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">Título</label>
            <input id="title" required className="input" placeholder="Ex.: Site institucional" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label htmlFor="value" className="mb-1 block text-sm font-medium text-slate-700">Valor (R$)</label>
            <input id="value" type="number" min="1" step="0.01" required className="input" value={form.totalValue} onChange={(e) => setForm({ ...form, totalValue: e.target.value })} />
          </div>
          <div>
            <label htmlFor="client" className="mb-1 block text-sm font-medium text-slate-700">Cliente</label>
            <select id="client" required className="input" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              <option value="">Selecione...</option>
              {clients?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" disabled={createMutation.isPending} className="btn-primary">Criar</button>
        </form>
      )}

      {message && (
        <p className={`rounded-lg px-3 py-2 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {message.text}
        </p>
      )}

      <div className="card p-0">
        {isLoading && <p className="p-5 text-slate-500">Carregando orçamentos...</p>}
        {!isLoading && proposals?.length === 0 && <p className="p-5 text-slate-500">Nenhum orçamento ainda.</p>}
        <ul className="divide-y divide-slate-100">
          {proposals?.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="font-medium text-slate-900">{p.title}</p>
                <p className="text-sm text-slate-500">{p.client.name} · {formatDate(p.createdAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold tabular-nums text-slate-900">{formatCurrency(p.totalValue)}</span>
                <StatusBadge status={p.status} />
                <button onClick={() => copyLink(p.id)} className="btn-ghost py-1.5 text-sm">
                  {copiedId === p.id ? 'Link copiado!' : 'Copiar link'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
