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

  const getUniqueStatuses = (returns) => {
    const statusSet = new Set();
    returns.forEach(ret => {
      statusSet.add(ret.status);
    });
    return Array.from(statusSet);
  };

  const statusLabels = {
    'S': 'Refunded',
    'P': 'Awaiting Refund',
    'NR': 'No Refunds',
    'default': 'On Delivery', // Default status if no returns
    'F': 'Failed', // Add "Failed" status
  };

  return (
    <div
      id="viewDeliveriesModal"
      className="modal fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl w-[60%] z-50 max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-500 text-white text-center py-2 mb-4 rounded-md">
          <h3 className="text-lg font-bold">View Deliveries</h3>
        </div>
        {/* Customer Info */}
        <div className="mb-6 shadow-lg border-b-4-slate-950 rounded-lg bg-blue-100 px-2">
          <p className="font-bold text-black">
            Purchase Order ID #: {deliveryData.purchase_order_id}
          </p>
          <p className="font-bold text-black">
            Customer: {deliveryData.customer_name}
          </p>
          <p className="font-bold text-black">
            Status: {deliveryData.status}
          </p>
          <p className="text-black font-bold">
            Order Created by: {deliveryData.admin_name}
          </p>
          <p className="text-black font-bold">
            Address: {deliveryData.address?.street || 'N/A'}, 
            {deliveryData.address?.barangay || 'N/A'}, 
            {deliveryData.address?.city || 'N/A'}, 
            {deliveryData.address?.province || 'N/A'}, 
            {deliveryData.address?.zip_code || 'N/A'}
          </p>
          <p className="text-black">
            Order Date: {formatDate(deliveryData.created_at)}
          </p>
        </div>

        {/* Delivery Data */}
        {deliveryData.deliveries.length > 0 ? (
          deliveryData.deliveries.map((delivery, index) => (
            <div key={index} className="mb-6 bg-white p-2 rounded-xl border-b-1 hover:bg-slate-100 shadow-md">
              <div className="flex justify-between items-center">
                <h4 className="font-bold">Delivery ID#: {delivery.delivery_id}</h4>
              </div>
              <p className="text-sm text-gray-500">
                Delivery ID #: <span className="font-bold">Delivery No: {delivery.delivery_no}</span>
              </p>
              <p className="text-sm text-gray-500">
                Delivery Man: <span className="font-bold">{delivery.delivery_man_name}</span>
              </p>
              <p className="text-sm text-gray-500">
                Delivery Status: {delivery.delivery_status}
              </p>
              <p className="text-sm text-gray-500">
                Delivery Date: {formatDate(delivery.delivery_created)}
              </p>
              <p className="text-sm text-gray-500">
                Delivery Updated: {formatDate(delivery.delivery_updated)}
              </p>

              {/* Products for each delivery */}
              <div className="mt-4">
                <div className="grid grid-cols-5 py-1 px-1">
                  <p className="col-span-1 font-bold pl-4 text-sm">Price</p>
                  <p className="col-span-1 font-bold pl-4 text-sm">Product Name</p>
                  <p className="col-span-1 font-bold pl-4 text-sm">Delivered Quantity</p>
                  <p className="col-span-1 font-bold pl-4 text-sm">Damages</p>
                  <p className="col-span-1 font-bold pl-4 text-sm">Returns</p>
                </div>
                {delivery.products.map((product, productIndex) => (
                  <div key={productIndex} className="grid grid-cols-5 bg-gray-200 shadow-md border-b-1 rounded-md py-1 px-1 mb-2">
                    <p className="col-span-1 font-bold pl-4 text-sm">₱{product.price}</p>
                    <p className="col-span-1 font-bold pl-4 text-sm">{product.product_name}</p>
                    <p className="col-span-1 font-bold pl-4 text-sm">x{product.quantity}</p>
                    <p className="col-span-1 font-bold pl-4 text-sm">{product.no_of_damages}</p>
                    <div className="col-span-1 text-sm text-green-600">
                      {delivery.delivery_status === 'F' ? (
                        <p className="font-bold text-red-500">{statusLabels['F']}</p>
                      ) : product.returns.length > 0 ? (
                        getUniqueStatuses(product.returns).map((status, idx) => (
                          <p key={idx} className="font-bold">{statusLabels[status]}</p>
                        ))
                      ) : (
                        <p className="font-bold text-yellow-500">{statusLabels['default']}</p>
                      )}
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
