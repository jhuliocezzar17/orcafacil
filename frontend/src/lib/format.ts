// Formata número como dinheiro brasileiro: 1500 -> "R$ 1.500,00"
export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Formata data: "2026-10-04T21:24:37Z" -> "04/10/2026"
export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR');
}
