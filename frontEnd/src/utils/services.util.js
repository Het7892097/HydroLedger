import { sessionProvider } from "./supabase.util";

export async function getReqHeaders() {
    return {
        "Authorization": `Bearer ${await sessionProvider().access_token}`,
    }
}

export async function postReqHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${await sessionProvider().access_token}`,
    }
}

