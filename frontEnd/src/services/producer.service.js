import { envProvider } from "../utils/envProvider.util";
import { getReqHeaders } from "../utils/services.util";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL

export async function createTransactionAPI(transactionData) {
    const response = await fetch(`${envProvider("VITE_BASE_API_URL")}/create-transaction`, {
        method: "POST",
        headers: {
            ...(await getReqHeaders()),
            "Content-Type": "application/json",
            "bypass-tunnel-reminder": true
        },
        body: JSON.stringify({
            transaction_id: transactionData.transaction_id,
            sender_wallet_address: transactionData.sender_wallet_address,
            receiver_wallet_address: transactionData.receiver_wallet_address,
            credit_id: transactionData.credit_id,
            credits: Number(transactionData.credits),
            metadata: transactionData.metadata || {},
            status: "Pending",
            created_at: Date.now()
        }),
    });

    if (!response.ok) {
        throw new Error(`Error creating transaction: status ${response.status}`);
    } else {
        console.log("Success");

    }

    return await response.json();
}
