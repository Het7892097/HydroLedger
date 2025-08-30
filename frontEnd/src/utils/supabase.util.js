import { createClient } from "@supabase/supabase-js";
import { envProvider } from "./envProvider.util";

export const supabaseClient = createClient(envProvider('VITE_SUPABASE_URL'), envProvider('VITE_SUPABASE_ANON_KEY'));

export async function sessionProvider() {
  const supaSession = await supabaseClient.auth.getSession();
  return supaSession.data.session;
}