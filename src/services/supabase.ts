import { createClient } from "@supabase/supabase-js";

// Em projetos Vite, variáveis de ambiente públicas devem começar com VITE_
// Configure no .env:
// VITE_SUPABASE_URL=...
// VITE_SUPABASE_ANON_KEY=...

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Log não bloqueante para ajudar no debug sem quebrar o build
  // Evite lançar erro aqui para não travar ambientes de preview/dev
  console.warn(
    "Supabase: variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configuradas no .env"
  );
}

export const supabase = createClient(
  SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY ?? ""
);

export default supabase;