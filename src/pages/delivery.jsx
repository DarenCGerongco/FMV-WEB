import React, { useState } from 'react';
import Navbar from '../components/navbar';

function Delivery() {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isOngoingModalOpen, setIsOngoingModalOpen] = useState(false);
  const [isOrderDeliveredModalOpen, setIsOrderDeliveredModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleOpenConfirmationModal = (delivery) => {
    setSelectedDelivery(delivery);
    setIsConfirmationModalOpen(true);
  };

  const handleOpenOngoingModal = (delivery) => {
    setSelectedDelivery(delivery);
    setIsOngoingModalOpen(true);
  };

  const handleOpenOrderDeliveredModal = (delivery) => {
    setSelectedDelivery(delivery);
    setIsOrderDeliveredModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsConfirmationModalOpen(false);
    setIsOngoingModalOpen(false);
    setIsOrderDeliveredModalOpen(false);
    setSelectedDelivery(null);
  };

  return (
    <div className="flex w-full bg-gray-100">
      <Navbar />
      <div className="w-full ml-80 bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6">
          <h2 className="text-1xl font-bold">Management System Delivery</h2>
        </div>
        <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg shadow-xl">
          <div className="relative mt-4 flex items-center space-x-4">
            <div className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md shadow-xl focus-within:border-blue-500 relative h-12">
              <span className="text-black-500 whitespace-nowrap">DELIVERY</span>
              <div className="border-l border-gray-300 h-10 mx-2"></div>
              <input
                type="text"
                className="flex-grow focus:outline-none px-4 py-2 rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
                placeholder="Search for Delivery man"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md focus:outline-none">
                Search
              </button>
            </div>
          </div>

          {/* 1st Container - Confirmation */}
          <h2 className="text-xs mt-10 text-green-600 font-bold">Confirmation</h2>
          <div className="mt-2 bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-400 flex justify-between whitespace-nowrap">
              <span className="text-sm ml-1 text-gray-400 w-1/5">Delivery NO.</span>
              <span className="text-sm text-gray-400 mr-36">Delivered to</span>
              <span className="text-sm text-gray-400 mr-36">Delivery Man</span>
              <span className="text-sm text-gray-400 mr-36">Date</span>
            </h3>
            <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <span>2</span>
              <span>Barangay Lumbia</span>
              <span>Arlene Abad</span>
              <span>06/04/2024</span>
              <img
                src="./src/assets/info.png"
                alt="Delivery Image"
                className="w-7 h-7 rounded-full cursor-pointer"
                onClick={() => handleOpenConfirmationModal({ deliveryNo: 2, deliveredTo: 'Barangay Lumbia', deliveryMan: 'Arlene Abad', date: '06/04/2024' })}
              />
            </div>    
            <div className="bg-white mt-3 p-4 rounded-lg shadow-md flex justify-between items-center">
              <span>2</span>
              <span>Barangay Lumbia</span>
              <span>Arlene Abad</span>
              <span>06/04/2024</span>
              <img
                src="./src/assets/info.png"
                alt="Delivery Image"
                className="w-7 h-7 rounded-full cursor-pointer"
                onClick={() => handleOpenConfirmationModal({ deliveryNo: 2, deliveredTo: 'Barangay Lumbia', deliveryMan: 'Arlene Abad', date: '06/04/2024' })}
              />
            </div>        
          </div>

          {/* 2nd Container - Ongoing Delivery */}
          <h2 className="text-xs mt-10 text-green-600 font-bold">Ongoing Delivery</h2>
          <div className="mt-2 bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-400 flex justify-between whitespace-nowrap">
              <span className="text-sm ml-1 text-gray-400 w-1/5">Delivery NO.</span>
              <span className="text-sm text-gray-400 mr-36">Delivered to</span>
              <span className="text-sm text-gray-400 mr-36">Delivery Man</span>
              <span className="text-sm text-gray-400 mr-36">Date</span>
            </h3>
            <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <span>3</span>
              <span>Iponan</span>
              <span>Edelcris Cabarrubias</span>
              <span>07/04/2024</span>
              <img
                src="./src/assets/info.png"
                alt="Delivery Image"
                className="w-7 h-7 rounded-full cursor-pointer"
                onClick={() => handleOpenOngoingModal({ deliveryNo: 3, deliveredTo: 'Iponan', deliveryMan: 'Edelcris Cabarrubias', date: '07/04/2024' })}
              />
            </div>
          </div>

          {/* 3rd Container - Order Delivered */}
          <h2 className="text-xs mt-10 text-green-600 font-bold">Order Delivered</h2>
          <div className="mt-2 bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-400 flex justify-between whitespace-nowrap">
              <span className="text-sm ml-1 text-gray-400 w-1/5">Delivery NO.</span>
              <span className="text-sm text-gray-400 mr-36">Delivered to</span>
              <span className="text-sm text-gray-400 mr-36">Delivery Man</span>
              <span className="text-sm text-gray-400 mr-36">Date</span>
            </h3>
            <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <span>5</span>
              <span>Barangay Talaga</span>
              <span>Mark Cabarrubias</span>
              <span>09/04/2024</span>
              <img
                src="./src/assets/info.png"
                alt="Delivery Image"
                className="w-7 h-7 rounded-full cursor-pointer"
                onClick={() => handleOpenOrderDeliveredModal({ deliveryNo: 5, deliveredTo: 'Barangay Talaga', deliveryMan: 'Mark Cabarrubias', date: '09/04/2024' })}
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mt-3">
              <span>5</span>
              <span>Barangay Talaga</span>
              <span>Mark Cabarrubias</span>
              <span>09/04/2024</span>
              <img
                src="./src/assets/info.png"
                alt="Delivery Image"
                className="w-7 h-7 rounded-full cursor-pointer"
                onClick={() => handleOpenOrderDeliveredModal({ deliveryNo: 5, deliveredTo: 'Barangay Talaga', deliveryMan: 'Mark Cabarrubias', date: '09/04/2024' })}
              />
            </div>
          </div>
          
          {/* Order Delivered modal */}
          {isOrderDeliveredModalOpen && selectedDelivery && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Order Delivered Details</h2>
                <p><strong>Delivery NO:</strong> {selectedDelivery.deliveryNo}</p>
                <p><strong>Delivered to:</strong> {selectedDelivery.deliveredTo}</p>
                <p><strong>Delivery Man:</strong> {selectedDelivery.deliveryMan}</p>
                <p><strong>Date:</strong> {selectedDelivery.date}</p>

                {/* ongoing delivered modal content */}
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <div className="flex justify-between">
                    <span>₱1500</span>
                    <span>Submersible Pump</span>
                    <span>x5</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <div className="flex justify-between">
                    <span>₱1500</span>
                    <span>Submersible Pump</span>
                    <span>x5</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Proof of Delivery</h3>
                  <img
                    src="./src/assets/darwen.png"
                    alt="Proof of Delivery"
                    className="w-auto h-auto rounded-lg shadow-md"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Note:</h3>
                  <p>Hello Guten Morge Por que novenas achomera micasa oi?</p>
                </div>

                <button
                  className="mt-4 bg-blue-500 text-white ml-80 px-4 py-2 rounded-md shadow-md focus:outline-none"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}

         {/* Confirm Delivery modal */}
         {isConfirmationModalOpen && selectedDelivery && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Confirmation Details</h2>
                <p><strong>Delivery NO:</strong> {selectedDelivery.deliveryNo}</p>
                <p><strong>Delivered to:</strong> {selectedDelivery.deliveredTo}</p>
                <p><strong>Delivery Man:</strong> {selectedDelivery.deliveryMan}</p>
                <p><strong>Date:</strong> {selectedDelivery.date}</p>

                {/* Content for confirm delivery */}
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <div className="flex justify-between">
                    <span>₱1500</span>
                    <span>Submersible Pump</span>
                    <span>x5</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <div className="flex justify-between">
                    <span>₱1500</span>
                    <span>Submersible Pump</span>
                    <span>x5</span>
                  </div>      
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Proof of Delivery</h3>
                  <img
                    src="./src/assets/darwen.png" 
                    alt="Proof of Delivery"
                    className="w-auto h-auto rounded-lg shadow-md"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Note:</h3>
                  <p>Hello Guten Morge Por que novenas achomera micasa oi?</p>
                </div>

                <button
                  className="mt-4 bg-blue-500 text-white ml-80 px-4 py-2 rounded-md shadow-md focus:outline-none"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}

        {/* Ongoing Delivery modal */}
        {isOngoingModalOpen && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Ongoing Delivery Details</h2>
            <p><strong>Delivery NO:</strong> {selectedDelivery.deliveryNo}</p>
            <p><strong>Delivered to:</strong> {selectedDelivery.deliveredTo}</p>
            <p><strong>Delivery Man:</strong> {selectedDelivery.deliveryMan}</p>
            <p><strong>Date:</strong> {selectedDelivery.date}</p>

            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Order List:</h3>
                <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <div className="flex justify-between">
                    <span>₱1500</span>
                    <span>Submersible Pump</span>
                    <span>x5</span>
                </div>
                </div>
            </div>

        <div className="mt-4">
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex justify-between">
            <span>₱2500</span>
            <span>Water Heater</span>
            <span>x2</span>
          </div>
         </div>
         </div>

         <button
        className="mt-4 bg-blue-500 text-white ml-80 px-4 py-2 rounded-md shadow-md focus:outline-none"
        onClick={handleCloseModal} >
        Close
         </button>
        </div>
     </div>
        )}

    {/* Order Delivered modal */}
    {isOrderDeliveredModalOpen && selectedDelivery && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Order Delivered Details</h2>
                <p><strong>Delivery NO:</strong> {selectedDelivery.deliveryNo}</p>
                <p><strong>Delivered to:</strong> {selectedDelivery.deliveredTo}</p>
                <p><strong>Delivery Man:</strong> {selectedDelivery.deliveryMan}</p>
                <p><strong>Date:</strong> {selectedDelivery.date}</p>

                {/* Example content */}
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <div className="flex justify-between">
                    <span>₱1500</span>
                    <span>Submersible Pump</span>
                    <span>x5</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                  <div className="flex justify-between">
                    <span>₱1500</span>
                    <span>Submersible Pump</span>
                    <span>x5</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Proof of Delivery</h3>
                  <img
                    src="./src/assets/darwen.png"
                    alt="Proof of Delivery"
                    className="w-auto h-auto rounded-lg shadow-md"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Note:</h3>
                  <p>Hello Guten Morge Por que novenas achomera micasa oi?</p>
                </div>

                <button
                  className="mt-4 bg-blue-500 text-white ml-80 px-4 py-2 rounded-md shadow-md focus:outline-none"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
export default Delivery;
