import React from "react";

const InputField = ({
  label,
  value,
  type = "text",
  placeholder,
  required = false,
  onChange,
  options, // for dropdown
}) => {
  return (
    <div className="space-y-1 w-full">
      <label className="block text-sm text-gray-300 mb-1">{label}</label>

      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
        />
      )}
    </div>
  );
};

export default InputField;
