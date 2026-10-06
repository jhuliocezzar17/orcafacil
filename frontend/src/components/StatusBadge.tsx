import type { ProposalStatus } from '../types';

const styles: Record<ProposalStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pendente', className: 'bg-amber-100 text-amber-800' },
  APPROVED: { label: 'Aprovado', className: 'bg-emerald-100 text-emerald-800' },
  REJECTED: { label: 'Recusado', className: 'bg-red-100 text-red-800' },
};

// Etiqueta colorida do status do orçamento
export function StatusBadge({ status }: { status: ProposalStatus }) {
  const { label, className } = styles[status];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{label}</span>;
}
