import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemsOrderedModal = ({ itemsOrderedModalOpen, onClose, purchaseOrderID }) => {
  if (!itemsOrderedModalOpen) return null;

  const url = import.meta.env.VITE_API_URL;
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/purchase-orders-get-remaining-balance/${purchaseOrderID}`);
        setProductDetails(response.data.Products || []);
      } catch (e) {
        console.error('Error fetching product details:', e);
      }
    };

    if (purchaseOrderID) {
      fetchData();
    }
  }, [purchaseOrderID, url]);

  return (
    <div
      id="itemsOrderedModal"
      className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
    >
      <div className="bg-white p-5 rounded-lg drop-shadow-md w-1/2">
        <h3 className="text-center text-lg font-bold mb-5">Items Ordered</h3>
        <div className="grid grid-cols-8">
          <p className='col-span-1'>Prod. ID</p>
          <p className='col-span-2'>Prod. Name</p>
          <p className='col-span-2'>Ordered Quantity</p>
          <p className='col-span-1'>Price</p>
          <p className='col-span-2'>Remaining Quantity</p>
        </div>
        <div className="bg-gray-100 p-1 rounded-md drop-shadow-md">
          {productDetails.map((data, index) => (
            <div 
              className="grid grid-cols-8 gap-1 border-b border-gray-300 pb-1 items-center"
              key={index}
            >
              <p className="col-span-1">{data.product_id}</p>
              <p className="col-span-2">{data.product_name}</p>
              <p className="col-span-2">{data.ordered_quantity}</p>
              <p className="col-span-1">₱{data.price}</p>
              <p className="col-span-2 text-red-500">
                {data.ordered_quantity - parseInt(data.delivered_quantity)} {/* Calculate remaining quantity */}
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
