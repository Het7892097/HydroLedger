import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import contractABI from "../assets/contract.json";
const CONTRACT_ADDRESS = "0xe05CA878936d86b7cdfdDB11888B090Dd91cd55f";

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    company_name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    purpose: "",
  });

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [status, setStatus] = useState("");
  const consumer = localStorage.getItem("Step1");
  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState)
    : [];

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      setStatus("⏳ Connecting wallet...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      const verifyTx = await contract.verifyConsumer(consumer);
      await verifyTx.wait();
      setStatus(`✅ Consumer verified! Tx hash: ${verifyTx.hash}`);
      const userDetails = {
        username: formData.username,
        company_name: formData.company_name,
        address: formData.address,
        city: selectedCity,
        state: selectedState,
        country: selectedCountry,
        pincode: formData.pincode,
        purpose: formData.purpose,
        consumer,
        verifyTxHash: verifyTx.hash,
      };

      localStorage.setItem("UserDetails", JSON.stringify(userDetails));
      localStorage.setItem("Step2", verifyTx.hash);
      navigate("/role-addition");
    } catch (err) {
      console.error(err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  const isSubmitDisabled =
    !formData.username ||
    !formData.company_name ||
    !formData.address ||
    !selectedCity ||
    !selectedState ||
    !selectedCountry ||
    !formData.pincode;

  return (
    <div className="min-h-screen bg-white text-white flex items-center justify-center p-4">
      <form
        className="w-full max-w-md bg-gray-800 overflow-y-auto p-6 space-y-6 shadow-lg rounded-2xl"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-6 pb-3 border-b border-green-500">
          <h1 className="text-2xl font-light">Registration / Profile Info</h1>
        </div>

        <div className="space-y-4">
          <InputField
            label="User Name"
            value={formData.username}
            onChange={(v) => handleChange("username", v)}
            required
          />
          <InputField
            label="Company Name"
            value={formData.company_name}
            onChange={(v) => handleChange("company_name", v)}
            required
          />
          <InputField
            label="Address"
            value={formData.address}
            onChange={(v) => handleChange("address", v)}
            required
          />

          {/* Country */}
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedState("");
              setSelectedCity("");
            }}
            className="w-full p-3 border rounded-xl shadow focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>

          {/* State */}
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity("");
            }}
            disabled={!selectedCountry}
            className="w-full p-3 border rounded-xl shadow focus:ring-2 focus:ring-green-500 bg-white text-gray-800 disabled:bg-gray-200"
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>

          {/* City */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
            className="w-full p-3 border rounded-xl shadow focus:ring-2 focus:ring-green-500 bg-white text-gray-800 disabled:bg-gray-200"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          <InputField
            label="Pincode"
            type="number"
            value={formData.pincode}
            onChange={(v) => handleChange("pincode", v)}
            required
          />

          <div className="space-y-1">
            <label className="text-sm text-gray-300">Purpose</label>
            <textarea
              value={formData.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              placeholder="Write your purpose..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
              rows={3}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 ${
            isSubmitDisabled
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          Register
        </button>

        {/* Blockchain Status */}
        {status && (
          <div className="mt-4 p-3 rounded-lg text-sm bg-gray-700 text-center text-white leading-3">
            {status}
          </div>
        )}
      </form>
    </div>
  );
};

const InputField = ({
  label = "",
  value,
  type = "text",
  placeholder,
  onChange,
  required,
}) => (
  <div className="space-y-1">
    <label className="text-sm text-gray-300">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none"
    />
  </div>
);

export default RegistrationForm;
