const ContentArea = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary2 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary2 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "history":
        return <div>History Content</div>;
      case "listing":
        return <div>Listing Content</div>;
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
