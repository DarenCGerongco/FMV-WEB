import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar';
import Modal from './CreatePurchaseOrderDelivery_Modal'; 
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
  const [isModalOpen, setIsModalOpen] = useState(false); // For selecting products
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // For confirmation modal
  const [totalCost, setTotalCost] = useState(0); // Store total cost before confirm

  const url = import.meta.env.VITE_API_URL;

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  const addProductToList = useCallback((selectedProducts) => {
    setProductsListed(selectedProducts);
    const inputs = {};
    selectedProducts.forEach(product => {
      inputs[product.product_id] = {
        bidPrice: product.bid_price || '',
        quantity: ''
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
          [field]: value === '' ? prev[productId].original_price : value,
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
        price: productInputs[product.product_id].bidPrice || product.original_price,
        quantity: productInputs[product.product_id].quantity
      })),
    };
  
    setIsSubmitting(true);
    try {
      await axios.post(`${url}/api/purchase-orders-delivery`, orderData);
      toast.success("Order created successfully!", {
        onClose: () => {
          setIsSubmitting(false);
          navigate("/order");
        },
      });
    } catch (error) {
      toast.error("Error creating order. Please check your inputs.", {
        onClose: () => setIsSubmitting(false),
      });
      console.error("Error creating order:", error);
    }
  };

  // Handle submit with confirmation modal
  const handleSubmit = () => {
    // Calculate total cost
    let cost = 0;
    productsListed.forEach(product => {
      const price = parseFloat(productInputs[product.product_id].bidPrice || product.original_price);
      const quantity = parseInt(productInputs[product.product_id].quantity, 10) || 0;
      cost += price * quantity;
    });
    setTotalCost(cost);
    // Open confirmation modal
    setIsConfirmModalOpen(true);
  };

  const confirmOrder = () => {
    setIsConfirmModalOpen(false);
    createOrder();
  };

  const cancelOrder = () => {
    setIsConfirmModalOpen(false);
    // Do nothing, just close the modal
  };

  return (
    <div className="flex w-full">
      <Navbar />
      <div className="flex flex-col items-center w-full">
        <div className="w-11/12 mx-auto bg-white p-6 m-3 rounded-lg drop-shadow-md mb-6 border">
          <h3 className="text-1xl font-bold">CREATE PURCHASE ORDER</h3>
        </div>
        <div className="w-11/12 mx-auto bg-white p-6 m-3 rounded-lg drop-shadow-md mb-6 border">
          <h1 className="text-xl font-bold">Customer's Details:</h1>
          <hr className="h-px my-8 bg-gray-500 border-0 shadow-md"></hr>
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
                  className="w-full p-2 text-sm rounded-lg border shadow-lg"
                  type="text"
                  id={field}
                  name={field}
                  value={purchaseOrderDetails[field]}
                  onChange={(e) => {
                    const { name, value } = e.target;

                    // Validation for customer_name: allow only letters
                    if (name === 'customer_name' && /[0-9]/.test(value)) {
                      return;
                    }

                    // Validation for zipcode: allow only numbers
                    if (name === 'zipcode' && /[^\d]/.test(value)) {
                      return;
                    }

                    handleChange(e);
                  }}
                />
              </div>
            ))}
          </div>


          <hr className="h-px my-8 bg-gray-500 border-0 shadow-md"></hr>
          <h1 className="text-xl font-bold">Product Listed:</h1>
          <div className="grid grid-cols-10 bg-gray-300 p-2 rounded">
            <span className="col-span-1 font-bold">ID</span>
            <span className="col-span-2 font-bold">Product Name</span>
            <span className="col-span-2 font-bold">Category</span>
            <span className="col-span-1 font-bold">Original Price</span>
            <span className="col-span-1 font-bold text-red-600">Avail. Qty</span>
            <span className="col-span-1 font-bold text-red-500 text-center">Reduced Price</span>
            <span className="col-span-1 font-bold text-red-500 text-center">Units to buy</span>
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
                  value={productInputs[product.product_id]?.bidPrice || ''}
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
            <p className="text-center mt-6">No products added yet.</p>
          )}
          <hr className="h-px my-2 bg-gray-500 border-0 shadow-md"></hr>
          <div className="flex justify-end mt-5 items-end">
            <button
              className="mr-4 text-blue-500 px-4 py-2 hover:text-red-700 underline"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>

            <div className="flex gap-x-4">
              <button
                className="w-32 r-4 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white px-4 py-2 border border-blue-500 hover:border-transparent rounded-lg"
                onClick={toggleModal}
              >
                Select
              </button>
              <button
                className={`${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700 rounded-lg text-white"
                } w-32 text-white px-4 py-2`}
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={toggleModal} addProductToList={addProductToList} />
      </div>
      <ToastContainer />

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30%] max-h-[40vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Confirm Order</h3>
            <p>The total cost is: <span className="font-bold">₱{totalCost.toFixed(2)}</span></p>
            <p>Do you want to proceed?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={cancelOrder}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePurchaseOrder;
