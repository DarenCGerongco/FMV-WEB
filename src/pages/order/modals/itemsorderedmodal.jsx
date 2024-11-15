import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemsOrderedModal = ({ itemsOrderedModalOpen, onClose, purchaseOrderID }) => {
  if (!itemsOrderedModalOpen) return null;

  const url = import.meta.env.VITE_API_URL;
  const [orderedData, setOrderedData] = useState([]);
  const [remainingData, setRemainingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch ordered data
        const orderedResponse = await axios.get(`${url}/api/purchase-orders-delivery/${purchaseOrderID}`);
        setOrderedData(orderedResponse.data.product_details);

        // Fetch remaining balance data
        const remainingResponse = await axios.get(`${url}/api/purchase-orders-get-remaining-balance/${purchaseOrderID}`);
        setRemainingData(remainingResponse.data.Remaining.products);

        console.log('Ordered Data:', orderedResponse.data.product_details);
        console.log('Remaining Data:', remainingResponse.data.Remaining.products);
      } catch (e) {
        console.error(e);
      }
    };

    if (purchaseOrderID) {
      fetchData();
    }
  }, [purchaseOrderID, url]); // Dependency array with purchaseOrderID and url

  // Merge orderedData with remainingData by product_id
  const mergedData = orderedData.map((item) => {
    const remainingItem = remainingData.find((r) => r.product_id === item.product_id);
    return {
      ...item,
      remaining_quantity: remainingItem ? remainingItem.remaining_quantity : 0,
    };
  });

  return (
    <div
      id="itemsOrderedModal"
      className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
    >
      <div className="bg-white p-5 rounded-lg drop-shadow-md w-1/2">
        <h3 className="text-center text-lg font-bold mb-5">Items Ordered</h3>
        <div className="grid grid-cols-8">
            <p className='col-span-1 '>Prod. ID</p>
            <p className='col-span-2'>Prod. Name</p>
            <p className='col-span-2'>Total Quan. Ordered</p>
            <p className='col-span-1'>Bid Price</p>
            <p className='col-span-2'>Remaining Quantity</p>
          </div>
        <div className="bg-gray-100 p-1 rounded-md drop-shadow-md">
          {mergedData.map((data, index) => (
            <div 
              className="grid grid-cols-8 gap-1 border-b border-gray-300 pb-1 items-center"
              key={index}
            >
              <p className="col-span-1">
                {data.product_id}
              </p>
              <p className="col-span-2">
                {data.product.product_name}
              </p>
              <p className="col-span-2">
                {data.quantity}
              </p>
              <p className="col-span-1">
                ₱{data.price}
              </p>
              <p className="col-span-2 text-red-500">
                {data.remaining_quantity}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemsOrderedModal;
