import { useEffect, useMemo, useState } from "react";
import supabase from "@/services/supabase";
import { useAuth } from "@/contexts/AuthContext";

export type CompletedLessonId = string;

export interface UseCompletedLessonsResult {
  loading: boolean;
  error: Error | null;
  completedLessons: CompletedLessonId[];
  isUnitCompleted: (unitId: string) => boolean;
  refetch: () => Promise<void>;
}

// Busca as lições completadas na tabela lesson_scores para o usuário atual
export function useCompletedLessons(): UseCompletedLessonsResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [completedLessons, setCompletedLessons] = useState<CompletedLessonId[]>(
    []
  );

  const userId = user?.id;

  const fetchLessons = useMemo(
    () => async () => {
      if (!userId) {
        setCompletedLessons([]);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Seleciona lesson_id distintos do usuário
        const { data, error: qError } = await supabase
          .from("lesson_scores")
          .select("lesson_id")
          .eq("user_id", userId);

        if (qError) {
          console.error("[useCompletedLessons] erro ao buscar lições", qError);
          setError(qError as unknown as Error);
          setCompletedLessons([]);
          return;
        }

        const ids = Array.from(
          new Set((data ?? []).map((row: any) => row.lesson_id as string))
        );

        console.log("[useCompletedLessons] lições carregadas", {
          userId,
          count: ids.length,
          ids,
        });

        setCompletedLessons(ids);
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        console.error("[useCompletedLessons] exceção", e);
        setError(e);
        setCompletedLessons([]);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const isUnitCompleted = (unitId: string) => {
    const isCompleted = completedLessons.includes(unitId);
    return isCompleted;
  };

  return {
    loading,
    error,
    completedLessons,
    isUnitCompleted,
    refetch: fetchLessons,
  };
}

export default useCompletedLessons;
