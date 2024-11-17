import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './_style.css';

import qm from '../assets/qm.png';

const CreateDeliveryModal = ({ createDeliveryModalOpen, closeCreateDeliveryModal, setNewDeliveryModalOpen, purchaseOrderId }) => {
  if (!createDeliveryModalOpen) return null;

  const [deliverymanRecord, setDeliverymanRecord] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const url = import.meta.env.VITE_API_URL;
  const [productDetails, setProductDetails] = useState([]);
  const [quantityInputs, setQuantityInputs] = useState({}); // New state for quantities

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/api/users`);
        setDeliverymanRecord(response.data.data);
      } catch (e) {
        console.error('Error fetching users:', e);
      }
    };
    fetchUsers();

    const fetchPurchaseOrderByID_WithRemainingBalance = async () => {
      try {
        const response = await axios.get(`${url}/api/purchase-orders-get-remaining-balance/${purchaseOrderId}`);
        setProductDetails(response.data.Remaining.products);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPurchaseOrderByID_WithRemainingBalance();
  }, [url, purchaseOrderId]);

  const handleSelectUser = (userName) => {
    setSelectedUser(userName);
    setIsDropdownOpen(false);
  };

  // Handle change in quantity input
  const handleQuantityChange = (productId, value) => {
    setQuantityInputs(prevInputs => ({
      ...prevInputs,
      [productId]: value,
    }));
  };

  const assignEmployeeFunction = async () => {
    // Validation logic
    if (!selectedUser) {
      alert('Please select a delivery man.');
      return; // Stops here if validation fails
    }
  
    // Check if any product has a quantity input greater than its remaining quantity
    const invalidQuantities = productDetails.filter(product => {
      const inputQuantity = quantityInputs[product.product_id] || 0;
      return inputQuantity > product.remaining_quantity;
    });
  
    if (invalidQuantities.length > 0) {
      const errorMessage = invalidQuantities.map(product => 
        `Product: ${product.product_name} exceeds the remaining quantity. Remaining: ${product.remaining_quantity}, Entered: ${quantityInputs[product.product_id] || 0}`
      ).join('\n');
  
      alert(`Error:\n${errorMessage}`);
      return; // Stops here if validation fails
    }
  
    const hasValidQuantity = productDetails.some(product => {
      return (
        product.remaining_quantity > 0 &&
        quantityInputs[product.product_id] > 0
      );
    });
  
    if (!hasValidQuantity) {
      alert('Please fill in at least one valid quantity to create a delivery.');
      return; // Stops here if validation fails
    }
  
    // Constructing the form data based on your React component's state
    const formData = {
      purchase_order_id: purchaseOrderId, // Assuming `purchaseOrderId` is from the props or state
      user_id: deliverymanRecord.find(user => user.name === selectedUser)?.id, // Assuming `selectedUser` holds the name and you need to find the corresponding ID
      product_details: productDetails.map(product => ({
        product_id: product.product_id,
        quantity: quantityInputs[product.product_id] || 0, // Default to 0 if no input
      })),
      notes: "", // Add any notes if necessary; currently left as an empty string
    };
  
    // Form submission
    try {
      const response = await axios.post(`${url}/api/assign-employee`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response.data);
      alert('Employee assigned successfully!');
      closeCreateDeliveryModal(); // Only called if the request is successful
    } catch (error) {
      console.error('Error assigning employee:', error);
      alert('Failed to assign employee. Please try again.');
    }
  };
  

  return (
    <div
      id="createDeliveryModal"
      className="modal fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl w-2/4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={closeCreateDeliveryModal}
        >
          &times;
        </button>
        <div className="text-Black text-center py-2 mb-4 rounded-md">
          <h3 className="text-lg font-bold">
            Create Delivery
          </h3>
        </div>

        <form>
          <p><strong>Purchase Order ID:</strong> {String(purchaseOrderId || 'N/A')}</p>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold">Delivery Man:</label>
            <div 
              className="border border-gray-300 rounded-md p-2 cursor-pointer" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedUser || 'Select a Delivery Man'}
            </div>

            {isDropdownOpen && (
              <div className="border border-gray-300 rounded-md mt-2 max-h-32 overflow-y-auto bg-white shadow-lg">
                <ul>
                  {deliverymanRecord.map((user, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSelectUser(user.name)}
                    >
                      {user.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {productDetails.map((product, index) => (
              <div key={index} className='p-2'>
                <div className="productInfo">
                  <h3 className="productTitle">Product Name:</h3>
                  <h3 className="data">{product.product_name}</h3>
                  <div className="qm-container">
                    <img className='w-[25px] p-[5px]' src={qm} />
                    <div className="tooltip-text">The products the customer ordered.</div>
                  </div>
                </div>
                <div className="productInfo">
                  <h3 className="productTitle">Total Quantity:</h3>
                  <h3 className="data">{product.ordered_quantity}</h3>
                  <div className="qm-container">
                    <img className='w-[25px] p-[5px]' src={qm} />
                    <div className="tooltip-text">Total quantity of this product that the customer ordered.</div>
                  </div>
                </div>
                <div className="productInfo">
                  <h3 className="productTitle">Delivered:</h3>
                  <h3 className="data">{product.total_delivered_quantity}</h3>
                  <div className="qm-container">
                    <img className='w-[25px] p-[5px]' src={qm} />
                    <div className="tooltip-text">Total quantity delivered or on-going delivery.</div>
                  </div>
                </div>
                <div className="productInfo">
                  <h3 className="productTitle">Remaining Quantity:</h3>
                  <h3 className="data">{product.remaining_quantity}</h3>
                  <div className="qm-container">
                    <img className='w-[25px] p-[5px]' src={qm} />
                    <div className="tooltip-text">Quantity left to Deliver. `0` means you cannot create delivery over this product anymore.</div>
                  </div>
                </div>
                <div className="productInfo">
                  <h3 className="productTitle">Quantity to Deliver:*</h3>
                  {product.remaining_quantity === 0 ? (
                    <div className="flex items-center">
                      <div className="text-gray-500 italic mr-2">Order Filled</div>
                      <div className="qm-container">
                        <img className='w-[25px] p-[5px]' src={qm} />
                        <div className="tooltip-text">
                          Quantity has been fully delivered; further delivery is not allowed.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <input
                        type="number"
                        className="quantityInput"
                        min="1"
                        max={product.remaining_quantity}
                        value={quantityInputs[product.product_id] || ''}
                        onChange={(e) => handleQuantityChange(product.product_id, e.target.value)}
                      />
                      <div className="qm-container ml-2">
                        <img className='w-[25px] p-[5px]' src={qm} />
                        <div className="tooltip-text">
                          Enter the quantity to deliver equal or below the Quantity of {product.remaining_quantity}.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
            <div className='flex flex-row-reverse'>
              <button 
                className=' ml-2  bg-blue-500 duration-200 shadow-md rounded-md p-2 text-white font-bold hover:bg-white hover:text-blue-500' 
                onClick={(e) => {
                  e.preventDefault(); // Prevents the form submission and modal close
                  assignEmployeeFunction();
                }}
              >
                Create delivery
              </button>
              <button 
                className='bg-red-500 duration-200 shadow-md rounded-md p-2 text-white font-bold hover:bg-white hover:text-red-500' 
                onClick={closeCreateDeliveryModal} // This is your cancel button
              >
                Cancel
              </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDeliveryModal;
