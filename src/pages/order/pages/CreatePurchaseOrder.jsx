import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar';
import Modal from './CreatePurchaseOrderModal'; // Ensure this import path matches where your Modal component is located
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState({
    customer_name: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipcode: '',
  });
  const [productsListed, setProductsListed] = useState([]);
  const [productInputs, setProductInputs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Initialize the isModalOpen state here
  const url = import.meta.env.VITE_API_URL;

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  const addProductToList = useCallback((selectedProducts) => {
    setProductsListed(selectedProducts);
    const inputs = {};
    selectedProducts.forEach(product => {
      inputs[product.product_id] = {
        bidPrice: product.bid_price || '', // Preserve existing bid prices if any
        quantity: '' // Ensure quantity starts as empty
      };
    });
    setProductInputs(inputs);
  }, []);

  
  const removeProductFromList = useCallback((productId) => {
    setProductsListed(currentProducts => currentProducts.filter(p => p.product_id !== productId));
    setProductInputs(currentInputs => {
      const newInputs = { ...currentInputs };
      delete newInputs[productId];
      return newInputs;
    });
  }, []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setPurchaseOrderDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  }, []);

  const handleInputChange = (productId, field, value) => {
    setProductInputs(prev => {
      const updatedInputs = {
        ...prev,
        [productId]: {
          ...prev[productId],
          [field]: value === '' ? prev[productId].original_price : value, // Set to original_price if empty
        }
      };
      return updatedInputs;
    });
  };
  
  

  const createOrder = async () => {
    const admin_id = localStorage.getItem('userID');
    if (!admin_id) {
      alert('User ID is missing.');
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
        price: productInputs[product.product_id].bidPrice || product.original_price,  // Use bidPrice or original_price
        quantity: productInputs[product.product_id].quantity
      })),
    };
  
    try {
      await axios.post(`${url}/api/purchase-orders-delivery`, orderData);
      toast.success('Order created successfully!');
      setTimeout(() => {
        navigate('/order');
      }, 2000);
    } catch (error) {
      toast.error('Error creating order. Please check your inputs.');
      console.error('Error creating order:', error);
    }
  };
  


  return (
<div className="flex w-full">
  <Navbar />
    <div className="flex flex-col items-center w-full">
      <div className="shadow-md bg-gray-200 rounded p-2">
        <h3 className="text-center text-lg font-bold">Create Purchase Order</h3>
      </div>
      <div 
        className="flex flex-col  w-full justify-center shadow-md p-5 rounded mt-5"
      >
        <h1 className="text-xl font-bold">Customer's Details:</h1>
        <div className="grid grid-cols-2 gap-4">
          {['customer_name', 'street', 'barangay', 'city', 'province', 'zipcode'].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-bold">
                {field
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
                :
                <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full p-2 text-sm rounded-lg border-gray-300 border"
                type="text"
                id={field}
                name={field}
                value={purchaseOrderDetails[field]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 shadow-md p-5 w-full rounded">
        <h1 className="text-xl font-bold">Product Listed:</h1>
        <div className="grid grid-cols-10 bg-gray-300 p-2 rounded">
          <span className="col-span-1 font-bold">ID</span>
          <span className="col-span-2 font-bold">Product Name</span>
          <span className="col-span-2 font-bold">Category</span>
          <span className="col-span-1 font-bold">Original Price</span>
          <span className="col-span-1 font-bold">Available Quantity</span>
          <span className="col-span-1 font-bold text-red-500 text-center">Price (Discounted)</span>
          <span className="col-span-1 font-bold text-red-500 text-center">Quantity</span>
          <span className="col-span-1 font-bold text-red-500 text-center">Option</span>
        </div>
        {productsListed.length > 0 ? (
          productsListed.map((product, index) => (
            <div key={index} className="grid grid-cols-10 items-center p-2 border-b">
              <span className="col-span-1">{product.product_id}</span>
              <span className="col-span-2">{product.product_name}</span>
              <span className="col-span-2">{product.category_name}</span>
              <span className="col-span-1">₱ {product.original_price}</span>
              <span className="col-span-1 text-red-600">{product.quantity}</span>
              <input
                type="number"
                value={productInputs[product.product_id]?.bidPrice || ''} // Leave input empty if bidPrice is not set
                onChange={(e) => handleInputChange(product.product_id, 'bidPrice', e.target.value)}
                className="col-span-1 p-1 rounded text-center border m-1"
              />
              <input
                type="text"
                value={productInputs[product.product_id].quantity}
                onChange={(e) => handleInputChange(product.product_id, 'quantity', e.target.value)}
                className="col-span-1 p-1 rounded text-center border"
              />
              <button
                onClick={() => removeProductFromList(product.product_id)}
                className="col-span-1 text-red-600 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-center mt-2">No products added yet.</p>
        )}
      </div>
      <div className="flex justify-end mt-5">
        <button
          className="mr-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
          onClick={toggleModal}
        >
          Select Product
        </button>
        <button
          className="mr-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
          onClick={createOrder}
        >
          Submit
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal} addProductToList={addProductToList} />
      <ToastContainer />
    </div>
</div>

  );
};

export default CreatePurchaseOrder;
