import HydrogenListingForm from "./ListingForm";
import Profile from "./ProfilePage";
import History from "./History";
import {
  DetailedHistory,
  getTransactionsByWalletAPI,
} from "../../services/producer.service";

const UserDetails = localStorage.getItem("UserProfileDetails");
let formattedData = JSON.parse(UserDetails);

const columns = [
  { key: "reciever_company_name", label: "Reciever" },
  { key: "credits", label: "Credits" },
  { key: "status", label: "Status" },
  { key: "price_per_unit", label: "Price/Unit" },
  { key: "el_efficiency", label: "Efficiency" },
  { key: "ghg", label: "GHG" },
  { key: "renewable_source", label: "Source" },
];

const tabs = [
  { id: "Pending", name: "Pending" },
  { id: "Verified", name: "Verified" },
];

const ContentArea = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "history":
        return (
          <div>
            <History
              columns={columns}
              fetchTransactionsAPI={DetailedHistory(
                formattedData?.wallet_address
              )}
              tabOptions={tabs}
            />
          </div>
        );
      case "listing":
        return (
          <div>
            {" "}
            <HydrogenListingForm />{" "}
          </div>
        );
      case "add-renewable":
        return <div>Add Renewable Content</div>;
      case "status-tracking":
        return <div>Status Tracking Content</div>;
      default:
        return <div>Dashboard</div>;
    }
  };

  return (
    <main className="flex-1 p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">{renderContent()}</div>
    </main>
  );
};

export default ContentArea;
