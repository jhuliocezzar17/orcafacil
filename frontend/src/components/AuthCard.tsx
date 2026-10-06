import type { ReactNode } from 'react';

// Caixa centralizada usada nas telas de login e cadastro
export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="mb-6 text-center text-2xl font-bold text-indigo-700">OrçaFácil</p>
        <div className="card">
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          <p className="mb-5 mt-1 text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
