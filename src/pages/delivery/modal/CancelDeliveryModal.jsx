import React, { useState } from "react";
import axios from "axios";

const CancelDeliveryModal = ({
  deliveryId,
  deliveryStatus,
  returnStatus, // Added to check conditions
  onClose,
  onCancelSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  // Check if cancellation is allowed
  // Previously: isCancelable = deliveryStatus === "OD" && returnStatus === "NR"
  // Now also check that it's not "F"
  const isCancelable =
    deliveryStatus === "OD" &&
    returnStatus === "NR" &&
    deliveryStatus !== "F";

  const handleCancelDelivery = async () => {
    if (!isCancelable) return; // Ensure cancellation is blocked if conditions aren't met
    setLoading(true);
    try {
      // Make the API call to cancel the delivery
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/deliveries/${deliveryId}/cancel`
      );
      alert("Delivery successfully canceled!");

      if (onCancelSuccess) {
        onCancelSuccess(); // Trigger success callback
      }
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error canceling delivery:", error);
      alert("Failed to cancel the delivery. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Warning</h2>
        <p className="mb-4 text-red-500 font-bold">
          Canceling a delivery will reallocate all associated products back to the inventory. 
          This action cannot be undone. Please confirm your decision.
        </p>
        <p className="mb-4">
          {isCancelable
            ? `Are you sure you want to cancel Delivery ID ${deliveryId}?`
            : `This delivery cannot be canceled due to its current status:
               Delivery Status: ${deliveryStatus}, Return Status: ${returnStatus}. 
               If the delivery status is 'F', it can no longer be edited or canceled.`}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 font-bold text-white hover:bg-white hover:text-blue-500 shadow-md duration-200 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
          <button
            className={`px-4 py-2 rounded ${
              isCancelable
                ? "bg-red-500 text-white font-bold shadow-md hover:bg-red-500"
                : "bg-red-900 text-gray-600 font-bold shadow-md cursor-not-allowed"
            }`}
            onClick={handleCancelDelivery}
            disabled={!isCancelable || loading}
          >
            {loading ? "Processing..." : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelDeliveryModal;
