import HydrogenListingForm from "./ListingForm";
import Profile from "./ProfilePage";

const ContentArea = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "history":
        return <div>History Content</div>;
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
