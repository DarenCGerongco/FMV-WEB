import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ViewDeliveriesModal = ({ onClose, viewDeliveriesModalOpen, purchaseOrderId }) => {
  const [deliveryData, setDeliveryData] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await axios.get(`${url}/api/purchase-orders-delivery-record/${purchaseOrderId}`);
        const data = response.data;
        setDeliveryData(data);
      } catch (error) {
        console.error("Error fetching delivery data:", error);
      }
    };

    if (purchaseOrderId) fetchDeliveryData();
  }, [purchaseOrderId, url]);

  if (!viewDeliveriesModalOpen || !deliveryData) return null;

  return (
    <div
      id="viewDeliveriesModal"
      className="modal fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl w-3/5 max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-500 text-white text-center py-2 mb-4 rounded-md">
          <h3 className="text-lg font-bold">View Deliveries</h3>
        </div>
        {/* Customer Info */}
        <div className="mb-6">
          <h4 className="font-bold">
            Customer: {deliveryData.customer_name}
          </h4>
          <p className="text-gray-500">
            Ordered Created by: {deliveryData.admin_name}
          </p>
          <p className="text-gray-500">
            Address: {deliveryData.address?.street || 'N/A'}, 
            {deliveryData.address?.barangay || 'N/A'}, 
            {deliveryData.address?.city || 'N/A'}, 
            {deliveryData.address?.province || 'N/A'}, 
            {deliveryData.address?.zip_code || 'N/A'}
          </p>
          <p className="text-gray-500">
            Order Date: {formatDate(deliveryData.created_at)}
          </p>
        </div>

        {/* Delivery Data */}
        {deliveryData.deliveries.length > 0 ? (
          deliveryData.deliveries.map((delivery, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-center">
                <h4 className="font-bold">Delivery no: {delivery.delivery_no}</h4>
              </div>
              <p className="text-sm text-gray-500">
                Delivery ID: <span className="font-bold">{delivery.delivery_id}</span>
              </p>
              <p className="text-sm text-gray-500">
                Delivery man: <span className="font-bold">{delivery.delivery_man_name}</span>
              </p>
              <p className="text-sm text-gray-500">
                Delivery Status: {delivery.delivery_status}
              </p>
              <p className="text-sm text-gray-500">
                Delivery Date: {delivery.delivery_created}
              </p>
              <p className="text-sm text-gray-500">
                Delivery Updated: {delivery.delivery_updated}
              </p>

              {/* Products for each delivery */}
              <div className="mt-4">
                {delivery.products.map((product, productIndex) => (
                  <div key={productIndex} className="border border-gray-300 rounded-md p-4 mb-2">
                    <div className="flex justify-around">
                      <p>₱{product.price}</p>
                      <p>{product.product_name}</p>
                      <p>x{product.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <h4 className="text-center text-gray-500">No Deliveries have been made yet.</h4>
        )}

        {/* Close button */}
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDeliveriesModal;
