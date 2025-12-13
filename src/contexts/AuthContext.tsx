import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js"

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{error: Error | null}>;
  login: (email: string, password: string) => Promise<{ error: Error | null }> ;
  logout: () => Promise<void>;
}

// ------------------------------------------------------------
// 2. CRIAÇÃO DO CONTEXTO
// ------------------------------------------------------------
// createContext cria um "container" que vai guardar nossos dados.
// O valor inicial é undefined porque será preenchido pelo Provider.

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// ------------------------------------------------------------
// 3. HOOK PERSONALIZADO (useAuth)
// ------------------------------------------------------------
// Este hook facilita o uso do contexto em outros componentes.
// Em vez de usar useContext(AuthContext), usamos apenas useAuth().
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Se alguém tentar usar useAuth() fora do AuthProvider, mostra erro
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
