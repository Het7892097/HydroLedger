// hooks/useAuthGuard.ts
import { useEffect } from "react";
import { sessionProvider, supabaseClient } from "../utils/supabase.util";
import { useUserContext } from "./userContext";
import { getUserByEmail } from "../services/user.service";
import { useNavigate } from "react-router-dom";

export const useAuthGuard = () => {
 const router=useNavigate();
 const { setUser } = useUserContext();
  useEffect(() => {
    (async () => {
      const session = await sessionProvider();

      if (!session) {
        router("/login");
      } else {
        const { data, error } = await supabaseClient.auth.refreshSession();
        const supabaseData = data.session;
        if (error || !data?.session) {
            showToast({message:"Session Expired, Please Login Again",type:"danger"});
          router("/login");
        } else {
          const response=await getUserByEmail(data.session.user.email);
          setUser({
            email: supabaseData.user.email ?? "",
            imageUrl: supabaseData.user.user_metadata.avatar_url ?? "",
            name: supabaseData.user.user_metadata.name,
            phone: supabaseData.user.phone ?? "",
            token: data.session.access_token,
            id:response.id??"",
            wallet_address:response.wallet_address || null,
            role: response.role || null,
          });
        }
      }
    })();
  }, []);
};
