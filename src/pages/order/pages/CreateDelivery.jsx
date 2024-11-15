import React, { useState } from 'react';
import axios from 'axios';

const CreateDelivery = () => {
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState({
    customer_name: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipcode: '',
  });
  const [productsListed, setProductsListed] = useState([]);
  const url = process.env.REACT_APP_API_URL; // Make sure to replace with your actual environment variable if using Vite

  // Function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPurchaseOrderDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  // Communication with the server
  const createOrder = async () => {
    const admin_id = localStorage.getItem('userID'); // Ensure the admin_id is set from local storage or context

    if (!admin_id) {
      console.error('User ID is missing.');
      return;
    }

    const orderData = {
      user_id: admin_id,
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
      product_details: productsListed.map(product => ({
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
      alert('Order created successfully!');
    } catch (error) {
      if (error.response) {
        alert('Error creating order: Please fill all required fields!');
        console.log('Error creating order:', error.response.data);
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  };

  return (
    <div className="p-6 flex">
      <h3 className="text-center text-lg font-bold mb-4">Create Purchase Order</h3>
      <div className="flex flex-col justify-center">
        {/* Customer Name */}
        <div className="flex items-center justify-center">
          <h2 className='w-1/3 font-bold'>Customer's Name:</h2>
          <input
            className="w-full p-2 my-2 rounded-lg border-black border-[1px]"
            type="text"
            id="customer_name"
            name="customer_name"
            placeholder="Customer's Name"
            value={purchaseOrderDetails.customer_name}
            onChange={handleChange}
          />
        </div>

        {/* Address Fields */}
        <div className="flex items-center justify-center">
          <h2 className='w-1/3 font-bold'>Street:</h2>
          <input
            type="text"
            id="street"
            name="street"
            placeholder="Street"
            className="w-full p-2 my-2 rounded-lg border-black border-[1px]"
            value={purchaseOrderDetails.street}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-center">
          <h2 className='w-1/3 font-bold'>Barangay:</h2>
          <input
            type="text"
            id="barangay"
            name="barangay"
            placeholder="Barangay"
            className="w-full p-2 my-2 rounded-lg border-black border-[1px]"
            value={purchaseOrderDetails.barangay}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-center">
          <h2 className='w-1/3 font-bold'>City:</h2>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City"
            className="w-full p-2 my-2 rounded-lg border-black border-[1px]"
            value={purchaseOrderDetails.city}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-center">
          <h2 className='w-1/3 font-bold'>Province:</h2>
          <input
            type="text"
            id="province"
            name="province"
            placeholder="Province"
            className="w-full p-2 my-2 rounded-lg border-black border-[1px]"
            value={purchaseOrderDetails.province}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-center">
          <h2 className='w-1/3 font-bold'>Zipcode:</h2>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
            placeholder="Zipcode"
            className="w-full p-2 my-2 rounded-lg border-black border-[1px]"
            value={purchaseOrderDetails.zipcode}
            onChange={handleChange}
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between p-4">
        <button
          className="w-32 bg-blue-500 text-white p-2 font-bold hover:bg-white hover:text-blue-500 duration-200 rounded-md shadow-md"
          onClick={createOrder}
        >
          Submit
        </button>
        <button
          className="w-32 bg-red-500 text-white p-2 font-bold hover:bg-white hover:text-red-500 duration-200 rounded-md shadow-md"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateDelivery;
