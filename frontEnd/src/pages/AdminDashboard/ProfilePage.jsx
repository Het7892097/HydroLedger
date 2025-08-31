import React, { useState, useEffect } from "react";
import { User, Building2, Mail, Wallet, Copy, CheckCircle } from "lucide-react";
import { getCompanyAPI, getUserAPI } from "../../services/producer.service";

// Mock services for demo (replace with your actual services)
// const getCompanyAPI = async (id) => {
//   return {
//     name: "TechCorp Solutions",
//     description:
//       "Leading blockchain technology company focused on decentralized applications and smart contracts.",
//     meta_data: JSON.stringify({
//       industry: "Technology",
//       founded: "2020",
//       employees: "50-100",
//       location: "San Francisco, CA",
//     }),
//   };
// };

// const getUserAPI = async (id) => {
//   return {
//     name: "John Smith",
//     email: "john.smith@techcorp.com",
//     role: "senior developer",
//     wallet_address: "0x742d35Cc6631C0532925a3b8D87c8b05Ab6b...4c2f",
//   };
// };

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const storedDetails = localStorage.getItem("UserProfileDetails");
    if (storedDetails) {
      const formattedResponse = JSON.parse(storedDetails);

      // Call APIs from provider
      getUserAPI(formattedResponse?.id).then((res) => setUser(res));
      getCompanyAPI(formattedResponse?.id).then((res) => setCompany(res));
    }
  }, []);

  // Extract metadata safely
  let metadata = {};
  try {
    metadata = company?.meta_data ? JSON.parse(company.meta_data) : {};
  } catch (e) {
    console.error("Invalid meta_data JSON", e);
  }

  // Use initials if no profile image
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="animate-pulse space-y-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-center text-gray-500 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-12">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Profile Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-white text-4xl font-bold shadow-2xl group-hover:scale-105 transition-transform duration-300">
                  {initials}
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* User Details */}
              <div className="text-center md:text-left text-white flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                  {user?.name || "User Name"}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <User className="w-5 h-5" />
                  <p className="text-xl font-medium capitalize bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    {user?.role || "Role"}
                  </p>
                </div>

                {/* Wallet Address with Copy */}
                <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                  <Wallet className="w-5 h-5 text-white/80" />
                  <span className="text-white/90 font-mono text-sm">
                    {formatAddress(user?.wallet_address)}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(user?.wallet_address, "wallet")
                    }
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    title="Copy wallet address"
                  >
                    {copiedField === "wallet" ? (
                      <CheckCircle className="w-4 h-4 text-green-300" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/70 hover:text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Information Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Personal Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      Email Address
                    </p>
                    <p className="text-gray-800 font-medium">
                      {user?.email || "Not provided"}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(user?.email, "email")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copiedField === "email" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <Wallet className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      Wallet Address
                    </p>
                    <p className="text-gray-800 font-mono text-sm break-all">
                      {user?.wallet_address || "Not connected"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(user?.wallet_address, "wallet_full")
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copiedField === "wallet_full" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Company Information Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Company Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Company Name
                  </p>
                  <p className="text-gray-800 font-semibold text-lg">
                    {company?.name || "No company assigned"}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Description
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {company?.description || "No description available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Section */}
          {metadata && Object.keys(metadata).length > 0 && (
            <div className="px-8 pb-8">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  Additional Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Object.entries(metadata).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm font-medium text-gray-500 mb-1 capitalize">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-gray-800 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
