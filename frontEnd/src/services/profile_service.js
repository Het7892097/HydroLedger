import { envProvider } from "../utils/envProvider.util";
import { getReqHeaders } from "../utils/services.util";

// ------------------------------
// Create User API
// ------------------------------
export async function createUserAPI(userData) {
    const response = await fetch(`${envProvider("VITE_BASE_API_URL")}/create-user`, {
        method: "POST",
        headers: {
            ...(await getReqHeaders()),
            "Content-Type": "application/json",
            "bypass-tunnel-reminder": true,
        },
        body: JSON.stringify({
            id: userData.id,
            email_id: userData.email_id,
            full_name: userData.full_name,
            wallet_address: userData.wallet_address,
            role: userData.role,
            created_at: Date.now(),
        }),
    });

    if (!response.ok) {
        throw new Error(`Error creating user: status ${response.status}`);
    }

    return await response.json();
}

// ------------------------------
// Create Company API
// ------------------------------
export async function createCompanyAPI(companyData) {
    const response = await fetch(`${envProvider("VITE_BASE_API_URL")}/company/create`, {
        method: "POST",
        headers: {
            ...(await getReqHeaders()),
            "Content-Type": "application/json",
            "bypass-tunnel-reminder": true,
        },
        body: JSON.stringify({
            id: companyData.id,
            description: companyData.description,
            name: companyData.name,
            created_at: Date.now(),
            meta_data: companyData.meta_data || {},
        }),
    });

    if (!response.ok) {
        throw new Error(`Error creating company: status ${response.status}`);
    }

    return await response.json();
}
