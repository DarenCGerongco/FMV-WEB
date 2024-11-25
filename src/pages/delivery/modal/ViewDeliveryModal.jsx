import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewDeliveryModal = ({ deliveryId, onClose }) => {
  const url = import.meta.env.VITE_API_URL; // Use the base URL from environment variables
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch delivery details
  const fetchDeliveryDetails = async () => {
    try {
      const response = await axios.get(`${url}/api/deliveries/${deliveryId}/report`);
      setDeliveryDetails(response.data);
      console.log(response.data); // Debugging log
    } catch (error) {
      console.error("Error fetching delivery details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (deliveryId) {
      fetchDeliveryDetails();
    }
  }, [deliveryId]);

  if (!deliveryId) return null; // Don't render if no delivery ID is provided
  if (loading) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from propagating
      >
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Loading delivery details...</p>
        </div>
      </div>
    );
  }

  if (!deliveryDetails) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose} // Close the modal when clicking the background
      >
        <div
          className="bg-white rounded-lg shadow-lg w- p-6"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal content from propagating
        >
          <p>Error Data; Contact admin</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close the modal when clicking outside the modal content
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-1/2"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from propagating
      >
        <h2 className="text-xl font-bold mb-4">Delivery Details</h2>

        {/* Delivery Information */}
        <div>
          <p><strong>Delivery ID:</strong> {deliveryDetails.delivery.delivery_id}</p>
          <p><strong>Purchase Order ID:</strong> {deliveryDetails.delivery.purchase_order_id}</p>
          <p><strong>Delivered By:</strong> {deliveryDetails.user.name || 'N/A'}</p>
          <p><strong>Status:</strong> {deliveryDetails.delivery.status}</p>
          <p><strong>Created:</strong> {deliveryDetails.delivery.created_at}</p>
          <p><strong>Notes:</strong> {deliveryDetails.delivery.notes || 'No comment'}</p>
        </div>

        {/* Display Images */}
        {deliveryDetails.images && deliveryDetails.images.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Images</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {deliveryDetails.images.map((image) => (
                <div key={image.id} className="flex flex-col justify-center items-center border rounded-lg shadow-md overflow-hidden">
                  <img
                    src={`${image.url}`} // Directly use the full image URL
                    alt={`Delivery Image ${image.id}`}
                    className="w-full h-48 object-contain" // Added object-contain
                  />
                  <p className="text-sm text-gray-600 text-center mt-2">
                    Uploaded at: {image.created_at}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No images uploaded for this delivery.</p>
        )}

        {/* Display Products */}
        {deliveryDetails.products && deliveryDetails.products.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Product List</h3>
            <table className="table-auto w-full mt-2 border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Product ID</th>
                  <th className="border px-4 py-2">Product Name</th>
                  <th className="border px-4 py-2">Quantity Delivered</th>
                  <th className="border px-4 py-2">No. of Damages</th>
                  <th className="border px-4 py-2">Intact Quantity</th>
                  <th className="border px-4 py-2">Reported At</th>
                </tr>
              </thead>
              <tbody>
                {deliveryDetails.products.map((product, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{product.product_id}</td>
                    <td className="border px-4 py-2">{product.product_name}</td>
                    <td className="border px-4 py-2">{product.quantity_delivered}</td>
                    <td className="border px-4 py-2">{product.no_of_damages}</td>
                    <td className="border px-4 py-2">{product.intact_quantity}</td>
                    <td className="border px-4 py-2">{product.reported_at || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No products reported for this delivery.</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewDeliveryModal;
