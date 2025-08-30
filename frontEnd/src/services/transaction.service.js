import { envProvider } from "../utils/envProvider.util";
import { getReqHeaders } from "../utils/services.util";
import { sessionProvider } from "../utils/supabase.util";

export async function getTransactionById(transaction_id) {
  const params = new URLSearchParams({ transaction_id });
  const response = await fetch(`${envProvider("VITE_BASE_API_URL")}/get-transaction?${params.toString()}`, {
    method: "GET",
    headers: await getReqHeaders(),
  });
  if (response.status !== 200)
    throw new Error(`Transaction not found: status ${response.status}`);
  return await response.json();
}

export async function getAllTransactions(wallet_address) {
  const params = new URLSearchParams({ wallet_address });
  const response = await fetch(`${envProvider("VITE_BASE_API_URL")}/get-all-transactions?${params.toString()}`, {
    method: "GET",
    headers: await getReqHeaders(),
  });
  if (response.status !== 200)
    throw new Error(`Error fetching transactions: status ${response.status}`);
  return await response.json();
}

export async function getPendingTransactions() {
  const response = await fetch(`${envProvider("VITE_BASE_API_URL")}/transactions/pending`, {
    method: "GET",
    headers: await getReqHeaders(),
  });
  if (response.status !== 200)
    throw new Error(`Error fetching pending transactions: status ${response.status}`);
  return await response.json();
}

export async function getVerifiedTransactions() {
  const response = await fetch(`${envProvider("VITE_BASE_API_URL")}/transactions/verified`, {
    method: "GET",
    headers: await getReqHeaders(),
  });
  if (response.status !== 200)
    throw new Error(`Error fetching verified transactions: status ${response.status}`);
  return await response.json();
}

