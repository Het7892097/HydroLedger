import React, { useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import {
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Users,
  CreditCard,
  Wallet,
} from "lucide-react";
import { supabaseClient } from "../services/db/supabaseClient";
import { useAuthGuard } from "../contexts/authGaurd";

const SettingsPage: React.FC = () => {
  useAuthGuard();
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      console.log("User signed in!", session);
      // Now you can use session.user or store it
    } else console.log("Usre is not signed in");
  });

  useEffect(() => {
    (async () => {
      const supaSession = await supabaseClient.auth.getSession();
      const accessToken = supaSession.data.session;
      console.log(accessToken);
    })();
  }, []);

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar className="bg-[#0b0f19] text-white border-b border-gray-800">
          <IonTitle className="text-lg font-semibold">Wallet</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-[#0b0f19] text-white">
        <div className="p-4 space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between bg-[#1c2233] rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-sm text-gray-300">Welcome,</p>
                <h2 className="text-lg font-bold">Arina</h2>
                <p className="text-xs text-gray-400">Your Wallet - Grey</p>
              </div>
            </div>
            <button className="bg-green-400 p-2 rounded-full text-black">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Balance Card */}
          <div className="bg-[#1c2233] rounded-3xl p-6 text-center shadow-lg">
            <p className="text-sm text-gray-400">Total Balance</p>
            <h1 className="text-4xl font-extrabold mt-2">$10,7K</h1>
            <button className="absolute right-6 top-6 bg-green-400/20 p-2 rounded-full">
              <CreditCard className="w-5 h-5 text-green-400" />
            </button>
          </div>

          {/* Withdraw & Deposit */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center bg-[#1c2233] rounded-2xl p-6 shadow-md">
              <ArrowDownCircle className="w-8 h-8 text-green-400 mb-2" />
              <span className="text-sm">Withdraw</span>
            </button>
            <button className="flex flex-col items-center bg-[#1c2233] rounded-2xl p-6 shadow-md">
              <ArrowUpCircle className="w-8 h-8 text-green-400 mb-2" />
              <span className="text-sm">Deposit</span>
            </button>
          </div>

          {/* Transactions Card */}
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-3xl p-6 text-black shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Register ID
                </p>
                <h2 className="text-2xl font-bold">REG-123456</h2>
              </div>
              <CreditCard className="w-8 h-8 text-black" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Wallet ID</p>
                <h2 className="text-2xl font-bold">WAL-987654</h2>
              </div>
              <Wallet className="w-8 h-8 text-black" />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
