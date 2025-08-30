const Radio = ({
  options = [],
  value,
  onChange,
  name,
  label,
  error = "",
  disabled = false,
  className = "",
  direction = "vertical",
  ...props
}) => {
  const containerClasses =
    direction === "horizontal" ? "flex flex-wrap gap-4" : "space-y-2";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[#004030] mb-2">
          {label}
        </label>
      )}
      <div className={containerClasses}>
        {options.map((option, index) => (
          <label key={index} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled}
              className="w-4 h-4 text-[#004030] border-gray-300 focus:ring-[#4A9782] focus:ring-2"
              {...props}
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
