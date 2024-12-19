import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/navbar"; // Add this import for the Navbar component
import QuickButtons from "../components/quickButtons";
import { GlobalContext } from "./../../GlobalContext";

import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
const Reorder = () => {
  const url = import.meta.env.VITE_API_URL;
  const { id: userID } = useContext(GlobalContext); // Cached user ID

  const [reorderProducts, setReorderProducts] = useState([]); // Reorder Level Products
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 20,
    current_page: 1,
    last_page: 1,
  });
  const [selectedProducts, setSelectedProducts] = useState({}); // Selected restock items
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/view/reorder-level`, {
        params: { page, limit: 20 },
      });

      console.log("Reorder Products State:", response.data.data);

      
      setReorderProducts(response.data.data);
      setPagination(response.data.pagination); // Set pagination data
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId], // Keep existing product details
        quantity: parseInt(quantity, 10) || 0, // Update only quantity
      },
    }));
  };
  

  const openModal = () => {
    if (Object.keys(selectedProducts).length === 0) {
      alert("No products selected. Please select at least one product.");
      return;
    }
    setShowModal(true);
  };

  const submitRestocks = async () => {
    const transactions = Object.entries(selectedProducts)
      .filter(([_, value]) => value.quantity > 0) // Ensure quantity > 0
      .map(([productId, { quantity }]) => ({
        user_id: userID,
        product_id: productId,
        quantity,
      }));
  
    if (transactions.length === 0) {
      alert("Please enter valid restock quantities before submitting.");
      return;
    }
  
    try {
      for (const transaction of transactions) {
        await axios.post(`${url}/api/products-restock`, transaction);
      }
      alert("Restocks successfully submitted!");
      setShowModal(false);
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error submitting restocks:", error);
      alert("Failed to submit restocks. Please try again.");
    }
  };
  

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.last_page) return;
    fetchProducts(newPage);
  };

  useEffect(() => {
    fetchProducts(); // Fetch products initially
  }, []);

  const { current_page, last_page } = pagination;

  // Helper to create the range of page numbers to display
  const createPageRange = () => {
    let start = Math.max(1, current_page - 2);
    let end = Math.min(last_page, current_page + 2);
    let pages = [];

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (start > 1) {
      pages.unshift('...');
      pages.unshift(1);
    }

    if (end < last_page) {
      pages.push('...');
      pages.push(last_page);
    }

    return pages;
  };

  const pages = createPageRange();

  const PaginationControls = () => {
    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        {/* First Button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={current_page === 1}
          className={`font-bold px-3 py-1 rounded cursor-pointer ${current_page === 1 ? "bg-gray-300 text-gray-500" : "bg-white hover:bg-blue-500 hover:text-white"}`}
        >
          <MdKeyboardDoubleArrowLeft />
        </button>

        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(current_page - 1)}
          disabled={current_page === 1}
          className={`font-bold px-3 py-1 rounded cursor-pointer ${current_page === 1 ? "bg-gray-300 text-gray-500" : "bg-white hover:bg-blue-500 hover:text-white"}`}
        >
          <MdNavigateBefore />
        </button>

        {/* Page Numbers */}
        {pages.map((pageNum, index) => {
          const isCurrentPage = Number(current_page) === Number(pageNum); // Convert both to numbers
          return (
            <button
              key={index}
              onClick={() => typeof pageNum === "number" && handlePageChange(pageNum)}
              className={`font-bold px-3 py-1 rounded cursor-pointer 
                ${isCurrentPage ? "bg-blue-500 text-white" : "bg-white hover:bg-blue-500 hover:text-white"}`}
              disabled={pageNum === "..."} // Disable placeholder pages
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(current_page + 1)}
          disabled={current_page === last_page}
          className={`font-bold px-3 py-1 rounded cursor-pointer ${current_page === last_page ? "bg-gray-300 text-gray-500" : "bg-white hover:bg-blue-500 hover:text-white"}`}
        >
          <MdNavigateNext />
        </button>

        {/* Last Button */}
        <button
          onClick={() => handlePageChange(last_page)}
          disabled={current_page === last_page}
          className={`font-bold px-3 py-1 rounded cursor-pointer ${current_page === last_page ? "bg-gray-300 text-gray-500" : "bg-white hover:bg-blue-500 hover:text-white"}`}
        >
          <MdKeyboardDoubleArrowRight />
        </button>
      </div>
    );
  };

  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <QuickButtons />
      <div className="w-4/5 mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Product Reorder and Low Levels</h1>
        {loading ? (
          <div className="text-center">
            <h1>Loading Reorder Data...</h1>
          </div>
        ) : (
          <>
            <div className="border p-2 rounded">
              <div className="grid grid-cols-6 gap-4 bg-red-500 text-white font-bold p-2">
                <div>Product ID</div>
                <div>Product Name</div>
                <div>Category</div>
                <div>Quantity</div>
                <div>Reorder Level</div>
                <div>Restock Quantity</div>
              </div>
              {reorderProducts.map((product, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-4 rounded items-center border shadow-md my-3 duration-300 hover:bg-red-300 even:bg-gray-100 p-2"
                >
                  {/* Checkbox for selecting the product */}
                  <div>
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      checked={!!selectedProducts[product.product_id]} // Keep the selection state
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelectedProducts((prev) => {
                          const updated = { ...prev };
                          if (isChecked) {
                            updated[product.product_id] = {
                              ...product, // Store entire product data
                              quantity: 0, // Add default quantity
                            };
                          } else {
                            delete updated[product.product_id]; // Remove if unchecked
                          }
                          return updated;
                        });
                      }}
                    />
                  </div>
                  <div>{product.product_id}</div>
                  <div>{product.product_name}</div>
                  <div>{product.category_name || "N/A"}</div>
                  <div>{product.current_quantity || "Missing"}</div>
                  <div>{product.reorder_level || 0}</div>
                </div>
              ))}
            </div>

            <PaginationControls />
            <div className="text-right mt-4">
              <button
                onClick={openModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirm Restock
              </button>
            </div>
          </>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">Enter Restock Quantities</h2>
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Product ID</th>
                    <th className="border border-gray-300 px-4 py-2">Product Name</th>
                    <th className="border border-gray-300 px-4 py-2">Current Quantity</th>
                    <th className="border border-gray-300 px-4 py-2">Reorder Level</th>
                    <th className="border border-gray-300 px-4 py-2">Enter Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedProducts).map(([productId, product]) => (
                    <tr key={productId}>
                      <td className="border border-gray-300 px-4 py-2">{productId}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.current_quantity}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.reorder_level}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          min="1"
                          className="border rounded p-1 w-full"
                          placeholder="Enter quantity"
                          onChange={(e) =>
                            setSelectedProducts((prev) => ({
                              ...prev,
                              [productId]: { ...product, quantity: parseInt(e.target.value, 10) || 0 },
                            }))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRestocks}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reorder;
