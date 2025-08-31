import React from "react";

function Tabs({ tab, activeTab, handleTabClick }) {
  return (
    <button
      type="button"
      onClick={() => handleTabClick(tab.id)}
      className={`${
        activeTab === tab.id
          ? "bg-secondary1/20 text-primary ring-1 ring-secondary1"
          : "bg-white text-gray-700 hover:bg-secondary1/20"
      } px-5 py-2 rounded-full shadow-sm font-medium text-sm transition-all duration-200 focus:outline-none whitespace-nowrap text-ellipsis`}
    >
      {tab.name}
    </button>
  );
}

export default Tabs;
