import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vite: a ferramenta que roda o frontend em modo desenvolvimento e gera a versão final (build)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
});
