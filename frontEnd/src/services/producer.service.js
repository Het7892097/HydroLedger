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


// ----------------------
// 1. Get User by UUID
// ----------------------
export async function getUserAPI(uuid) {
    const response = await fetch(
        `${envProvider("VITE_BASE_API_URL")}/get-user?uuid=${uuid}`,
        {
            method: "GET",
            headers: await getReqHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(`Error fetching user: status ${response.status}`);
    }

    return await response.json();
}

// ----------------------
// 3. Get Transaction by ID
// ----------------------
export async function getTransactionByIdAPI(transaction_id) {
    const response = await fetch(
        `${envProvider("VITE_BASE_API_URL")}/get-transaction-id?transaction_id=${transaction_id}`,
        {
            method: "GET",
            headers: await getReqHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(`Error fetching transaction: status ${response.status}`);
    }

    return await response.json();
}

// ----------------------
// 4. Get Transactions by Wallet Address
// ----------------------
export async function getTransactionsByWalletAPI(wallet_address) {
    const response = await fetch(
        `${envProvider("VITE_BASE_API_URL")}/get-all-transactions-wallet?wallet_address=${wallet_address}`,
        {
            method: "GET",
            headers: await getReqHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Error fetching transactions by wallet: status ${response.status}`
        );
    }

    return await response.json();
}

// ----------------------
// 5. Get Transactions by Credit ID
// ----------------------
export async function getTransactionsByCreditAPI(credit_id) {
    const response = await fetch(
        `${envProvider("VITE_BASE_API_URL")}/get-all-transactions-credit?credit_id=${credit_id}`,
        {
            method: "GET",
            headers: await getReqHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Error fetching transactions by credit: status ${response.status}`
        );
    }

    return await response.json();
}

// ----------------------
// 6. Get Pending Transactions
// ----------------------
export async function getPendingTransactionsAPI() {
    const response = await fetch(
        `${envProvider("VITE_BASE_API_URL")}/transactions-pending`,
        {
            method: "GET",
            headers: await getReqHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(`Error fetching pending transactions: ${response.status}`);
    }

    return await response.json();
}

// ----------------------
// 7. Get Verified Transactions
// ----------------------
export async function getVerifiedTransactionsAPI() {
    const response = await fetch(
        `${envProvider("VITE_BASE_API_URL")}/transactions-verified`,
        {
            method: "GET",
            headers: await getReqHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(`Error fetching verified transactions: ${response.status}`);
    }

    return await response.json();
}

// ----------------------
// 8. Get Company by User ID
// ----------------------
export async function getCompanyAPI(user_id) {
    const response = await fetch(
        `${envProvider("VITE_BASE_API_URL")}/get-company?user_id=${user_id}`,
        {
            method: "GET",
            headers: await getReqHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(`Error fetching company: status ${response.status}`);
    }

    return await response.json();
}

// ----------------------
// 9. Create Company
// ----------------------
export async function createCompanyAPI(companyData) {
    const response = await fetch(
        `${envProvider("VITE_BASE_API_URL")}/company/create`,
        {
            method: "POST",
            headers: {
                ...(await getReqHeaders()),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: String(companyData.user_id),
                name: companyData.name,
                description: companyData.description,
                created_at:
                    companyData.created_at instanceof Date
                        ? companyData.created_at.toISOString()
                        : companyData.created_at,
                metadata: companyData.metadata || {},
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Error creating company: status ${response.status}`);
    }

    return await response.json();
}

// ----------------------
// 10. Update Company
// ----------------------
export async function updateCompanyAPI(companyData) {
    const response = await fetch(
        `${envProvider("VITE_BASE_API_URL")}/company/update`,
        {
            method: "POST",
            headers: {
                ...(await getReqHeaders()),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: String(companyData.user_id),
                name: companyData.name,
                description: companyData.description,
                created_at:
                    companyData.created_at instanceof Date
                        ? companyData.created_at.toISOString()
                        : companyData.created_at,
                metadata: companyData.metadata || {},
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Error updating company: status ${response.status}`);
    }

    return await response.json();
}



