import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemsOrderedModal = ({ itemsOrderedModalOpen, onClose, purchaseOrderID }) => {
  if (!itemsOrderedModalOpen) return null;

  const url = import.meta.env.VITE_API_URL;
  const [productDetails, setProductDetails] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/purchase-orders-get-remaining-balance/${purchaseOrderID}`);
        const products = response.data.Products || [];
        setProductDetails(products);

        // Calculate total price
        const total = products.reduce((sum, product) => sum + (product.price * product.ordered_quantity), 0);
        setTotalPrice(total);
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
      <div className="bg-white p-5 rounded-lg drop-shadow-md w-1/2 max-h-[80vh] overflow-auto">
        <div className='bg-blue-500 text-white text-center py-2 mb-7 rounded-md'>
          <h3 className="text-lg font-bold">Items Ordered</h3>
        </div>
        <div className="grid grid-cols-8 font-bold border-b border-gray-300 pb-1 mb-2">
          <p className='col-span-1'>Prod. ID</p>
          <p className='col-span-2'>Prod. Name</p>
          <p className='col-span-2'>Ordered Qty</p>
          <p className='col-span-1'>Price</p>
          <p className='col-span-2'>Remaining Qty</p>
        </div>
        <div className="bg-gray-100 p-1 rounded-md drop-shadow-md">
          {productDetails.map((data, index) => {
            const remainingQuantity = data.ordered_quantity - parseInt(data.delivered_quantity, 10);
            return (
              <div
                className="grid grid-cols-8 gap-1 border-b border-gray-300 pb-1 items-center"
                key={index}
              >
                <p className="col-span-1">{data.product_id}</p>
                <p className="col-span-2">{data.product_name}</p>
                <p className="col-span-2">{data.ordered_quantity}</p>
                <p className="col-span-1">₱{data.price.toFixed(2)}</p>
                <p className="col-span-2 text-red-500">{remainingQuantity}</p>
              </div>
            );
          })}
        </div>

        {/* Display total price */}
        <div className="flex justify-end mt-4">
          <h1 className="font-bold mr-4">
            Total Price: ₱{totalPrice.toFixed(2)}
          </h1>
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
