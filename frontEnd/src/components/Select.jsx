const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error = "",
  disabled = false,
  required = false,
  className = "",
  ...props
}) => {
  const selectClasses = `w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4A9782] focus:border-[#004030] ${
    error
      ? "border-red-500 focus:ring-red-300"
      : "border-gray-300 hover:border-[#4A9782]"
  } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-pointer"}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[#004030] mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={selectClasses}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
