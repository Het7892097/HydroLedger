import { createRoot } from "react-dom/client";
import "../index.css";
import App from "./App.jsx";
import UserProvider from "./context/userContext.jsx";

(async () => {
  createRoot(document.getElementById("root")).render(
    <UserProvider>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
      </style>
      <App />
    </UserProvider>
  );
})();
