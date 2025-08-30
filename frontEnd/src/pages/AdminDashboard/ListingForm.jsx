import React, { useState } from "react";
import InputField from "../../components/Input";
import contractABI from "../../assets/contract.json";
import { BrowserProvider, Contract } from "ethers";
import { envProvider } from "../../utils/envProvider.util";
import { createTransaction } from "../../services/user.service";
import { createTransactionAPI } from "../../services/producer.service";
import Loader from "../../components/Loading";

const HydrogenListingFormModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    available_volume: "",
    price_per_unit: "",
    el_efficiency: "",
    ghg: "",
    renewable_source: "",
  });
  const CONTRACT_ADDRESS = `${envProvider("VITE_CONTRACT_ADDRESS")}`;
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const metadata = JSON.stringify({
      price_per_unit: formData.price_per_unit,
      el_efficiency: formData.el_efficiency,
      ghg: formData.ghg,
      renewable_source: formData.renewable_source,
    });

    const creditAmount = formData.available_volume;

    await connectWalletListing(creditAmount, metadata);
    setIsOpen(false);
  };

  const connectWalletListing = async (creditAmount, metadata) => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    setloading(true);
    try {
      // 1. Request accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // 2. Ensure Sepolia
      let chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0xaa36a7") {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
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
          } else throw switchError;
        }
      }

      // 3. Ethers v6 BrowserProvider
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // 4. Contract
      const contract = new Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      const tx = await contract.createCredit(address, creditAmount, metadata);
      await tx.wait();
      console.log("TX ", tx);

      const tx2 = await contract.nextCreditId();
      const tx2Int = Number(tx2) - 1;
      console.log("TX2 ", tx2Int);

      const transactionData = {
        transaction_id: tx.hash,
        sender_wallet_address: address,
        receiver_wallet_address: CONTRACT_ADDRESS,
        credit_id: tx2Int,
        credits: creditAmount,
        metadata: metadata,
      };

      console.log("Transaction Data", transactionData);

      const response = await CreateTransaction(transactionData);
      console.log(response);

      // alert(`Listing submitted! Tx hash: ${tx.hash}`);
    } catch (err) {
      console.error("Error submitting listing:", err);
      alert(`❌ Error: ${err.message}`);
    }
    setloading(false);
  };

  const CreateTransaction = async (transactionData) => {
    const resposne = await createTransactionAPI(transactionData);
    return resposne;
  };

  return (
    <>
      {/* Button to open modal */}
      <div className="flex justify-center my-6">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition duration-300"
        >
          Add Hydrogen Listing
        </button>
      </div>

      {/* Modal */}
      {loading ? (
        <Loader />
      ) : (
        isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 text-white rounded-2xl w-full max-w-3xl p-6 sm:p-8 relative overflow-y-auto max-h-[80vh] shadow-2xl no-scrollbar">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-green-400 text-center sm:text-left mb-6">
                Hydrogen Listing Form
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Green Hydrogen Generated Volume (kg)"
                    value={formData.available_volume}
                    type="number"
                    placeholder="1000"
                    onChange={(val) => handleChange("available_volume", val)}
                    required
                  />
                  <InputField
                    label="Price per Kg"
                    value={formData.price_per_unit}
                    type="number"
                    placeholder="500"
                    onChange={(val) => handleChange("price_per_unit", val)}
                    required
                  />
                </div>

                <p className="text-sm text-gray-400">
                  Credit Calculation:{" "}
                  <span className="text-red-600">1 kgH2 = 1 credit</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <InputField
                      label="Electrolyzer Efficiency (kWh/kgH2)"
                      value={formData.el_efficiency}
                      type="number"
                      placeholder="50"
                      onChange={(val) => handleChange("el_efficiency", val)}
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Total kWh consumed per kg of hydrogen produced.
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <InputField
                      label="Greenhouse Gas (GHG) Emissions (kgCO2e/kgH2)"
                      value={formData.ghg}
                      type="number"
                      placeholder="0.1"
                      onChange={(val) => handleChange("ghg", val)}
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Total CO₂ emission per kg of hydrogen produced.
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-white font-medium mb-1">
                      Renewable Source
                    </label>
                    <select
                      value={formData.renewable_source}
                      onChange={(e) =>
                        handleChange("renewable_source", e.target.value)
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                      required
                    >
                      <option value="">Select Source</option>
                      <option value="Solar">Solar</option>
                      <option value="Wind">Wind</option>
                      <option value="Hydro">Hydro</option>
                      <option value="Fission">Fission</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      Specify the renewable energy source powering the
                      electrolyzer.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transition duration-300"
                  >
                    Submit Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default HydrogenListingFormModal;
