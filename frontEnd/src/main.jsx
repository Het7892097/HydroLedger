import { createRoot } from "react-dom/client";
import "../index.css";
import App from "./App.jsx";
import axios from "axios";

// axiox,defaults.baseURL =""
// axios.defaults.baseURL = "https://api.weddingclick.in/api/v1";

axios.defaults.headers.common["ngrok-skip-browser-warning"] = true;
axios.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "access_token"
    )}`;
    return config;
  },
  (error) => Promise.reject(error)
);

(async () => {
  createRoot(document.getElementById("root")).render(
    <>
      <App />
    </>
  );
})();
