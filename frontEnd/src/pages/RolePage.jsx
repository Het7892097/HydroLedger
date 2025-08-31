import React, { useState } from "react";
import contractABI from "../assets/contract.json";
import { envProvider } from "../utils/envProvider.util";
import { BrowserProvider, Contract, ethers } from "ethers";
import { createCompanyAPI, createUserAPI } from "../services/profile_service";
import { useNavigate } from "react-router-dom";

const CONTRACT_ADDRESS = `${envProvider("VITE_CONTRACT_ADDRESS")}`;

const RoleWalletForm = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [status, setStatus] = useState("");
  const [balance, setBalance] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const roles = ["producer", "consumer", "authority"];

  const connectWallet = async (selectedRole) => {
    if (!selectedRole) {
      alert("Please select a role first!");
      return;
    }
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setStatus("⏳ Connecting wallet...");

      // 1. Check current network
      let chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log("Current chainId:", chainId);

      // 2. Ensure we're on Sepolia (0xaa36a7)
      if (chainId !== "0xaa36a7") {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
          console.log("Switched to Sepolia");
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia Testnet",
                  nativeCurrency: {
                    name: "SepoliaETH",
                    symbol: "SepoliaETH",
                    decimals: 18,
                  },
                  rpcUrls: [
                    "https://sepolia.infura.io/v3/3e44d582b674450596206ee2f1ac59bb",
                  ],
                  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
                },
              ],
            });
            console.log("Sepolia chain added");
          } else {
            throw switchError;
          }
        }
        chainId = await window.ethereum.request({ method: "eth_chainId" });
        console.log("Updated chainId:", chainId);
      }

      // 3. Create provider and signer (ethers v6)
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);

      // 4. Fetch balance (ethers v6)
      const rawBalance = await provider.getBalance(address);
      setBalance(parseFloat(ethers.formatEther(rawBalance)).toFixed(4));

      // 5. Initialize contract
      const contract = new Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      const UserDetails = localStorage.getItem("UserProfileDetails");
      let formattedData = JSON.parse(UserDetails);

      formattedData = {
        ...formattedData,
        role: selectedRole,
      };

      const userid = formattedData?.id;

      localStorage.setItem("UserProfileDetails", JSON.stringify(formattedData));

      const CompanyDetails = localStorage.getItem(CompanyDetails);
      let jsonData = JSON.parse(CompanyDetails);

      jsonData = {
        ...jsonData,
        id: userid,
      };
      localStorage.setItem("CompanyDetails", JSON.stringify(jsonData));

      await createUserAPI(formattedData);
      await createCompanyAPI(jsonData);

      // 6. Role-based actions
      switch (selectedRole) {
        case "producer": {
          const tx = await contract.addProducer(address);
          await tx.wait();
          navigate("/admin");
          setStatus(`✅ Producer added! Tx hash: ${tx.hash}`);
          break;
        }
        case "consumer": {
          const tx = await contract.addConsumer(address);
          await tx.wait();
          navigate("/admin");
          setStatus(`✅ Consumer added! Tx hash: ${tx.hash}`);
          break;
        }
        case "authority": {
          try {
            const isProd = await contract.addVerifier(address);
            await isProd.wait();
            navigate("/admin");
            setStatus(`✅ Consumer added! Tx hash: ${isProd.hash}`);
          } catch (contractError) {
            console.error("Contract read error:", contractError);
            setStatus(`❌ Contract read error: ${contractError.message}`);
          }
          break;
        }
        default:
          setStatus(`✅ Wallet connected: ${address}`);
      }
    } catch (err) {
      console.error("Error in connectWallet:", err);
      setStatus(`❌ Wallet connection failed: ${err.message}`);
    }
  };

  const formatAddress = (addr) => addr.slice(0, 6) + "..." + addr.slice(-4);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    connectWallet(role);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1c2233] text-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Avatar + Title */}
        <div className="flex flex-col items-center">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="avatar"
            className="w-16 h-16 rounded-full mb-4"
          />
          <h2 className="text-xl font-bold">Connect Your Wallet</h2>
        </div>

        {/* Role Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!role}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              !role
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500"
            }`}
          >
            Connect Wallet
          </button>
        </form>

        {/* Status */}
        {/* {status && (
          <div className="mt-2 bg-gray-700 p-3 rounded-lg text-sm text-center">
          {status} 
          </div>
        )} */}

        {/* Wallet Info */}
        {walletAddress && (
          <div className="mt-2 text-center text-gray-300 space-y-1">
            <p>Wallet: {formatAddress(walletAddress)}</p>
            <p>Balance: {balance} ETH</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleWalletForm;
