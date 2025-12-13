import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";
import type { User } from "@supabase/supabase-js";
import supabase from "@/services/supabase";
import createOrUpdateUserProfile from "@/services/userProfile";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    console.log("AuthProvider mounted, setting up auth state change listener");
    

    // Configura um listener para mudanças de autenticação do Supabase.
    // Não chamamos getSession separadamente; confiamos no onAuthStateChange,
    // que dispara imediatamente com o evento "INITIAL_SESSION" contendo a sessão atual.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {

      console.log("Auth event:", event, "Session:", session);
      
      // Atualiza o usuário com session?.user ou null em todos os eventos relevantes
      setUser(session?.user ?? null);

      // Atualiza loading para false quando a sessão inicial é carregada ou quando o usuário faz login
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        setLoading(false);
      }

      // Se o usuário sair, também atualiza o loading
      if (event === "SIGNED_OUT") {
        setLoading(false);
      }
    });

    // Retorna um cleanup que cancela a inscrição no listener ao desmontar o componente.
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login via Supabase usando email e senha.
  // Retorna um objeto com 'error' para alinhar com o AuthContext.
  const login = async (
    email: string,
    password: string
  ): Promise<{ error: Error | null }> => {

    console.log("fazendo login");
    

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });

    console.log("data", data);
    

    if (error) {
      console.error("Erro ao fazer login:", error);
      return { error };
    } 

    // Atualiza o estado do usuário imediatamente após login bem-sucedido
    // Isso garante que isAuthenticated seja true antes da navegação
    if (data.user) {
      setUser(data.user);
      setLoading(false);
    }

    return { error: null };
  };

  // Logout via Supabase e limpeza do estado local
  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ error: Error | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Erro ao cadastrar usuário:", error);

      return { error };
    }

    if (data.user) {
      await createOrUpdateUserProfile(data.user.id, name, email);
    }

    return { error: null };
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    signUp,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
