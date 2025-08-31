import React, { useState } from "react";
import {
  User,
  History,
  List,
  Plus,
  Activity,
  ChevronDown,
  X,
} from "lucide-react";
import ContentArea from "./ContentArea";
import Navbar from "./Navbar";
import { useUserContext } from "../../context/userContext";
import { useAuthGuard } from "../../context/authGuardContext";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { userData } = useUserContext();
  useAuthGuard();
  const navigationItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "listing", label: "Listing", icon: List },
    { id: "history", label: "History", icon: History },
    // { id: "add-renewable", label: "Add Renewable Energy", icon: Plus },
    // { id: "status-tracking", label: "Status Tracking", icon: Activity },
  ];
  const Sidebar = () => (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full bg-primary">
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary2/20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="text-white font-semibold text-lg">EcoAdmin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-secondary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary2 text-white shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-primary2/30"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-primary2/20">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary2/20">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">Admin User</p>
              <p className="text-white/60 text-sm truncate">
                {userData?.email}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content Area */}
        <ContentArea activeTab={activeTab} />
      </div>
    </div>
  );
};

export default AdminDashboard;
