import React, { useState, useMemo } from "react";

interface SaleFormData {
  intensity: string;
  temperature: string;
  metadata: string;
  credits_to_apply: number;
  volume: string;
  price_per_kg: string;
  seller_id: string;
  delivery_date: string;
  unit: string;
}

const maxCredits = 100;
const baselineIntensity = 10;

const InputField: React.FC<{
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
}> = ({ label, value, type = "text", placeholder, onChange, required }) => (
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

const HydrogenSaleForm: React.FC = () => {
  const [formData, setFormData] = useState<SaleFormData>({
    intensity: "",
    temperature: "",
    metadata: "",
    credits_to_apply: 0,
    volume: "",
    price_per_kg: "",
    seller_id: "",
    delivery_date: "",
    unit: "kg",
  });

  const credits_to_apply = useMemo(() => {
    const intensity = parseFloat(formData.intensity) || 0;
    const credits = maxCredits * (1 - intensity / baselineIntensity);
    return Math.max(0, credits);
  }, [formData.intensity]);

  const handleChange = (name: keyof SaleFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData, credits_to_apply };
    console.log("Form submitted:", finalData);
    alert("Sale submitted successfully!");
  };

  const isSubmitDisabled =
    !formData.intensity ||
    !formData.volume ||
    !formData.price_per_kg ||
    !formData.seller_id;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form
        className="w-full max-w-md bg-gray-800 rounded-2xl p-6 space-y-6 shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-light tracking-wide">
            Hydrogen Sale Form
          </h1>
        </div>

        {/* Production Info */}
        <div className="space-y-4">
          <h3 className="text-sm text-gray-400 font-medium">Production Info</h3>
          <InputField
            label="Intensity (kg CO₂/kg H₂)"
            type="number"
            placeholder="Intensity"
            value={formData.intensity}
            onChange={(v) => handleChange("intensity", v)}
            required
          />
          <InputField
            label="Temperature (°C)"
            type="number"
            value={formData.temperature}
            onChange={(v) => handleChange("temperature", v)}
          />
          <InputField
            label="Metadata"
            value={formData.metadata}
            onChange={(v) => handleChange("metadata", v)}
          />
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Credits to Apply</label>
            <input
              type="number"
              value={credits_to_apply.toFixed(2)}
              readOnly
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Sale Info */}
        <div className="space-y-4">
          <h3 className="text-sm text-gray-400 font-medium">Sale Info</h3>
          <InputField
            label="Volume"
            type="number"
            placeholder="Volume"
            value={formData.volume}
            onChange={(v) => handleChange("volume", v)}
            required
          />
          <InputField
            label="Price per kg"
            type="number"
            placeholder="Price per kg"
            value={formData.price_per_kg}
            onChange={(v) => handleChange("price_per_kg", v)}
            required
          />
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Unit</label>
            <select
              value={formData.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-gray-500 focus:outline-none"
            >
              <option value="kg">kg</option>
              <option value="Nm³">Nm³</option>
            </select>
          </div>
        </div>

        {/* Seller Info */}
        <div className="space-y-4">
          <h3 className="text-sm text-gray-400 font-medium">Seller Info</h3>
          <InputField
            label="Seller ID"
            value={formData.seller_id}
            onChange={(v) => handleChange("seller_id", v)}
            required
          />
          <InputField
            label="Delivery Date"
            type="date"
            value={formData.delivery_date}
            onChange={(v) => handleChange("delivery_date", v)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 ${
            isSubmitDisabled
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          Submit Sale
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <span className="text-gray-300 underline cursor-pointer">
              Contact Support
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default HydrogenSaleForm;
