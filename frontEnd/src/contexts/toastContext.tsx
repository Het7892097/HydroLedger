// toast-context.tsx
import { IonToast } from "@ionic/react";
import { createContext, useContext, useState } from "react";

type ToastOptions = {
  message: string;
  duration?: number;
  type?: string;
};

const ToastContext = createContext<(opts: ToastOptions) => void>(() => {});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastOpts, setToastOpts] = useState<ToastOptions | null>(null);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (opts: ToastOptions) => {
    setToastOpts(opts);
    setShowToast(true);
  };

  return (
    <ToastContext.Provider value={triggerToast}>
      <IonToast
        isOpen={showToast}
        message={toastOpts?.message}
        duration={toastOpts?.duration || 2500}
        color={toastOpts?.type || "primary"}
        animated={true}
        position="top"
        translucent={true}
        swipeGesture="vertical"
        onDidDismiss={() => setShowToast(false)}
      ></IonToast>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
