import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import Tabs from "../../components/Tabs";
import Loader from "../../components/Loading";

const TransactionHistory = ({ columns, fetchTransactionsAPI, tabOptions }) => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState(tabOptions[0].id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchTransactionsAPI();

        // Transform rows if metadata exists
        const formatted = response.map((tx) => {
          let meta = {};
          try {
            meta = tx.metadata ? JSON.parse(tx.metadata) : {};
          } catch (e) {
            console.error("Invalid metadata", e);
          }
          return { ...tx, ...meta };
        });

        setTransactions(formatted);
      } catch (err) {
        console.error("Error fetching transactions", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [fetchTransactionsAPI]);

  const filteredTransactions = transactions.filter(
    (tx) => tx.status === activeTab
  );

  console.log(filteredTransactions);

  return (
    <div className="container mx-auto p-2">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-4 mb-4 overflow-x-auto no-scrollbar p-1">
            {tabOptions.map((tab) => (
              <Tabs
                key={tab.id}
                tab={tab}
                activeTab={activeTab}
                handleTabClick={setActiveTab}
              />
            ))}
          </div>

          {/* Table */}
          <div className="bg-white border border-primary rounded-xl p-4 sm:p-6 overflow-x-auto">
            <Table
              columns={columns}
              data={filteredTransactions}
              title={`${activeTab} Transactions`}
              showtitle={true}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
