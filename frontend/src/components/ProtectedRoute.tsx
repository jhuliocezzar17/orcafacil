import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// O "segurança" do frontend: se não estiver logado, manda pro login
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <p className="p-8 text-slate-500">Carregando...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />; // Outlet = "renderiza aqui a página filha"
}
