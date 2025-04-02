import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar";
import RestockModal from "./../modal/RestockModal";

const ProductDetails = () => {
  const { productID } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({}); // ✅ Added for RestockModal compatibility
  const [selectedType, setSelectedType] = useState("all"); // For filter
  const url = import.meta.env.VITE_API_URL;

  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 20,
    currentPage: 1,
    lastPage: 1,
  });

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
        total_restocked_quantity,
        transactions: { data: transactionData, pagination: paginationData },
      } = response.data;

      setProductDetails({
        product_id,
        product_name,
        product_created_date,
        remaining_quantity,
        total_restocked_quantity,
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
    if (page >= 1 && page <= pagination.lastPage) {
      fetchProductTransactions(page, selectedType);
    }
  };

  const handleRestockSuccess = () => {
    fetchProductTransactions();
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
    if (!pagination || !pagination.lastPage) return null;
    const { currentPage, lastPage } = pagination;

    const maxPagesShown = 15;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesShown / 2));
    let endPage = Math.min(lastPage, startPage + maxPagesShown - 1);

    if (currentPage >= endPage - 3 && endPage < lastPage) endPage = Math.min(lastPage, endPage + 5);
    if (endPage - startPage < maxPagesShown) startPage = Math.max(1, endPage - maxPagesShown + 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
      <div className="flex gap-2 my-10 w-full justify-center">
        {["First", "Previous"].map((label, idx) => {
          const targetPage = label === "First" ? 1 : currentPage - 1;
          return (
            <button
              key={label}
              onClick={() => handlePageChange(targetPage)}
              disabled={currentPage === 1}
              className={`duration-200 font-bold px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-500" : "bg-white border hover:bg-blue-500 hover:text-white"}`}
            >
              {label}
            </button>
          );
        })}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`font-bold px-3 py-1 rounded cursor-pointer ${currentPage === page ? "bg-blue-500 text-white" : "bg-white hover:bg-blue-500 hover:text-white border"}`}
          >
            {page}
          </button>
        ))}
        {["Next", "Last"].map((label) => {
          const targetPage = label === "Next" ? currentPage + 1 : lastPage;
          return (
            <button
              key={label}
              onClick={() => handlePageChange(targetPage)}
              disabled={currentPage === lastPage}
              className={`duration-200 font-bold px-3 py-1 rounded ${currentPage === lastPage ? "bg-gray-300 text-gray-500" : "bg-white border hover:bg-blue-500 hover:text-white"}`}
            >
              {label}
            </button>
          );
        })}
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
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Product ID: {productDetails.product_id} - {productDetails.product_name}
                </h1>
                <p><span className="font-bold">Created On:</span> {formatDate(productDetails.product_created_date)}</p>
                <p className="text-red-600 font-bold flex items-center">
                  <span className="font-bold">In Stock:</span> {productDetails.remaining_quantity}
                </p>
                <p className="text-green-600 font-bold">
                  <span>Total Stock Accumulated:</span> {productDetails.total_restocked_quantity}
                </p>
              </div>

              {/* ✅ FIXED Restock Button */}
              <button
                className="px-4 py-2 font-bold bg-blue-500 text-white rounded hover:bg-white hover:text-blue-500 shadow-md border duration-200"
                onClick={() => {
                  setSelectedProducts({
                    [productID]: {
                      product_id: productID,
                      product_name: productDetails.product_name
                    }
                  });
                  setShowRestockModal(true);
                }}
              >
                Restock
              </button>
            </div>

            {/* Transactions Logs */}
            <div>
              <div className="flex items-center justify-between space-x-4 mb-2">
                <h2 className="text-xl font-semibold">Transaction Logs</h2>
                <select
                  value={selectedType}
                  onChange={(e) => handleTransactionTypeChange(e)}
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
                          ? "bg-yellow-100 text-yellow-800"
                          : transaction.transaction_type === "Delivery"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <p className="text-sm font-bold text-gray-700">{formatDate(transaction.date)}</p>
                      {transaction.transaction_type === "Restock" ? (
                        <>
                          <p className="font-bold text-base">Restocked</p>
                          <p className="text-sm"><strong>Quantity:</strong> {transaction.quantity}</p>
                          <p className="text-sm text-green-600 font-bold">Paid: ₱{transaction.total_value}</p>
                        </>
                      ) : transaction.transaction_type === "Delivery" ? (
                        <>
                          <p className="font-bold text-base">Delivered</p>
                          <p className="text-sm"><strong>Delivery ID:</strong> {transaction.delivery_id || "N/A"}</p>
                          <p className="text-sm"><strong>Quantity:</strong> {transaction.quantity}</p>
                          <p className="text-sm text-red-600 font-bold">Gain: ₱{transaction.total_value}</p>
                          <p className="text-sm"><strong>Damages:</strong> {transaction.no_of_damages || 0}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-bold text-base">Walk-In Sale</p>
                          <p className="text-sm"><strong>Quantity:</strong> {transaction.quantity}</p>
                          <p className="text-sm text-blue-600 font-bold">Total: ₱{transaction.total_value}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {renderPagination()}
          </>
        )}
      </div>

      {/* ✅ Corrected Modal Usage */}
      {showRestockModal && (
        <RestockModal
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          onClose={() => setShowRestockModal(false)}
          onRestockSuccess={handleRestockSuccess}
        />
      )}
    </div>
  );
};

export default ProductDetails;
