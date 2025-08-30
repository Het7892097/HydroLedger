import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { googleLogin } from "./utils/googleAuth.util";
import { supabaseClient } from "./utils/supabase.util";

function App() {
  const [count, setCount] = useState(0);
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("User signed in!", session);
        // Now you can use session.user or store it
      } else console.log("Usre is not signed in");
    });
  return (
    <>
      <div>
        <p className="text-red-500"> Hello</p>
        <button onClick={()=>googleLogin()}>Sign in with google</button>
      </div>
    </>
  );
}

export default App;
