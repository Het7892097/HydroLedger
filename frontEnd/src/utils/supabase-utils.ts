import { supabaseClient } from "../services/db/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { SupabaseSession } from "../types/User";

export async function sessionProvider():Promise<SupabaseSession | null> {
  const supaSession =await supabaseClient.auth.getSession();
  return supaSession.data.session as SupabaseSession;
}