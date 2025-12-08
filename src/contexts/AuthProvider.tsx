import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextType, type User } from "./AuthContext";
import { STORAGE_KEY } from "@/hooks/useUserProfile";
import supabase from "@/services/supabase";
import createOrUpdateUserProfile from "@/services/userProfile";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      console.log("Restaurando usuário do localStorage:", raw);

      if (raw) {
        const savedUser: User = JSON.parse(raw);
        setUser(savedUser);
      }
    } catch (err) {
      console.error("Falha ao restaurar sessão:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user: User = { email, totalXP: 0, name: "Fulano" };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
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
