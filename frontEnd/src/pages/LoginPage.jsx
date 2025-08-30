import React, { useState } from "react";
import { Formik, Form } from "formik";
import { ethers } from "ethers";
import contractABI from "../assets/contract.json";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "./utils/googleAuth.util";
import { supabaseClient } from "./utils/supabase.util";

const SignInPage = () => {
  const handleGoogleSignIn = () => {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("User signed in!", session);
        // Now you can use session.user or store it
      } else console.log("Usre is not signed in");
      connectWallet();
    });
  };
  const navigate = useNavigate();

  const CONTRACT_ADDRESS = "0xe05CA878936d86b7cdfdDB11888B090Dd91cd55f";

  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setStatus("⏳ Connecting wallet...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);

      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      setStatus(`✅ Wallet connected: ${address}`);
      localStorage.setItem("Step1", address);

      navigate("/register");
    } catch (err) {
      console.error(err);
      setStatus(`❌ Wallet connection failed: ${err.message}`);
    }
  };

  const formatAddress = (addr) => addr.slice(0, 6) + "..." + addr.slice(-4);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-lato">
      {/* Left side image */}
      <div
        className="hidden md:flex md:w-3/5 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1546883648-8c5648200abc?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />

      {/* Right side form */}
      <div className="flex w-full md:w-2/5 justify-center items-center bg-[#FCFCFC] px-4 font-lato">
        <Formik initialValues={{}} onSubmit={() => {}}>
          {() => (
            <Form className="bg-white w-full max-w-sm sm:max-w-md border rounded-lg px-8 my-10 py-16 text-center">
              <h3 className="text-xl font-bold pb-6 text-gray-700">
                Hydro Ledger
              </h3>
              <h1 className="text-[28px] font-bold pb-1 tracking-tight font-sans">
                Welcome Back!
              </h1>
              <h4 className="text-[#9AA6B7] font-medium pb-7 tracking-tight text-sm md:text-lg">
                Connect your wallet to continue to Hydro Ledger
              </h4>

              {/* Status Message */}
              {status && (
                <div className="mb-6 p-3 rounded-lg bg-gray-50 border text-gray-700 text-sm">
                  {status}
                </div>
              )}

              {/* Wallet Connect Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-lg border border-green-500 bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors duration-200 text-sm md:text-base mb-4"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
              </button>

              {/* Wallet Address Display */}
              {walletAddress && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50 border">
                  <p className="text-gray-400 text-xs mb-1">
                    Connected Wallet:
                  </p>
                  <p className="text-green-600 font-mono text-sm">
                    {formatAddress(walletAddress)}
                  </p>
                </div>
              )}

              <p className="text-gray-400 font-light pt-4 text-sm">
                New to Hydro Ledger?
                <span className="text-gray-700 underline pl-1 cursor-pointer">
                  Learn more
                </span>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignInPage;
