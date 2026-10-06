import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { TOKEN_KEY } from '../lib/api';
import * as authService from '../services/auth';
import type { User } from '../types';

// Context: um "lugar global" onde qualquer tela consegue saber quem está logado
interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao abrir o site: se já existe token salvo, pergunta pra API quem é (GET /me)
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    authService
      .getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn(email: string, password: string) {
    const { token, user } = await authService.login({ email, password });
    localStorage.setItem(TOKEN_KEY, token); // guarda a "pulseira" no navegador
    setUser(user);
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pra usar o contexto: const { user, signIn } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return context;
}
