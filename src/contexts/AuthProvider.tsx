import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthContextType, type User } from "./AuthContext";
import { STORAGE_KEY } from "@/hooks/useUserProfile";

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
   await new Promise(resolve => setTimeout(resolve, 1000));

   const user: User = { email, totalXP: 0, name: "Fulano" };

   localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
   setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
