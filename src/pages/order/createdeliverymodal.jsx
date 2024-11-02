import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateDeliveryModal = ({ createDeliveryModalOpen, closeCreateDeliveryModal, setNewDeliveryModalOpen, purchaseOrderId }) => {
  if (!createDeliveryModalOpen) return null;

  const [deliverymanRecord, setDeliverymanRecord] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const url = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState([]);
  const [productDetails, setProductDetails] = useState([])

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

    // Log the purchaseOrderId to verify that it's passed correctly
    console.log('Selected Purchase Order ID:', purchaseOrderId);

    const fetchPurchaseOrderByID = async () => {
      try{
        const response = await axios.get(`${url}/api/purchase-orders-delivery/${purchaseOrderId}`)

        // console.log('This is from response.data', response.data.product_details);
        setProductDetails(response.data.product_details);
        // productDetails.forEach((product) => {
        //   console.log(product);
        // })
        setUserData(response.data);
      } catch (error){
        console.error('Could not fetch Purchase Order by ID:', error);
      }
    }
    fetchPurchaseOrderByID();

    const fetchPurchaseOrderByID_WithRemainingBalance = async () => {
      try{
        const response = await axios.get(`${url}/api/purchase-orders-get-remaining-balance/${purchaseOrderId}`)

        console.log("This is from Amang",response);
      }catch (e){
        console.error(e);
      }
    }
    fetchPurchaseOrderByID_WithRemainingBalance();
  }, [url, purchaseOrderId]);

  const handleSelectUser = (userName) => {
    setSelectedUser(userName);
    setIsDropdownOpen(false);
  };

  return (
    <div
      id="createDeliveryModal"
      className="modal fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl w-2/4">
        <div className="bg-blue-600 text-white text-center py-2 mb-4 rounded-md">
          <h3 className="text-lg font-bold">Create Delivery</h3>
        </div>

        <form>
          {/* Display Purchase Order ID */}
          <p>
            <strong>Purchase Order ID:</strong> {String(purchaseOrderId || 'N/A')}
          </p>

          {/* Delivery Man Selection */}
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
            <ul>
              {productDetails.map((product, index) => (
                <li 
                  key={index}
                  className='p-2'
                >
                  {/* Display the product details in a readable format */}
                  {`Product ID: ${product.product_id}, Price: ${product.price}, Quantity: ${product.quantity}`}
                </li>
              ))}
            </ul>
            <div>
              <h2>
                Create delivery
              </h2>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateDeliveryModal;
