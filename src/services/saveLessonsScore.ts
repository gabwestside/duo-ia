import supabase from "@/services/supabase";

export interface SaveLessonScoreParams {
  userId: string;
  lessonId: string;
  correctAnswers: number;
  wrongAnswers: number;
  xpEarned: number;
}

export interface LessonScoreData {
  scoreId: string;
}

export type SaveLessonScoreResult = {
  data: LessonScoreData | null;
  error: Error | null;
  scoreId?: string;
};

// Insere um novo registro em lesson_scores
export async function insertLessonScore(
  params: SaveLessonScoreParams
): Promise<SaveLessonScoreResult> {
  try {
    console.log("[insertLessonScore] início", params);

    const { data, error } = await supabase
      .from("lesson_scores")
      .insert({
        user_id: params.userId,
        lesson_id: params.lessonId,
        correct_answers: params.correctAnswers,
        wrong_answers: params.wrongAnswers,
        xp_earned: params.xpEarned,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[insertLessonScore] erro", error);
      return { data: null, error: error as unknown as Error };
    }

    const id = data?.id as string;
    console.log("[insertLessonScore] sucesso", { id });

    return { data: { scoreId: id }, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[insertLessonScore] exceção", error);
    return { data: null, error };
  }
}

// Atualiza um registro existente em lesson_scores
export async function updateLessonScore(
  params: SaveLessonScoreParams,
  existingScoreId: string
): Promise<SaveLessonScoreResult> {
  try {
    const { data, error } = await supabase
      .from("lesson_scores")
      .update({
        correct_answers: params.correctAnswers,
        wrong_answers: params.wrongAnswers,
        xp_earned: params.xpEarned,
        completed_at: new Date().toISOString(),
      })
      .eq("id", existingScoreId)
      .select("id")
      .single();

    if (error) {
      console.error("[updateLessonScore] erro", error);
      return { data: null, error: error as unknown as Error };
    }

    const id = data?.id as string;
    console.log("[updateLessonScore] sucesso", { id });

    return { data: { scoreId: id }, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[updateLessonScore] exceção", error);
    return { data: null, error };
  }
}

// Decide entre insert e update com base na existência de scoreId
export async function saveLessonsScore(
  params: SaveLessonScoreParams
): Promise<SaveLessonScoreResult> {
  try {
    const { data: existingScores, error } = await supabase
      .from("lesson_scores")
      .select("id, xp_earned")
      .eq("user_id", params.userId)
      .eq("lesson_id", params.lessonId)
      .limit(1);

    if (error) {
      console.error("[saveLessonsScore] erro ao verificar existência", error);
      return { data: null, error: error as Error };
    }

    const existingScore = existingScores?.[0];
    const previousXP = existingScore ? existingScore.xp_earned : 0;

    const result = existingScore
      ? await updateLessonScore(params, existingScore.id)
      : await insertLessonScore(params);

    if (result.error || !result.data) {
      return { data: null, error: result.error };
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("total_xp")
      .eq("id", params.userId)
      .single();

    if (profileError) {
      console.error(
        "[saveLessonsScore] erro ao buscar perfil do usuário",
        profileError
      );
      return { data: null, error: profileError as Error };
    }

    console.log("salvando novo xp");

    const newTotalXP =
      (profile?.total_xp || 0) + (params.xpEarned - previousXP);

    const { error: updateProfileError } = await supabase
      .from("user_profiles")
      .update({
        total_xp: newTotalXP,
      })
      .eq("id", params.userId);

    if (updateProfileError) {
      console.error(
        "[saveLessonsScore] erro ao atualizar total_xp do usuário",
        updateProfileError
      );
      return { data: null, error: updateProfileError as Error };
    }

    console.log("pontuação foi salva com sucesso");
    return {
      data: result.data,
      scoreId: result.data.scoreId,
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[saveLessonsScore] exceção", error);
    return { data: null, error };
  }
}
