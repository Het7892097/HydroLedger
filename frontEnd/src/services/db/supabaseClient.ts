import { createClient } from "@supabase/supabase-js";
const env = import.meta.env;

const supabaseUrl = "https://utsokuqdlkkgpgidthtq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0c29rdXFkbGtrZ3BnaWR0aHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0OTYxNjcsImV4cCI6MjA3MjA3MjE2N30.Cr60d6qhO7ijho978cMMRRnnh7B1x1nPrc6DHSYyWZU";
export const supabaseClient = createClient(supabaseUrl, supabaseKey);
