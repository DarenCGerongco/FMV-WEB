import React, { useState, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../../../GlobalContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RestockModal = ({ productId, productName, onClose, onRestockSuccess }) => {
  const url = import.meta.env.VITE_API_URL;
  const { id: userID } = useContext(GlobalContext); // Access logged-in user ID
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRestock = async () => {
    if (quantity <= 0) {
      alert("Please enter a valid quantity greater than zero.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/products-restock`, {
        user_id: userID, // Use logged-in user ID from GlobalContext
        product_id: productId,
        quantity: parseInt(quantity, 10), // Ensure we send an integer value
      });

      // Show success toast with clear message
      toast.success(`Restock successful: ${productName} restocked by ${quantity} units.`);

      onRestockSuccess(); // Refresh inventory after successful restock
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error restocking product:", error);
      // Show error toast with a clear failure message
      toast.error("Failed to restock product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-1/3">
          <h2 className="text-xl font-bold mb-4">Restock Product</h2>
          <p className="text-md mb-2">Product Name: {productName}</p>
          <p className="text-md mb-2">Product ID: {productId}</p>
          <input
            type="number"
            value={quantity === "" ? "" : quantity} // Ensure value is empty when cleared
            onChange={(e) => {
              const value = e.target.value;
              // Set quantity only if it's a valid number or empty string
              setQuantity(value === "" ? "" : parseInt(value, 10));
            }}
            placeholder="Enter quantity to restock"
            className="border rounded w-full p-2 mb-4"
            min={1}
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="w-32 r-4 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white px-4 py-2 border border-blue-500 hover:border-transparent rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleRestock}
              className="w-32 r-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 rounded-lg"
              disabled={loading}
            >
              {loading ? "Restocking..." : "Restock"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default RestockModal;
