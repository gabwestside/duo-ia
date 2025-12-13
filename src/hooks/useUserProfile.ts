import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/services/supabase";
import { useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  total_xp: number;
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

        console.log("user.id:", user.id);

        const { data, error } = await supabase
          .from("user_profiles")
          .select("id, name, email, total_xp")
          .eq("id", user.id)
          .maybeSingle();

          console.log("userProfile:", data);
          
        
        if (error) {
          console.log("Erro ao buscar perfil do usuário:", error);
          setError("Erro ao buscar perfil do usuário.");
          setProfile(null);
        } else{
          setProfile(data);
          setError(null);
        }
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
