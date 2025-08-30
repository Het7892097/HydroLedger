import { envProvider } from "../utils/envProvider.util";
import { getReqHeaders } from "../utils/services.util";
import { sessionProvider } from "../utils/supabase.util";
import axios from "axios";

export async function getUserByEmail(email) {
  const token=await sessionProvider();
  if(!token) throw new Error("No session found, please login again.");
  const response = await fetch(
  `${envProvider("VITE_BASE_API_URL")}authenticate`,
  {
    headers: {"bypass-tunnel-reminder":"true","Authorization":`Bearer ${token.access_token}`},
    method:"GET",
  }
);

  if (response.status !== 200)
    throw new Error(
      `Error fetching user with status:${response.status} for email ${email}`
    );
  // const data = await response.json();
  return await response.json();
}

export async function updateUserData({ uuid, wallet_address, role }) {
  const params = new URLSearchParams();
  params.append("uuid", uuid);
  if (wallet_address) params.append("wallet_address", wallet_address);
  if (role) params.append("role", role);

  const response = await fetch(
    `${envProvider("VITE_BASE_API_URL")}/updateuser?${params.toString()}`,
    {
      method: "GET",
      headers: await getReqHeaders(),
    }
  );
  if (response.status !== 200)
    throw new Error(`Error updating user: status ${response.status}`);
  return await response.json();
}

export async function createTransaction(transactionData) {
  const response = await fetch(
    `${envProvider("VITE_BASE_API_URL")}/create-transaction`,
    {
      method: "POST",
      headers: {
        ...(await getReqHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    }
  );
  if (response.status !== 200)
    throw new Error(`Error creating transaction: status ${response.status}`);
  return await response.json();
}
