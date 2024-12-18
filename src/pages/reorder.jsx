import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import QuickButtons from "../components/quickButtons";
import { GlobalContext } from "./../../GlobalContext";

const Reorder = () => {
  const url = import.meta.env.VITE_API_URL;
  const { id: userID } = useContext(GlobalContext); // Cached user ID

  const [reorderProducts, setReorderProducts] = useState([]); // Reorder Level Products
  const [lowStockProducts, setLowStockProducts] = useState([]); // Low Product Level
  const [loading, setLoading] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState({}); // Selected restock items
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  // Fetch Products for Reorder Level and Low Product Level
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Fetch Reorder Level Products
      const reorderResponse = await axios.get(`${url}/api/view/reorder-level`);
      const reorderProducts = reorderResponse.data.data;

      // Fetch Low Product Level Products
      const lowStockResponse = await axios.get(`${url}/api/products/low-level`);
      const lowStockProducts = lowStockResponse.data.data;

      // Exclude Reorder Products from Low Product Level
      const filteredLowStock = lowStockProducts.filter(
        (lowStock) => !reorderProducts.some((reorder) => reorder.product_id === lowStock.product_id)
      );

      setReorderProducts(reorderProducts);
      setLowStockProducts(filteredLowStock);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle quantity input changes
  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: { quantity: parseInt(quantity, 10) || 0 },
    }));
  };

  // Open Confirmation Modal
  const openModal = () => {
    const hasValidSelection = Object.values(selectedProducts).some(
      (product) => product.quantity > 0
    );
    if (!hasValidSelection) {
      alert("No products selected with valid quantities.");
      return;
    }
    setShowModal(true);
  };

  // Submit Restocks
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
      fetchProducts();
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
        <h1 className="text-2xl font-bold text-center mb-4">Product Reorder and Low Levels</h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            {/* Reorder Level Products Grid */}
            <div className=" flex items-center ">
              <h2 className="text-xl font-bold mt-4">
                Reorder Level Products
              </h2>
              <h2 className="ml-1 text-md font-bold mt-4 text-red-700">
                 (!Warning Level! Product Quantity &lt;= Reorder Level || Safety Stock )
               </h2>
            </div>
            <div className="grid grid-cols-6 gap-4 bg-red-500 text-white font-bold p-2">
              <div>Product ID</div>
              <div>Product Name</div>
              <div>Category</div>
              <div>Quantity</div>
              <div>Reorder Level</div>
              <div>Restock Quantity</div>
            </div>

            {reorderProducts.map((product) => (
              <div key={product.product_id} className="grid grid-cols-6 gap-4 even:bg-gray-100 p-2">
                <div>{product.product_id}</div>
                <div>{product.product_name}</div>
                <div>{product.category_name}</div>
                <div>{product.current_quantity}</div>
                <div>{product.reorder_level}</div>
                <div>
                  <input
                    type="number"
                    min="1"
                    className="border p-1 w-full"
                    placeholder="Enter quantity"
                    onChange={(e) =>
                      handleQuantityChange(product.product_id, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            {/* Low Product Level Grid */}
            <div className="flex items-center">
              <h2 h2 className="text-xl font-bold mt-4">
                Low Product Level
              </h2>
              <h2 className="ml-1 text-md font-bold mt-4 text-red-700">
                (Needs Attention Products &lt;= (equal or below) 120 )
              </h2>
            </div>
            <div className="grid grid-cols-5 gap-4 bg-blue-500 text-white font-bold p-2">
              <div>Product ID</div>
              <div>Product Name</div>
              <div>Safety Stock</div>
              <div>Quantity Left</div>
              <div>Restock Quantity</div>
            </div>

            {lowStockProducts.map((product) => (
              <div key={product.product_id} className="grid grid-cols-5 gap-4 even:bg-gray-100 p-2">
                <div>{product.product_id}</div>
                <div>{product.product_name}</div>
                <div>{product.safety_stock}</div>
                <div>{product.quantity_left}</div>
                <div>
                  <input
                    type="number"
                    min="1"
                    className="border p-1 w-full"
                    placeholder="Enter quantity"
                    onChange={(e) =>
                      handleQuantityChange(product.product_id, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            {/* Confirmation Button */}
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Confirm Restock</h2>
              <ul>
                {Object.entries(selectedProducts).map(([productId, { quantity }]) => (
                  <li key={productId}>
                    Product ID {productId} - Quantity: {quantity} units
                  </li>
                ))}
              </ul>
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
