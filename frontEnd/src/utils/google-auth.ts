import { SocialLogin } from "@capgo/capacitor-social-login";
import { storedUser } from "../types/User";
import { supabaseClient } from "../services/db/supabaseClient";
// import {}

export const googleLogin = async () => {
  console.log("Inside social-login login approach");
  try {
    console.log(1);
    // const response = await SocialLogin.login({
    //     provider: "google",
    //     options: {
    //       scopes: ["email", "profile"],
    //       // forceRefreshToken: true,
    //       style:"bottom"
    //     },
    //   });
    console.log(2);
    const res = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "email profile",
        redirectTo: "http://localhost:8100/oauth/callback",
      },
    });

    // debugger;
    if (res) {
      //   const user: storedUser = JSON.parse(
      //     JSON.stringify(res, null, 2)
      //   );
      console.log(res);
      // return user;
    } else {
      // return null;
      console.log("no response");
    }
  } catch (error: unknown) {
    // return null;
    console.log("Error occurred while logging", error);
  }
};
