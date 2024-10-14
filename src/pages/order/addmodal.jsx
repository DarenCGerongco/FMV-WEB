import React, { useState } from 'react';
import axios from 'axios';

const AddModal = ({ isOpen, closeAddModal, purchaseOrderDetails, setPurchaseOrderDetails, openCreateItemsOrderedModal }) => {
  const [addModalOpen, setAddModalOpen] = useState(isOpen);

  // Close modal function
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    closeAddModal();
  };

  // Create order function
  const createOrder = async () => {
    const orderData = {
      user_id: purchaseOrderDetails.admin_id, // Assuming admin_id is passed as a prop
      sale_type_id: 1,
      customer_name: purchaseOrderDetails.customer_name,
      status: 'P',
      address: {
        street: purchaseOrderDetails.street,
        barangay: purchaseOrderDetails.barangay,
        city: purchaseOrderDetails.city,
        province: purchaseOrderDetails.province,
        zip_code: purchaseOrderDetails.zipcode,
      },
      product_details: purchaseOrderDetails.productsListed.map(product => ({
        product_id: product.product_id,
        price: product.price,
        quantity: product.quantity,
      })),
    };

    try {
      const response = await axios.post(`${url}/api/purchase-orders-delivery`, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Order created successfully:', response.data);
      handleCloseAddModal(); // Close modal after successful order creation
    } catch (error) {
      if (error.response) {
        console.error('Error creating order:', error.response.data);
      } else {
        console.error('Error creating order:', error.message);
      }
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchaseOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    addModalOpen && (
      <div
        id="addModal"
        className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
      >
        <div className="bg-white p-6 rounded-lg shadow-2xl w-1/3">
          <h3 className="text-center text-lg font-bold mb-4">Create Purchase Order</h3>

          {/* Customer's Name Field */}
          <div className="mb-4">
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              placeholder="Customer's Name"
              className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={purchaseOrderDetails.customer_name}
              onChange={handleChange}
            />
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {['street', 'barangay', 'city', 'province', 'zipcode'].map((field, index) => (
              <div key={index}>
                <input
                  type="text"
                  id={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={purchaseOrderDetails[field]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end p-4">
            <div className="flex flex-col items-end space-y-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl w-32"
                onClick={openCreateItemsOrderedModal}
              >
                Create
              </button>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-white-500 text-black px-4 py-2 border border-gray-300 rounded-md shadow-2xl w-32"
                  onClick={handleCloseAddModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl w-32"
                  onClick={() => {
                    createOrder();
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AddModal;
