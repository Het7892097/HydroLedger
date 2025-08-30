import { createClient } from "@supabase/supabase-js";
const env = import.meta.env;
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function sessionProvider() {
  const supaSession =await supabaseClient.auth.getSession();
  return supaSession.data.session;
}