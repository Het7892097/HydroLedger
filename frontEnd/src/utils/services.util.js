import { sessionProvider } from "./supabase.util";

export async function getReqHeaders(){
    const token=await sessionProvider();
    console.log(token);
return {
    "Authorization": `Bearer ${token.access_token}`,
    "Accept":"Application/json",
    "bypass-tunnel-reminder":true,
    "Accept-Encoding":"gzip, deflate, br",
    "Connection":"keep-alive"
}
}

export async function postReqHeaders(){
    const token=await sessionProvider().access_token;

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,      
    }
}

