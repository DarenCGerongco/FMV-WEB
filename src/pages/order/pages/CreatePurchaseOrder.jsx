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
    setProductInputs(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
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
        price: productInputs[product.product_id].bidPrice,
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
    <div className="flex flex-col w-full px-5">
      <Navbar />
      <div className="shadow-md bg-gray-200 rounded mt-[1%] ml-[18%]">
        <h3 className="text-center text-lg font-bold p-2">Create Purchase Order</h3>
      </div>
      <div className="flex flex-col justify-center shadow-md p-5 rounded ml-[16%] mt-[4%] ">
        <h1 className="text-xl font-bold">
          Customer's Details:
        </h1>
        <div className="flex w-full px-2 justify-between">
          {['customer_name', 'street', 'barangay', 'city', 'province', 'zipcode'].map((field, index) => (
            <div key={index} className="flex flex-col mt-2">
              <div className="flex ">
                <label className="w-auto text-sm font-bold">
                  {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                </label>
                <h1 className='text-red-500'>*</h1>
              </div>
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
        <div className="flex w-full flex-col p-2 mt-2">
          <h1 className="text-xl font-bold">
            Product Listed:
          </h1>
          <div className='grid grid-cols-10 bg-gray-300 px-2 rounded'>
            <span className='col-span-1 font-bold'>
              ID
            </span>
            <span className='col-span-2 font-bold'>
              Product Name
            </span>
            <span className='col-span-2 font-bold'>
              Category
            </span>
            <span className='col-span-1 font-bold'>
              Original Price
            </span>
            <span className='col-span-1 font-bold'>
              Available Quantity
            </span>
            <span className='col-span-1 font-bold rounded text-red-500 text-center'>
              Price (Discounted)
            </span>
            <span className='col-span-1 font-bold rounded text-red-500 text-center'>
              Quantity
            </span>
            <span className='col-span-1 font-bold rounded text-red-500 text-center'>
              Option
            </span>
          </div>
          {productsListed.length > 0 ? (
            productsListed.map((product, index) => (
              <div key={index} className="grid grid-cols-10 p-0.5 rounded mt-1 border-b">
                <span className="col-span-1">{product.product_id}</span>
                <span className="col-span-2">{product.product_name}</span>
                <span className="col-span-2">{product.category_name}</span>
                <span className="col-span-1">₱ {product.original_price}</span>
                <span className="col-span-1 text-red-600">{product.quantity}</span>
                <input 
                  type="number" 
                  value={productInputs[product.product_id].bidPrice}
                  onChange={(e) => {
                    // Update only if the input is empty or a valid number
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      handleInputChange(product.product_id, 'bidPrice', value);
                    }
                  }}
                  className="col-span-1 bg-gray-100 font-bold text-blue-500 rounded text-center mx-1"
                  placeholder="Php"
                />
                <input 
                  type="text" 
                  value={productInputs[product.product_id].quantity}
                  onChange={(e) => {
                    // Update only if the input is empty or a valid number
                    const value = e.target.value;
                    if (value === '' || /^\d+$/.test(value)) {
                      handleInputChange(product.product_id, 'quantity', value);
                    }
                  }}
                  className="col-span-1 bg-gray-100 text-blue-500 font-bold rounded text-center mx-1"
                  placeholder='Quantity'
                />
                <button 
                  className="col-span-1 text-red-600 hover:text-red-100 duration-100"
                  onClick={() => removeProductFromList(product.product_id)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div className="text-center border rounded my-0.5">No products added yet.</div>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full p-2">
        <div className="flex justify-end mb-2">
          <button
            className="w-64 bg-blue-500 text-white p-2 font-bold hover:bg-white hover:text-blue-500 duration-200 rounded-md shadow-md"
            onClick={toggleModal}
          >
            Select Product
          </button>
        </div>
        <div className='flex justify-end'>
          <button
            className="w-28 mr-8 bg-red-500 text-white p-2 font-bold hover:bg-white hover:text-red-500 duration-200 rounded-md shadow-md"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            className="w-28 bg-blue-500 text-white p-2 font-bold hover:bg-white hover:text-blue-500 duration-200 rounded-md shadow-md"
            onClick={createOrder}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Modal for selecting products */}
      <Modal isOpen={isModalOpen} onClose={toggleModal} addProductToList={addProductToList} />
      <ToastContainer />
    </div>
  );
};

export default CreatePurchaseOrder;