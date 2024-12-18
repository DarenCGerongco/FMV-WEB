import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShippingFast, FaCheckCircle } from "react-icons/fa";

// Define getStatusDisplayName Function
const getStatusDisplayName = (status) => {
  switch (status) {
    case "OD":
      return "On Delivery";
    case "P":
      return "Pending";
    case "F":
      return "Failed";
    case "S":
      return "Delivered";
    default:
      return "Unknown Status";
  }
};

// Determine warranty status based on the delivery status
const getWarrantyMessage = (status, timeExceeded) => {
  switch (status) {
    case "OD":
      return "Awaiting Delivery";
    case "P":
      return timeExceeded === "no"
        ? "Under Warranty Period (7 Days)."
        : "Warranty Period has Ended (7 Days passed).";
    case "S":
      return "Warranty Period has Ended";
    default:
      return "Unknown Warranty Status";
  }
};

const ViewDeliveryModal = ({ deliveryId, onClose }) => {
  const url = import.meta.env.VITE_API_URL;
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the selected image
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null); // Reset the selected image
  };

  // Function to fetch delivery details
  const fetchDeliveryDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/deliveries/${deliveryId}/report`);
      setDeliveryDetails(response.data);
    } catch (error) {
      console.error("Error fetching delivery details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setAcceptLoading(true);
    try {
      const response = await axios.post(`${url}/api/purchase-orders-/${deliveryId}/final-update-delivery`);
      if (response.status === 200) {
        alert("Delivery and returns updated successfully!");
        window.location.reload(); // Reload the page after a successful update
      } else {
        alert(response.data.message || "Failed to accept delivery. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting delivery:", error);
      alert("An error occurred while accepting the delivery. Please try again later.");
    } finally {
      setAcceptLoading(false);
    }
  };

  useEffect(() => {
    if (deliveryId) {
      fetchDeliveryDetails();
    }
  }, [deliveryId]);

  if (!deliveryId) return null;
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Loading delivery details...</p>
        </div>
      </div>
    );
  }

  if (!deliveryDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Error: Data not available. Please contact the administrator.</p>
        </div>
      </div>
    );
  }

  // Define isAcceptable based on conditions
  const isAcceptable =
    deliveryDetails.delivery.status === "P" &&
    deliveryDetails.time_exceeded === "yes" && // Ensure 2 minutes have passed
    deliveryDetails.products.every(
      (product) => product.return_status === "NR" || product.return_status === "S"
    ) &&
    !acceptLoading;

  const isEditable = deliveryDetails.delivery.status !== "S"; // Disable editing for status "S"

  const warrantyMessage = getWarrantyMessage(
    deliveryDetails.delivery.status,
    deliveryDetails.time_exceeded
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-1/2">
        <h2 className="text-xl font-bold mb-4">Delivery Details</h2>

        {/* Delivery Information */}
        <div>
          <p>
            <strong>Delivery ID:</strong> {deliveryDetails.delivery.delivery_id}
          </p>
          <p>
            <strong>Purchase Order ID:</strong> {deliveryDetails.delivery.purchase_order_id}
          </p>
          <p>
            <strong>Employee Assigned:</strong> {deliveryDetails.user.name || "N/A"}
          </p>
          <p>
            <strong>Status:</strong>
            <span
              className={`px-2 font-bold text-center rounded-full ml-2 ${
                deliveryDetails.delivery.status === "OD"
                  ? "bg-green-200 border border-green-500 text-green-500"
                  : deliveryDetails.delivery.status === "P"
                  ? "bg-pink-200 border border-pink-500 text-pink-500"
                  : deliveryDetails.delivery.status === "F"
                  ? "bg-red-500 text-white"
                  : deliveryDetails.delivery.status === "S"
                  ? "bg-green-400 text-black"
                  : "bg-gray-500 text-white"
              }`}
            >
              {getStatusDisplayName(deliveryDetails.delivery.status)}
            </span>
          </p>
          <p>
            <strong>Created:</strong> {deliveryDetails.delivery.created_at}
          </p>
        </div>

        <h1 className="mt-5 text-xl font-bold text-blue-500">Report:</h1>
        <p>
          <strong>Warranty Status:</strong>
          <span
            className={`font-bold ml-2 ${
              deliveryDetails.delivery.status === "P" && !deliveryDetails.time_exceeded
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {warrantyMessage}
          </span>
        </p>
        <p>
          <strong>Notes:</strong> {deliveryDetails.delivery.notes || "No comment"}
        </p>

        {/* Display Images */}
        {deliveryDetails.images && deliveryDetails.images.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Images</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {deliveryDetails.images.map((image) => (
                <div
                  key={image.id}
                  className="flex flex-col justify-center items-center border rounded-lg shadow-md overflow-hidden cursor-pointer"
                  onClick={() => openModal(image.url)} // Open modal on image click
                >
                  <img
                    src={image.url}
                    alt={`Delivery Image ${image.id}`}
                    className="w-full h-48 object-contain"
                  />
                  <p className="text-sm text-gray-600 text-center mt-2">
                    Uploaded at: {image.created_at}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">Image Pending for Employee's Delivery Report.</p>
        )}

        {/* Modal for Full Image View */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className=" p-3 rounded-lg">
              <img
                src={selectedImage}
                alt="Full View"
                className="w-[80vw] h-[80vh] object-contain"
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
              >
                X
              </button>
            </div>
          </div>
        )}

        {/* Display Products */}
        {deliveryDetails.products && deliveryDetails.products.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Product List</h3>
            <div className="overflow-y-auto max-h-60 border border-gray-300 rounded-lg">
              <table className="table-auto w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-sm">Status</th>
                    <th className="border px-4 py-2 text-sm">Product ID</th>
                    <th className="border px-4 py-2 text-sm">Product Name</th>
                    <th className="border px-4 py-2 text-sm">Quantity Delivered</th>
                    <th className="border px-4 py-2 text-sm">No. of Damages</th>
                    <th className="border px-4 py-2 text-sm">Intact Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryDetails.products.map((product, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-2 text-center">
                        <div className="flex justify-center items-center h-full">
                          {(deliveryDetails.delivery.status === "OD" &&
                            (product.return_status === "NR" || product.return_status === "P")) && (
                            <FaShippingFast className="text-blue-500 text-lg" />
                          )}
                          {(deliveryDetails.delivery.status === "P" &&
                            (product.return_status === "S" || product.return_status === "NR")) && (
                            <FaCheckCircle className="text-green-500 text-lg" />
                          )}
                        </div>
                      </td>
                      <td className="border px-2 py-2 text-xs text-center">{product.product_id}</td>
                      <td className="border px-1 py-1 text-xs text-center">{product.product_name}</td>
                      <td className="border px-4 py-2 text-xs text-center text-red-500 font-bold">
                        {product.quantity_delivered}
                      </td>
                      <td className="border px-4 py-2 text-xs text-center">{product.no_of_damages || "-"}</td>
                      <td className="border px-4 py-2 text-xs text-center">{product.intact_quantity || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No products reported for this delivery.</p>
        )}

        <div className="flex justify-end item-center w-full p-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-transparent rounded-lg"
          >
            Close
          </button>
          <button
            onClick={handleAccept}
            className={`ml-5 p-2 rounded text-white font-bold shadow-md duration-200 ${
              isAcceptable && isEditable
                ? "w-32 bg-blue-500 hover:bg-white hover:text-blue-500"
                : "w-32 bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isAcceptable || !isEditable}
          >
            {acceptLoading ? "Accepting..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDeliveryModal;
