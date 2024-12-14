import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar";
import RestockModal from "./../modal/RestockModal"; // Import the RestockModal

const InventoryDetails = () => {
  const { productID } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
  });
  const [showRestockModal, setShowRestockModal] = useState(false); // State to show/hide the modal

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProductTransactions();
  }, [productID]);

  const fetchProductTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/view/${productID}/per-product-restock/`, {
        params: { page },
      });

      const {
        product_name,
        product_created_date,
        remaining_quantity,
        data,
        pagination: paginationData,
      } = response.data;

      setProductDetails({
        product_name,
        product_created_date,
        remaining_quantity,
      });

      const combinedTransactions = [
        ...data.restocks.transactions.map((transaction) => ({
          ...transaction,
          type: "IN",
        })),
        ...data.deliveries.transactions.map((transaction) => ({
          ...transaction,
          type: "OUT",
        })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(combinedTransactions);

      setPagination(paginationData || { currentPage: 1, lastPage: 1 });
    } catch (error) {
      console.error("Error fetching product transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.lastPage) {
      fetchProductTransactions(page);
    }
  };

  const handleRestockSuccess = () => {
    fetchProductTransactions(); // Refresh transactions after restocking
  };

  const formatDateSteamStyle = (dateString) => {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  return (
    <div className="flex w-full bg-gray-100 min-h-screen">
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
                <h1 className="text-2xl font-bold mb-2">{productDetails.product_name}</h1>
                <p>
                  <strong>Created On:</strong>{" "}
                  {formatDateSteamStyle(productDetails.product_created_date)}
                </p>
                <p>
                  <strong>Remaining Quantity:</strong> {productDetails.remaining_quantity}
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

            {/* Notifications */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Transactions:</h2>
              {transactions.length === 0 ? (
                <p>No transactions found for this product.</p>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className={`p-2 hover:shadow-xl border duration-100 rounded-lg shadow-md ${
                        transaction.type === "IN"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type === "IN" ? (
                        <div>
                          <p className="text-lg font-bold text-black">
                            {formatDateSteamStyle(transaction.date)}
                          </p>
                          <p className="font-bold">Restocked</p>
                          <p>
                            <strong>Quantity:</strong> {transaction.quantity}
                          </p>
                          <p>
                            <strong>Total Value:</strong> ₱{transaction.total_value}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-bold text-black">
                            {formatDateSteamStyle(transaction.date)}
                          </p>
                          <p className="font-bold">Delivered</p>
                          <p>
                            <strong>Delivery ID:</strong> {transaction.delivery_id}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {transaction.quantity}
                          </p>
                          <p>
                            <strong>Total Value:</strong> ₱{transaction.total_value}
                          </p>
                          <p>
                            <strong>Damages:</strong> {transaction.no_of_damages}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(1)}
                disabled={pagination.currentPage === 1}
              >
                First
              </button>
              <button
                className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.lastPage}
              </span>
              <button
                className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage}
              >
                Next
              </button>
              <button
                className="px-3 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(pagination.lastPage)}
                disabled={pagination.currentPage === pagination.lastPage}
              >
                Last
              </button>
            </div>
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
