import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import QuickButtons from "../components/quickButtons";
import { GlobalContext } from "./../../GlobalContext";

const Reorder = () => {
  const url = import.meta.env.VITE_API_URL;
  const { id: userID } = useContext(GlobalContext); // Cached user ID
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  // Fetch products needing reorder
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/products`);
      const allProducts = response.data.products || [];
      const filteredProducts = allProducts.filter((product) => product.needs_reorder);
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input for restock quantity
  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: { quantity: parseInt(quantity, 10) || 0 },
    }));
  };

  // Open modal with selected products for confirmation
  const openModal = () => {
    const filtered = Object.entries(selectedProducts).filter(
      ([_, value]) => value.quantity > 0
    );
    if (filtered.length === 0) {
      alert("No products selected with valid quantities.");
      return;
    }
    setShowModal(true);
  };

  // Submit restocks to API
  const submitRestocks = async () => {
    try {
      const transactions = Object.entries(selectedProducts)
        .filter(([_, value]) => value.quantity > 0)
        .map(([productId, { quantity }]) => ({
          user_id: userID,
          product_id: productId,
          quantity,
        }));

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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <QuickButtons />
      <div className="w-4/5 mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Products Needing Reorder</h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-2">Product ID</th>
                  <th className="p-2">Product Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Reorder Level</th>
                  <th className="p-2">Restock Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.product_id} className="even:bg-gray-100">
                    <td className="p-2">{product.product_id}</td>
                    <td className="p-2">{product.product_name}</td>
                    <td className="p-2">{product.category_name}</td>
                    <td className="p-2">{product.quantity}</td>
                    <td className="p-2">{product.reorder_level}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        className="border p-1 w-full"
                        placeholder="Enter quantity"
                        onChange={(e) =>
                          handleQuantityChange(product.product_id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

        {/* Modal for Confirmation */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Confirm Restock</h2>
              <ul className="mb-4">
                {Object.entries(selectedProducts)
                  .filter(([_, value]) => value.quantity > 0)
                  .map(([productId, { quantity }]) => {
                    const product = products.find((p) => p.product_id === parseInt(productId));
                    return (
                      <li key={productId} className="mb-2">
                        {product.product_name} - {quantity} units
                      </li>
                    );
                  })}
              </ul>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
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
