import supabase from "@/services/supabase";

export interface UserProfilePayload {
	id: string;
	name: string;
	email: string;
}

// Cria ou atualiza o perfil do usuário na tabela 'profiles'
// Espera que a tabela tenha pelo menos as colunas: id (PK), name, email
export async function createOrUpdateUserProfile(
	userId: string,
	name: string,
	email: string
): Promise<{ error?: string | null }> {
	try {

		console.log("[userProfile] checking existing", { userId });
		const { data: existing, error: fetchError } = await supabase
			.from("user_profiles")
			.select('id')
            .eq('id', userId)
            .single();

        console.log("[userProfile] existing result", { existing, fetchError });
        if (existing && !fetchError) { 
          console.log("[userProfile] profile already exists, skipping insert");
          return { error: null }; 
        }

        console.log("[userProfile] inserting profile", { userId, name, email });
        const { error: insertError } = await supabase
            .from("user_profiles")
            .insert({ id: userId, name, email, total_xp: 0 });

		if (insertError) {
			console.error("[userProfile] insert error", insertError);
			return { error: insertError.message };
		}

		console.log("[userProfile] insert success");
		return { error: null };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error("[userProfile] exception", message);
		return { error: message };
	}
}

export default createOrUpdateUserProfile;