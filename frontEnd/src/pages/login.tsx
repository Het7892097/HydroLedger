import { IonButton, IonContent, IonPage } from "@ionic/react";
import React from "react";
import { googleLogin } from "../utils/google-auth";

const LoginPage: React.FC = () => {
  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
    // Implement Google sign in logic
  };

  const handleLogIn = () => {
    console.log("Log in clicked");
    // Navigate to login page
  };
  return (
    <IonPage>
      <IonContent>
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-8">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                HL
              </div>
              <span className="text-green-500 font-bold text-xl ml-3">
                Hydro Ledger
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full max-w-sm">
            {/* Title */}
            <h1 className="text-white text-2xl font-semibold text-center mb-2">
              Welcome
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-center mb-8 text-sm">
              Sign in with Google to get started with Hydro Ledger
            </p>

            {/* Google Sign In Button */}
            <div className="mb-8">
              <IonButton
                onClick={()=>googleLogin()}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-3 border border-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;