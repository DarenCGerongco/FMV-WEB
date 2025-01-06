import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar";
import RestockModal from "./../modal/RestockModal";

const InventoryDetails = () => {
  const { productID } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRestockMode, setIsRestockMode] = useState(false);
  const toggleRestockMode = () => setIsRestockMode((prev) => !prev);

  const [selectedType, setSelectedType] = useState("all"); // Default value
  const handleTransactionTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value); // Update the selected value
    fetchProductTransactions(1, value); // Fetch data for the selected transaction type
  };
  
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 20,
    currentPage: 1,
    lastPage: 1,
  });

  const [showRestockModal, setShowRestockModal] = useState(false);

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProductTransactions();
  }, [productID]);

  const fetchProductTransactions = async (page = 1, transactionType = "all") => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/view/${productID}/Product-Profile`, {
        params: { page: Number(page), transactionType },
      });
  
      const {
        product_id,
        product_name,
        product_created_date,
        remaining_quantity,
        transactions: { data: transactionData, pagination: paginationData },
      } = response.data;
  
      console.log("Pagination Data:", paginationData); // Debugging
      console.log("Current Transactions:", transactionData); // Debugging
  
      setProductDetails({
        product_id,
        product_name,
        product_created_date,
        remaining_quantity,
      });
  
      const sortedTransactions = transactionData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sortedTransactions);
      setPagination(paginationData || { total: 0, perPage: 20, currentPage: 1, lastPage: 1 });
    } catch (error) {
      console.error("Error fetching product transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (page) => {
    console.log("Page Change Triggered. New Page:", page); // Debugging
    if (page >= 1 && page <= pagination.lastPage) {
      fetchProductTransactions(page, selectedType); // Pass transaction type if needed
    }
  };
  
  const handleRestockSuccess = () => {
    fetchProductTransactions(); // Refresh transactions after restocking
  };

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  const renderPagination = () => {
    if (!pagination || !pagination.lastPage) {
      console.error("Pagination data is not properly set:", pagination);
      return null; // Prevent rendering if pagination is not ready
    }
  
    const { currentPage, lastPage = 1 } = pagination;
  
    // Convert currentPage to a number for comparison
    const currentPageNumber = Number(currentPage);
  
    const maxPagesShown = 15; // Limit displayed pages to 15
    let startPage = Math.max(1, currentPageNumber - Math.floor(maxPagesShown / 2));
    let endPage = Math.min(lastPage, startPage + maxPagesShown - 1);
  
    if (currentPageNumber >= endPage - 3 && endPage < lastPage) {
      endPage = Math.min(lastPage, endPage + 5);
    }
  
    if (endPage - startPage < maxPagesShown) {
      startPage = Math.max(1, endPage - maxPagesShown + 1);
    }
  
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    return (
      <div className="flex gap-2 my-10 w-full justify-center">
        {/* First Button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPageNumber === 1} // Ensure comparison uses numbers
          className={`duration-200 font-bold px-3 py-1 rounded ${
            currentPageNumber === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled state styling
              : "bg-white border hover:bg-blue-500 hover:text-white"
          }`}
        >
          First
        </button>
  
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPageNumber - 1)}
          disabled={currentPageNumber === 1} // Ensure comparison uses numbers
          className={`duration-200 font-bold px-3 py-1 rounded ${
            currentPageNumber === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled state styling
              : "bg-white border hover:bg-blue-500 hover:text-white"
          }`}
        >
          Previous
        </button>
  
        {/* Dynamic Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`font-bold px-3 py-1 rounded cursor-pointer ${
              currentPageNumber === page
                ? "bg-blue-500 text-white" // Highlight the current page
                : "bg-white hover:bg-blue-500 hover:text-white border"
            }`}
          >
            {page}
          </button>
        ))}
  
        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPageNumber + 1)}
          disabled={currentPageNumber === lastPage} // Ensure comparison uses numbers
          className={`duration-200 font-bold px-3 py-1 rounded ${
            currentPageNumber === lastPage
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled state styling
              : "bg-white border hover:bg-blue-500 hover:text-white"
          }`}
        >
          Next
        </button>
  
        {/* Last Button */}
        <button
          onClick={() => handlePageChange(lastPage)}
          disabled={currentPageNumber === lastPage} // Ensure comparison uses numbers
          className={`duration-200 font-bold px-3 py-1 rounded ${
            currentPageNumber === lastPage
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled state styling
              : "bg-white border hover:bg-blue-500 hover:text-white"
          }`}
        >
          Last
        </button>
      </div>
    );
  };

  return (
    <div className="flex w-full min-h-screen">
      <Navbar />
      <div className="w-4/5 mx-auto bg-white p-6 mt-4 rounded-lg shadow-lg">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Product Details */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Product ID: {productDetails.product_id} - {productDetails.product_name}
                </h1>
                <p>
                  <strong>Created On:</strong> {formatDate(productDetails.product_created_date)}
                </p>
                <p>
                  <strong>In-Stock:</strong> {productDetails.remaining_quantity}
                </p>
              </div>
              {/* Restock Button */}
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={() => setShowRestockModal(true)}
              >
                Restock
              </button>
            </div>

            {/* Transactions Logs */}
            <div>
              <div className="flex items-center justify-between space-x-4 mb-2">
                <h2 className="text-xl font-semibold">Transaction Logs</h2>
                <select
                  value={selectedType} // Bind selected value to state
                  onChange={handleTransactionTypeChange} // Handle change
                  className="border px-4 font-bold py-2 rounded-2xl"
                >
                  <option value="all">All Transactions</option>
                  <option value="Restock">Restock</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Walk-In">Walk-In</option>
                </select>
              </div>
              {transactions.length === 0 ? (
                <p>No transactions found for this product.</p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className={`p-3 hover:translate-x-3 border duration-200 rounded-lg shadow-md ${
                        transaction.transaction_type === "Restock"
                          ? "bg-yellow-100 text-yellow-800" // Restock
                          : transaction.transaction_type === "Delivery"
                          ? "bg-red-100 text-red-800"       // Delivery
                          : "bg-blue-100 text-blue-800"     // Walk-In
                      }`}
                    >
                      {/* Transaction Date */}
                      <p className="text-sm font-bold text-gray-700">
                        {formatDate(transaction.date)}
                      </p>

                      {/* Transaction Type and Details */}
                      {transaction.transaction_type === "Restock" ? (
                        <>
                          <p className="font-bold text-base">Restocked</p>
                          <p className="text-sm">
                            <strong>Quantity:</strong> {transaction.quantity}
                          </p>
                          <p className="text-sm text-green-600 font-bold">
                            Paid: ₱{transaction.total_value}
                          </p>
                        </>
                      ) : transaction.transaction_type === "Delivery" ? (
                        <>
                          <p className="font-bold text-base">Delivered</p>
                          <p className="text-sm">
                            <strong>Delivery ID:</strong> {transaction.delivery_id || "N/A"}
                          </p>
                          <p className="text-sm">
                            <strong>Quantity:</strong> {transaction.quantity}
                          </p>
                          <p className="text-sm text-red-600 font-bold">
                            Gain: ₱{transaction.total_value}
                          </p>
                          <p className="text-sm">
                            <strong>Damages:</strong> {transaction.no_of_damages || 0}
                          </p>
                        </>
                      ) : transaction.transaction_type === "Walk-In" ? (
                        <>
                          <p className="font-bold text-base">Walk-In Sale</p>
                          <p className="text-sm">
                            <strong>Quantity:</strong> {transaction.quantity}
                          </p>
                          <p className="text-sm text-blue-600 font-bold">
                            Total: ₱{transaction.total_value}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-bold text-red-500">Unknown Transaction Type</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Pagination Controls */}
            {renderPagination()}
          </>
        )}
      </div>
      {/* Restock Modal */}
      {showRestockModal && (
        <RestockModal
          productId={productID}
          productName={productDetails.product_name}
          onClose={() => setShowRestockModal(false)}
          onRestockSuccess={handleRestockSuccess}
        />
      )}
    </div>
  );
};

export default InventoryDetails;
