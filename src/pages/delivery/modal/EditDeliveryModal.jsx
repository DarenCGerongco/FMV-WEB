import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDeliveryModal = ({
  deliveryId,
  deliveryManName,
  status,
  returnStatus,
  onClose,
  onSave,
}) => {
  const [employee, setEmployee] = useState(""); // Selected employee
  const [employees, setEmployees] = useState([]); // Available employees
  const [deliveryDetails, setDeliveryDetails] = useState(null); // Delivery details
  const [initialDetails, setInitialDetails] = useState(null); // Initial state for comparison
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [confirmChanges, setConfirmChanges] = useState(false); // Confirmation modal state

  const url = import.meta.env.VITE_API_URL; // API base URL

  // Fetch delivery details and employees
  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const response = await axios.get(`${url}/api/deliveries/${deliveryId}/product-lists`);
        setDeliveryDetails(response.data);
        setInitialDetails(JSON.parse(JSON.stringify(response.data))); // Deep copy for comparison
        setEmployee(response.data.delivery_man?.id || "");
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
        setEmployees(response.data.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Failed to load employees.");
      }
    };

    fetchDeliveryDetails();
    fetchEmployees();
  }, [deliveryId]);

  // Debug: Log delivery status for troubleshooting
  useEffect(() => {
    console.log("Delivery Details Status:", deliveryDetails?.status);
  }, [deliveryDetails]);

  const handleDamageChange = (e, index, product) => {
    const value = e.target.value;
    const quantity = product.quantity;

    if (value > quantity) {
      product.error = `Damages cannot exceed the available quantity (${quantity}).`;
    } else {
      product.error = null;
      product.no_of_damages = value;
    }

    setDeliveryDetails((prevDetails) => {
      const updatedProducts = [...prevDetails.products];
      updatedProducts[index] = { ...product };
      return { ...prevDetails, products: updatedProducts };
    });
  };

  const handleSave = () => {
    if (!deliveryDetails || deliveryDetails.status === "OD") {
      toast.error("Delivery cannot be edited while it is on delivery.");
      return;
    }

    const changes = getChanges(); // Get the list of changes
    if (changes.length > 0) {
      setConfirmChanges(true); // Show confirmation modal if changes exist
    } else {
      toast.info("No changes made."); // Notify user if no changes were made
      setConfirmChanges(false); // Ensure the confirmation modal does not show
    }
  };

  const getChanges = () => {
    const changes = [];

    // Check if delivery man changed
    if (employee && employee !== initialDetails.delivery_man?.id) {
      const newEmployeeName = employees.find((e) => e.id === employee)?.name;
      if (newEmployeeName) {
        changes.push(`Delivery man changed to ${newEmployeeName}`);
      }
    }

    // Check for changes in product damages
    deliveryDetails.products.forEach((product, index) => {
      if (product.no_of_damages !== initialDetails.products[index].no_of_damages) {
        changes.push(
          `Product "${product.name}" damages updated to ${product.no_of_damages || 0}`
        );
      }
    });

    return changes;
  };

  const confirmSave = async () => {
    try {
      const damages = deliveryDetails.products.map((product) => ({
        product_id: product.product_id,
        no_of_damages: product.no_of_damages || 0,
      }));

      const payload = {
        delivery_man_id: employee || null,
        damages,
      };

      const response = await axios.put(`${url}/api/deliveries/${deliveryId}/update`, payload);

      toast.success(response.data.message || "Delivery details updated successfully!");

      if (onSave) {
        onSave();
      }

      setConfirmChanges(false);
      onClose();
    } catch (error) {
      console.error("Error updating delivery:", error);
      toast.error(error.response?.data?.message || "Failed to update delivery.");
    }
  };

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
      {confirmChanges && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Changes</h2>
            <ul className="list-disc ml-5 mb-4">
              {getChanges().map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={() => setConfirmChanges(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={confirmSave}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
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
        <h1 className="font-bold text-blue-500">Delivery Details:</h1>
        <div className="max-h-72 p-2 overflow-y-auto">
          <ul className="list-disc">
            {deliveryDetails?.products?.length > 0 ? (
              deliveryDetails.products.map((product, index) => (
                <li key={product.product_id} className="flex flex-col mb-5 bg-gray-200 p-2 rounded">
                  <div className="flex">
                    <h1 className="text-md font-bold mr-2">Product ID #{product.product_id}:</h1>
                    <h2>
                      {product.name} (x{product.quantity}) - Php {product.price}
                    </h2>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <label
                      htmlFor={`damages-${index}`}
                      className="text-sm font-bold text-center text-red-500 "
                    >
                      Damages:
                    </label>
                    <input
                      id={`damages-${index}`}
                      type="number"
                      min="0"
                      max={product.quantity}
                      value={product.no_of_damages || ""}
                      onChange={(e) => handleDamageChange(e, index, product)}
                      className="w-1/4 border text-center border-gray-500 rounded-xl bg-red-100 p-1 text-sm"
                      placeholder="Enter damages"
                    />
                  </div>
                  {product.error && (
                    <span className="text-xs text-red-500">{product.error}</span>
                  )}
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
              !status || status === "OD"
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={handleSave}
            disabled={!status || status === "OD"}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDeliveryModal;
