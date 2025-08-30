import { supabaseClient } from "./supabase.util";

export const googleLogin = async () => {
  console.log("Inside google-login");
  try {
   const res = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "email profile",
        // redirectTo: "http://localhost:5173/oauth/callback",
      },
    });

    if (res) {
      console.log(res,"suuccessful loging");
      return true;
    } else {
      console.log("no response");
      return false;
    }
  } catch (error) {
    console.log("Error occurred while google-logging", error);
    return false;
  }
};
