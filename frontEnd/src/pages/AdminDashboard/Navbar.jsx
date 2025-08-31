import { Menu, Bell, Search, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navigationItems = [
  { id: "profile", label: "Profile" },
  { id: "history", label: "History" },
  { id: "listing", label: "Listing" },
  { id: "add-renewable", label: "Add Renewable Energy" },
  { id: "status-tracking", label: "Status Tracking" },
];

const Navbar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-600 hover:text-primary transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Page Title */}
        <div className="flex-1 lg:ml-0 ml-4">
          <h1 className="text-2xl font-bold text-primary capitalize">
            {navigationItems.find((item) => item.id === activeTab)?.label ||
              "Dashboard"}
          </h1>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          <button
            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
