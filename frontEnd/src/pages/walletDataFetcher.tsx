import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "./../../public/contract.json";

// Replace this with your deployed contract address
const CONTRACT_ADDRESS = "0xc8a43807447cfd91e0DbF6c5d656655431b92998";

// Type for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const [producer, setProducer] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [metadata, setMetadata] = useState<string>("");
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signerInstance = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signerInstance);
      const address = await signerInstance.getAddress();
      setSigner(signerInstance);
      setContract(contractInstance);
      setStatus(`✅ Wallet connected: ${address}`);
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
      console.error(err);
    }
  };

  const createCredit = async () => {
    if (!signer || !contract) {
      alert("Connect your wallet first!");
      return;
    }

    try {
      setStatus("⏳ Sending transaction...");
      const tx = await contract.createCredit(producer, amount, metadata);
      await tx.wait();
      setStatus(`✅ Credit created! Tx hash: ${tx.hash}`);
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Green Hydrogen Credit Dashboard</h2>
      <button onClick={connectWallet}>Connect Wallet</button>
      <div>
        <input
          type="text"
          placeholder="Producer"
          value={producer}
          onChange={e => setProducer(e.target.value)}
          id="producer"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          id="amount"
        />
        <input
          type="text"
          placeholder="Metadata"
          value={metadata}
          onChange={e => setMetadata(e.target.value)}
          id="metadata"
        />
        <button onClick={createCredit}>Create Credit</button>
      </div>
      <div id="status">{status}</div>
    </div>
  );
};