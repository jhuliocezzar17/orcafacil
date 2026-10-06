import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../lib/api';
import { formatDate } from '../lib/format';
import * as clientService from '../services/clients';
import type { Client } from '../types';

const emptyForm = { name: '', email: '' };

export function Clients() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null); // null = criando; id = editando
  const [message, setMessage] = useState<{ type: 'error' | 'ok'; text: string } | null>(null);

  // useQuery: busca a lista (GET /clients) e guarda em cache com a chave ['clients']
  const { data: clients, isLoading } = useQuery({ queryKey: ['clients'], queryFn: clientService.listClients });

  // Depois de criar/editar/apagar, manda o React Query buscar a lista de novo
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['clients'] });

  // useMutation: usado pra pedidos que MUDAM dados (POST, PUT, DELETE)
  const saveMutation = useMutation({
    mutationFn: () => (editingId ? clientService.updateClient(editingId, form) : clientService.createClient(form)),
    onSuccess: () => {
      setMessage({ type: 'ok', text: editingId ? 'Cliente atualizado.' : 'Cliente cadastrado.' });
      setForm(emptyForm);
      setEditingId(null);
      refresh();
    },
    onError: (err) => setMessage({ type: 'error', text: getErrorMessage(err) }),
  });

  const deleteMutation = useMutation({
    mutationFn: clientService.deleteClient,
    onSuccess: () => {
      setMessage({ type: 'ok', text: 'Cliente apagado.' });
      refresh();
    },
    onError: (err) => setMessage({ type: 'error', text: getErrorMessage(err) }), // ex.: 409 se tiver orçamento
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    saveMutation.mutate();
  }

  function startEdit(client: Client) {
    setEditingId(client.id);
    setForm({ name: client.name, email: client.email });
    setMessage(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>

      <form onSubmit={handleSubmit} className="card grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="client-name" className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
          <input id="client-name" required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label htmlFor="client-email" className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
          <input id="client-email" type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
            {editingId ? 'Salvar' : 'Adicionar'}
          </button>
          {editingId && <button type="button" onClick={cancelEdit} className="btn-ghost">Cancelar</button>}
        </div>
      </form>

      {message && (
        <p className={`rounded-lg px-3 py-2 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {message.text}
        </p>
      )}

      <div className="card p-0">
        {isLoading && <p className="p-5 text-slate-500">Carregando clientes...</p>}
        {!isLoading && clients?.length === 0 && (
          <p className="p-5 text-slate-500">Nenhum cliente ainda. Cadastre o primeiro no formulário acima.</p>
        )}
        <ul className="divide-y divide-slate-100">
          {clients?.map((client) => (
            <li key={client.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="font-medium text-slate-900">{client.name}</p>
                <p className="text-sm text-slate-500">{client.email} · desde {formatDate(client.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(client)} className="btn-ghost py-1.5 text-sm">Editar</button>
                <button
                  onClick={() => confirmDelete(client) && deleteMutation.mutate(client.id)}
                  className="btn-danger py-1.5 text-sm"
                >
                  Apagar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function confirmDelete(client: Client) {
  return window.confirm(`Apagar o cliente "${client.name}"?`);
}
