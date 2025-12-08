import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  totalXP: number;
}

export const STORAGE_KEY = "devlingo:auth:user";

export const useUserProfile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);

      try {
        const userProfile: UserProfile = {
          id: "user-123",
          name: user.name,
          email: user.email,
          totalXP: user.totalXP,
        };

        setProfile(userProfile);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar perfil do usuário.");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  return { profile, loading, error };
};
