import React, { useState } from "react";

const ROWS_PER_PAGE = 10;

const Table = ({ columns, data = [], title = "Table", showtitle = false }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIdx = (currentPage - 1) * ROWS_PER_PAGE;
  const currentData = data.slice(startIdx, startIdx + ROWS_PER_PAGE);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="w-full rounded-md">
      {showtitle && (
        <div className="border-b p-4 bg-gray-50">
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>
      )}

      <div className="w-full p-3 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full h-full table-auto border border-collapse mb-4">
            <thead className="bg-secondary1/20 text-gray-700  border-b border-primary uppercase text-xs font-semibold whitespace-nowrap">
              <tr>
                <th className="px-4 py-3 text-left">Sr No</th>
                {columns?.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-sm">
              {currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns?.length + 1}
                    className="text-center p-4 text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                currentData.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className="hover:bg-gray-50 text-left whitespace-nowrap"
                  >
                    <td className="px-4 py-2">{startIdx + idx + 1}</td>
                    {columns.map((col, idx2) => (
                      <td key={idx2} className="px-4 py-2 whitespace-nowrap">
                        {row[col.key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-3 py-1 flex gap-2 items-center rounded border ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200"
                  : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              Previous
            </button>

            <span>
              Page
              <span className="text-secondary3"> {currentPage} </span>
              of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 flex gap-2 items-center rounded border ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200"
                  : "hover:bg-gray-100 border-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
