const Loading = ({
  size = "medium",
  message = "Loading...",
  overlay = false,
  className = "",
  ...props
}) => {
  const sizes = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-[#DCD0A8] border-t-[#004030]`}
      ></div>
      {message && (
        <p className="text-[#004030] text-sm font-medium">{message}</p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 ${className}`}
        {...props}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center p-4 ${className}`}
      {...props}
    >
      <LoadingSpinner />
    </div>
  );
};

export default Loading;
