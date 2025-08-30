import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../assets/contract.json";

const CONTRACT_ADDRESS = "0xe05CA878936d86b7cdfdDB11888B090Dd91cd55f";

const RoleWalletForm = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [status, setStatus] = useState("");
  const [balance, setBalance] = useState("");
  const [role, setRole] = useState("");

  const roles = ["admin", "producer", "consumer", "authority"];

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
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);

      // Fetch balance
      const rawBalance = await provider.getBalance(address);
      setBalance(parseFloat(ethers.formatEther(rawBalance)).toFixed(4));

      // Initialize contract
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      // Role-based actions (switch)
      switch (selectedRole) {
        case "producer": {
          const tx = await contract.addProducer(address);
          await tx.wait();
          setStatus(`✅ Producer added! Tx hash: ${tx.hash}`);
          break;
        }
        case "consumer": {
          const tx = await contract.addConsumer(address);
          await tx.wait();
          setStatus(`✅ Consumer added! Tx hash: ${tx.hash}`);
          break;
        }
        case "authority": {
          const tx = await contract.addVerifier(address);
          await tx.wait();
          setStatus(`✅ Verifier added! Tx hash: ${tx.hash}`);
          break;
        }
        case "admin":
          setStatus(`✅ Admin wallet connected: ${address}`);
          break;
        default:
          setStatus(`✅ Wallet connected: ${address}`);
      }
    } catch (err) {
      console.error(err);
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
