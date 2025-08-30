import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import UserProvider from "./contexts/userContext";
import { ToastProvider } from "./contexts/toastContext";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <UserProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </UserProvider>
  </React.StrictMode>
);
