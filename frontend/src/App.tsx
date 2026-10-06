import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Clients } from './pages/Clients';
import { Login } from './pages/Login';
import { Proposals } from './pages/Proposals';
import { PublicProposal } from './pages/PublicProposal';
import { Register } from './pages/Register';

// Mapa de rotas do frontend: cada endereço mostra uma página
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/orcamento/:id" element={<PublicProposal />} />

        {/* Rotas protegidas: só entra logado */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Proposals />} />
            <Route path="/clientes" element={<Clients />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
