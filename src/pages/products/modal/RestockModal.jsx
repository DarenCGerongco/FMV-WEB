import React, { useState, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../../../GlobalContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RestockModal = ({ productId, productName, onClose, onRestockSuccess }) => {
  const url = import.meta.env.VITE_API_URL;
  const { id: userID } = useContext(GlobalContext); // Access logged-in user ID
  const [quantity, setQuantity] = useState(""); // Track quantity input
  const [loading, setLoading] = useState(false); // Track if request is in progress
  const [buttonDisabled, setButtonDisabled] = useState(false); // Track if the button is disabled due to error

  const showToast = (message, isError = false) => {
    const options = {
      onClose: () => setButtonDisabled(false), // Re-enable the button after toast closes
      autoClose: 7000, // Set a longer time (7 seconds) for the toast to stay visible
    };

    if (isError) {
      toast.error(message, options); // Show error toast
    } else {
      toast.success(message, options); // Show success toast
    }
  };

  const handleRestock = async () => {
    // Check if quantity is invalid or zero
    if (quantity <= 0 || isNaN(quantity)) {
      showToast("Please enter a valid quantity greater than zero.", true);
      setButtonDisabled(true);
      return;
    }

    setLoading(true); // Set loading to true while restocking
    setButtonDisabled(true); // Disable the button to prevent multiple clicks

    try {
      const response = await axios.post(`${url}/api/products-restock`, {
        user_id: userID,
        product_id: productId,
        quantity: parseInt(quantity, 10), // Ensure we send an integer value
      });

      if (response.status) {
        // Show success toast immediately after valid quantity is provided
        showToast(`Successfully restocked ${quantity} units of ${productName}.`);

        // Wait for 3 seconds after showing the toast
        setTimeout(() => {
          onRestockSuccess(); // Refresh inventory after the delay
          onClose(); // Close the modal after success
        }, 3000); // 3 seconds delay
      } else {
        // If the response is not successful, show an error toast
        showToast("Failed to restock product. Please try again later.", true);
      }
    } catch (error) {
      console.error("Error restocking product:", error);
      // Show error toast with a clear failure message
      showToast("Failed to restock product. Please try again later.", true);
    } finally {
      // Ensure button is re-enabled after 2 seconds
      setTimeout(() => {
        setButtonDisabled(false);
        setLoading(false);
      }, 2000);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Only update quantity if the value is a number (or empty string)
    if (/^\d*$/.test(value)) {
      setQuantity(value);
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
            type="text" // Use text to handle number-only input
            value={quantity}
            onChange={handleQuantityChange}
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
              disabled={loading || buttonDisabled} // Disable if loading or button is disabled due to error
              style={{
                cursor: buttonDisabled ? 'not-allowed' : 'pointer', // Change cursor if button is disabled
              }}
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
