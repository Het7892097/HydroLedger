// hooks/useAuthGuard.ts
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { sessionProvider } from "../utils/supabase-utils";
import { supabaseClient } from "../services/db/supabaseClient";
import { useUserContext } from "./userContext";

export const useAuthGuard = () => {
  const navigate = useHistory();
 const { setUser } = useUserContext();
  const showToast=useToast();
  useEffect(() => {
    (async () => {
      const session = await sessionProvider();

      if (!session) {
        navigate.push("/login");
      } else {
        const { data, error } = await supabaseClient.auth.refreshSession();
        const supabaseData = data.session;
        if (error || !data?.session) {
            showToast({message:"Session Expired, Please Login Again",type:"danger"});
          navigate.push("/login");
        } else {
          setUser({
            email: supabaseData.user.email ?? "",
            imageUrl: supabaseData.user.user_metadata.avatar_url ?? "",
            name: supabaseData.user.user_metadata.name,
            phone: supabaseData.user.phone ?? "",
            token: data.session.access_token,
          });
        }
      }
    })();
  }, []);
};
