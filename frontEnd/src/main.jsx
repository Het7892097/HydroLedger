import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";

// axios.defaults.baseURL = "https://6636-2401-4900-1c80-4f3c-d89f-4255-fb9d-7c9c.ngrok-free.app/api/v1";
// axios.defaults.baseURL = "http://localhost:3001/api/v1";
// axios.defaults.baseURL = "https://rich.serveo.net/api/v1";
// axios.defaults.baseURL = "https://suited-ox-trivially.ngrok-free.app/api/v1";
axios.defaults.baseURL = "https://api.weddingclick.in/api/v1";

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
