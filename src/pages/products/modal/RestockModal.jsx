import React, { useState, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../../../GlobalContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RestockModal = ({ selectedProducts, setSelectedProducts, onClose, onRestockSuccess }) => {
  const url = import.meta.env.VITE_API_URL;
  const { id: userID } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const showToast = (message, isError = false) => {
    const options = {
      onClose: () => setButtonDisabled(false),
      autoClose: 7000,
    };
    if (isError) {
      toast.error(message, options);
    } else {
      toast.success(message, options);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    if (isNaN(quantity) || quantity < 0) return; // Optional validation
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Number(quantity) // controlled quantity
      }
    }));
  };

  const handleRestock = async () => {
    const restocks = Object.values(selectedProducts)
      .filter(product => product.quantity > 0)
      .map(product => ({
        user_id: userID,
        product_id: product.product_id,
        quantity: parseInt(product.quantity, 10),
      }));

    if (restocks.length === 0) {
      showToast("Please input quantity for at least one product.", true);
      return;
    }

    setLoading(true);
    setButtonDisabled(true);

    try {
      // Sequential restock
      for (const restock of restocks) {
        await axios.post(`${url}/api/products-restock`, restock);
      }

      showToast("All products have been successfully restocked!");

      setTimeout(() => {
        onRestockSuccess();
        onClose();
      }, 3000);

    } catch (error) {
      console.error("Error during restocking:", error);
      showToast("Error occurred during restocking. Please try again.", true);
    } finally {
      setTimeout(() => {
        setButtonDisabled(false);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-1/2 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Restock</h2>

          {Object.values(selectedProducts).map(product => (
            <div key={product.product_id} className="border p-3 rounded mb-3">
              <p><strong>Product Name:</strong> {product.product_name}</p>
              <p><strong>Product ID:</strong> {product.product_id}</p>
              <input
                type="number"
                min="0"
                placeholder="Enter quantity"
                className="border rounded w-full p-2 mt-2"
                onChange={(e) => handleQuantityChange(product.product_id, e.target.value)}
              />
            </div>
          ))}

          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={onClose}
              className="w-32 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white px-4 py-2 border border-blue-500 hover:border-transparent rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleRestock}
              className="w-32 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              disabled={loading || buttonDisabled}
              style={{
                cursor: buttonDisabled ? 'not-allowed' : 'pointer',
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
