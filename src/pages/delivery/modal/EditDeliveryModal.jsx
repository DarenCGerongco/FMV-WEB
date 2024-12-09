import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDeliveryModal = ({
  deliveryId,
  deliveryManName,
  status,
  returnStatus, // Pass return status as a prop
  onClose,
  onSave,
}) => {
  const [employee, setEmployee] = useState(""); // Selected employee
  const [employees, setEmployees] = useState([]); // Available employees
  const [deliveryDetails, setDeliveryDetails] = useState(null); // Delivery details
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error state

  const url = import.meta.env.VITE_API_URL; // API base URL

  // Fetch delivery details and employees when modal opens
  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await axios.get(`${url}/api/deliveries/${deliveryId}/product-lists`);
        setDeliveryDetails(response.data);
        setEmployee(response.data.delivery_man?.id || ""); // Preselect the current employee
      } catch (error) {
        console.error("Error fetching delivery details:", error);
        setError("Failed to load delivery details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${url}/api/users`);
        setEmployees(response.data.data || []); // Set all users without filtering
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Failed to load employees.");
      }
    };

    fetchDeliveryDetails();
    fetchEmployees();
  }, [deliveryId]);

  // Save the updated delivery assignment
  const handleSave = async () => {
    try {
      await axios.put(`${url}/api/deliveries/${deliveryId}/update`, {
        delivery_man_id: employee,
      });
      toast.success("Delivery man updated successfully!");
      if (onSave) {
        onSave(); // Trigger parent component callback
      }
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating delivery:", error);
      toast.error(error.response?.data?.message || "Failed to update delivery.");
    }
  };

  // Disable Save button if status conditions are met or employee is not selected
  const isSaveDisabled =
    ["S", "P"].includes(status) || returnStatus === "P" || loading || !employee;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg w-1/3">
          <h2 className="text-xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg w-1/3">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <ToastContainer />
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Edit Delivery</h2>
        <div className="mb-4">
          <strong>Delivery ID:</strong> {deliveryDetails?.delivery_id}
        </div>
        <div className="mb-4">
          <strong>Current Employee:</strong> {deliveryManName}
        </div>
        <div className="mb-4">
          <strong>Current Status:</strong> {status}
        </div>
        <div className="mb-4">
          <strong>Return Status:</strong> {returnStatus}
        </div>
        <div className="max-h-40 overflow-y-auto">
          <ul className="list-disc pl-6">
            {deliveryDetails?.products?.length > 0 ? (
              deliveryDetails.products.map((product) => (
                <li key={product.product_id}>
                  {product.name} (x{product.quantity}) - Php {product.price}
                </li>
              ))
            ) : (
              <li>No products assigned to this delivery.</li>
            )}
          </ul>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Change Employee:</label>
          <select
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="" disabled>
              Select Employee
            </option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded ${
              isSaveDisabled
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDeliveryModal;