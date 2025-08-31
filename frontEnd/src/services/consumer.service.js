import { envProvider } from "../utils/envProvider.util";
import { getReqHeaders } from "../utils/services.util";
import { sessionProvider } from "../utils/supabase.util";

export async function getVerifiedTransactionsAPI() {
  const token = await sessionProvider();
  const response = await fetch(
    `${envProvider("VITE_BASE_API_URL")}transactions-verified`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching verified transactions: ${response.status}`);
  }

  return await response.json();
}
