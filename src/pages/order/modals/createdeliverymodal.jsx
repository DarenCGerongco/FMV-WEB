import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './_style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import qm from '../assets/qm.png'; // Ensure your image path is correct

const CreateDeliveryModal = ({ createDeliveryModalOpen, closeCreateDeliveryModal, purchaseOrderId }) => {
  if (!createDeliveryModalOpen) return null;

  const [deliverymanRecord, setDeliverymanRecord] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [quantityInputs, setQuantityInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
       try {
          const response = await axios.get(`${url}/api/users`);
          console.log('Users Response:', response.data);
          setDeliverymanRecord(response.data.data);
       } catch (e) {
          console.error('Error fetching users:', e);
       }
    };
 
    const fetchPurchaseOrderByID_WithRemainingBalance = async () => {
       try {
          const response = await axios.get(`${url}/api/purchase-orders-get-remaining-balance/${purchaseOrderId}`);
          console.log('Purchase Order Response:', response.data);
          setProductDetails(response.data.Products.map(product => ({
             ...product,
             total_delivered_quantity: product.delivered_quantity,
             remaining_quantity: product.ordered_quantity - product.delivered_quantity
          })));
       } catch (e) {
          console.error('Error fetching purchase order details:', e);
       }
    };
 
    fetchUsers();
    fetchPurchaseOrderByID_WithRemainingBalance();
 }, [url, purchaseOrderId]);
 
  

  const handleSelectUser = (userName) => {
    setSelectedUser(userName);
    setIsDropdownOpen(false);
  };

  const handleQuantityChange = (productId, value) => {
    setQuantityInputs(prevInputs => ({
      ...prevInputs,
      [productId]: value,
    }));
  };

  const assignEmployeeFunction = async () => {
    if (!selectedUser) {
      toast.error('Please select a delivery man.');
      return;
    }
  
    // Filter out product details where no quantity is set or quantity is zero
    const validProductDetails = productDetails.filter(product => {
      const quantity = quantityInputs[product.product_id];
      return quantity > 0; // Ensure quantity is greater than zero
    });
  
    // Check for invalid quantities entered by the user
    const invalidQuantities = validProductDetails.filter(product => {
      const inputQuantity = quantityInputs[product.product_id];
      return inputQuantity > product.remaining_quantity;
    });
  
    if (invalidQuantities.length > 0) {
      const errorMessage = invalidQuantities.map(product =>
        `Product: ${product.product_name} exceeds the remaining quantity. Remaining: ${product.remaining_quantity}, Entered: ${quantityInputs[product.product_id]}`
      ).join('\n');
      toast.error(`Error:\n${errorMessage}`);
      return;
    }
  
    setIsLoading(true); // Start loading indicator
  
    // Prepare the form data to send to the backend
    const formData = {
      purchase_order_id: purchaseOrderId,
      user_id: deliverymanRecord.find(user => user.name === selectedUser)?.id,
      product_details: validProductDetails.map(product => ({
        product_id: product.product_id,
        quantity: quantityInputs[product.product_id] || 0,
      })),
      notes: "",
    };
  
    // Send the POST request to the backend API
    try {
      const response = await axios.post(`${url}/api/assign-employee`, formData);
      toast.success('Employee assigned successfully!');
      setTimeout(() => {
        setIsLoading(false); // Stop loading indicator
        closeCreateDeliveryModal(); // Close the modal on success
      }, 2000);
    } catch (error) {
      setIsLoading(false); // Stop loading indicator
  
      // Extract backend error response
      const backendError = error.response?.data;
  
      // Check for specific error messages and display them
      if (backendError && backendError.error) {
        // If the backend provides detailed exceeding products, display them
        if (backendError.exceeding_products && backendError.exceeding_products.length > 0) {
          const exceedingProductMessages = backendError.exceeding_products.map(product => (
            `Product: ${product.product_name} - Requested: ${product.requested_quantity}, Available: ${product.available_quantity || product.available_stock}`
          )).join('\n');
          toast.error(`Error: ${backendError.error}\n${exceedingProductMessages}`);
        } else {
          // Generic error message from the backend
          toast.error(backendError.error);
        }
      } else {
        // Fallback error message
        toast.error('Failed to assign employee. Please try again.');
      }
  
      console.error('Error assigning employee:', error.response || error);
    }
  };
  
  const isDeliveryButtonDisabled = productDetails.every(product => product.remaining_quantity === 0);

  return (
    <div
      id="createDeliveryModal"
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-[40%] max-h-[90vh] overflow-y-auto overflow-x-hidden relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={closeCreateDeliveryModal}
        >
          &times;
        </button>
        <h3 className="text-lg font-bold">
          Create Delivery
        </h3>
        <form>
          <p><strong>Purchase Order ID:</strong> {purchaseOrderId}</p>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">Delivery Man:</label>
            <div className="border border-gray-300 rounded-md p-2 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {selectedUser || 'Select a Delivery Man'}
            </div>
            {isDropdownOpen && (
              <ul className="border border-gray-300 rounded-md mt-2 max-h-32 overflow-y-auto bg-white shadow-lg">
                {deliverymanRecord.map((user, index) => (
                  <li key={index} className="p-2 hover:bg-blue-100 cursor-pointer" onClick={() => handleSelectUser(user.name)}>
                    {user.name}
                  </li>
                ))}
              </ul>
            )}
            {
            productDetails.map((product, index) => (
              <div key={index} className="p-2">
                <div className="productInfo">
                  <h3 className="productTitle">Product Name:</h3>
                  <h3 className="data">{product.product_name}</h3>
                  <div className="qm-container relative">
                    <img className='w-[25px] p-[5px]' src={qm} alt="Info" />
                    <div className="tooltip-text">The product the customer ordered.</div>
                  </div>
                </div>
                <div className="productInfo">
                  <h3 className="productTitle">Total Quantity:</h3>
                  <h3 className="data">{product.ordered_quantity}</h3>
                  <div className="qm-container relative">
                    <img className='w-[25px] p-[5px]' src={qm} alt="Info" />
                    <div className="tooltip-text">Total quantity of this product that the customer ordered.</div>
                  </div>
                </div>
                <div className="productInfo">
                  <h3 className="productTitle">Delivered:</h3>
                  <h3 className="data">{product.total_delivered_quantity}</h3>
                  <div className="qm-container relative">
                    <img className='w-[25px] p-[5px]' src={qm} alt="Info" />
                    <div className="tooltip-text">Total quantity delivered or on-going delivery.</div>
                  </div>
                </div>
                <div className="productInfo">
                  <h3 className="productTitle">Remaining Quantity:</h3>
                  <h3 className="data">{product.remaining_quantity}</h3>
                  <div className="qm-container relative">
                    <img className='w-[25px] p-[5px]' src={qm} alt="Info" />
                    <div className="tooltip-text">Quantity left to Deliver. `0` means you cannot create delivery over this product anymore.</div>
                  </div>
                </div>
                <div className="productInfo">
                  <h3 className="productTitle">Quantity to Deliver:*</h3>
                  {product.remaining_quantity === 0 ? (
                    <div className="flex items-center">
                      <div className="text-gray-500 italic mr-2">Nothing to Deliver</div>
                      <div className="qm-container relative z-50">
                        <img className='w-[25px] p-[5px]' src={qm} alt="Info" />
                        <div className="tooltip-text">
                          Quantity has been fully delivered; further delivery is not allowed.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-[30%] items-center">
                      <input
                        type="number"
                        className="quantityInput"
                        min="1"
                        max={product.remaining_quantity}
                        value={quantityInputs[product.product_id] || ''}
                        onChange={(e) => handleQuantityChange(product.product_id, e.target.value)}
                      />
                      <div className="qm-container relative z-50">
                        <img className='w-[25px] p-[5px]' src={qm} alt="Info" />
                        <div className="tooltip-text">
                          Enter the quantity to deliver equal or below the Quantity of {product.remaining_quantity}.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          }
          {/* <div>
            <h1>
              Return Data:
            </h1>
          </div> */}
            <div className='flex flex-row-reverse'>
            <button
                className={`ml-2 duration-200 shadow-md rounded-md p-2 font-bold ${
                  isLoading || isDeliveryButtonDisabled
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-700 rounded-lg text-white'
                }`}
                disabled={isLoading || isDeliveryButtonDisabled}
                onClick={(e) => {
                  e.preventDefault();
                  assignEmployeeFunction();
                }}
              >
                {isLoading ? 'Processing...' : 'Create delivery'}
              </button>
              <button 
                className='w-32 r-4 bg-transparent hover:bg-red-500 text-blue-700 hover:text-white px-4 py-2 border border-blue-500 hover:border-transparent rounded-lg' 
                onClick={closeCreateDeliveryModal} // This is your cancel button
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateDeliveryModal;
