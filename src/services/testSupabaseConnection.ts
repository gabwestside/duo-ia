import supabase from './supabase'

export interface SupabaseTestResult {
  data?: {
    session: any | null
  }
  ok: boolean
  error?: string
}

// Testa a conexão chamando um endpoint leve (auth.getSession)
export async function testSupabaseConnection(): Promise<SupabaseTestResult> {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      return { data: { session: null }, ok: false, error: error.message }
    }

    // Se não houver erro, consideramos a conexão funcional
    return { data, ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}

export default testSupabaseConnection
