import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { CiDeliveryTruck } from "react-icons/ci"; // Delivery icon
import { GiWalkingBoot } from "react-icons/gi"; // Walk-In icon
import { BiRefresh } from "react-icons/bi"; // Restock icon

const TransactionModal = ({ transaction, onClose }) => {
  const [relatedTransactions, setRelatedTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const url = import.meta.env.VITE_API_URL;
  const itemsPerPage = 20;

  useEffect(() => {
    if (transaction) {
      fetchRelatedTransactions(transaction.product_id, currentPage);
    }
  }, [transaction, currentPage]);

  const fetchRelatedTransactions = async (productId, page) => {
    try {
      const response = await axios.get(`${url}/api/inventory/transactions/${productId}`, {
        params: { page, per_page: itemsPerPage }
      });

      const formattedTransactions = response.data.transactions.data.map(item => ({
        ...item,
        date_in: item.date_in ? moment(item.date_in).format("M/D/YYYY (h:mm a)") : "N/A",
        date_out: item.date_out ? moment(item.date_out).format("M/D/YYYY (h:mm a)") : "N/A"
      }));

      setRelatedTransactions(formattedTransactions || []);
      setTotalPages(response.data.transactions.pagination.lastPage);
    } catch (error) {
      console.error("Error fetching related transactions:", error);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "Delivery":
        return <CiDeliveryTruck className="inline-block mr-1 text-blue-500" />;
      case "Walk-In":
        return <GiWalkingBoot className="inline-block mr-1 text-green-500" />;
      case "Restock":
        return <BiRefresh className="inline-block mr-1 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Render Page Numbers (Same Design as Main Table)
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 15;
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <button
        key={number}
        className={`px-4 py-2 hover:bg-blue-500 hover:text-white duration-200 font-bold mx-1 border rounded-md ${
          currentPage === number ? "bg-blue-500 text-white" : ""
        }`}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/5">
        <h2 className="text-xl font-bold mb-4">{transaction.product_name} - Transactions</h2>

        {/* Table of Related Transactions */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-3 py-2 text-left">Date In</th>
              <th className="px-3 py-2 text-left">Date Out</th>
              <th className="px-3 py-2 text-left">Quantity</th>
              <th className="px-3 py-2 text-center">Transaction Type</th>
              <th className="px-3 py-2 text-left">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {relatedTransactions.length > 0 ? (
              relatedTransactions.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-3 py-2">{item.date_in}</td>
                  <td className="px-3 py-2">{item.date_out}</td>
                  <td className="px-3">{item.quantity}</td>
                  <td className="px-3 text-center flex justify-center items-center">
                    {getTransactionIcon(item.transaction_type)}
                    {item.transaction_type}
                  </td>
                  <td className="px-3">₱ {item.total_value}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No transactions found for this product.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls with Page Numbers */}
        <div className="flex justify-center mt-4 pb-4 duration-200">
          <button
            className="px-4 py-2 mx-1 border rounded-md hover:bg-blue-500 hover:text-white font-bold duration-200"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            className="px-4 py-2 mx-1 border rounded-md hover:bg-blue-500 hover:text-white font-bold duration-200"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionModal;
