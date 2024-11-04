import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';


function Delivery() {
  const url = import.meta.env.VITE_API_URL;

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isOngoingModalOpen, setIsOngoingModalOpen] = useState(false);
  const [isOrderDeliveredModalOpen, setIsOrderDeliveredModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

// Start Status Data 

  const [onDelivery, setOnDelivery] = useState([]);
  const [pendingDeliveries, setPendingDeliveries] = useState([]); // <-- This is the data that manager will look and confirm. 
  const [successDelivery, setSuccessDelivery] = useState([]);
  const [failedDelivery, setFailedDelivery] = useState([]);

// End Status Data

// PENDING
  const handleOpenConfirmationModal = () => {
    setSelectedDelivery(delivery);
    setIsConfirmationModalOpen(true);
  };
// ON GOING 
  const handleOpenOngoingDeliveryModal = (delivery) => {
    setSelectedDelivery(delivery);
    setIsOngoingModalOpen(true);
  };

  // const handleOpenOngoingModal = (delivery) => {
  //   setSelectedDelivery(delivery);  // Set the clicked delivery
  //   setIsOngoingModalOpen(true);    // Open the modal
  // };

// SUCCESS DELIVERY
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

  // START FETCH DELIVERIES 
    useEffect(() => {
      const fetchOnDeliveryData = async () => {
        try{
          const response = await axios.get(`${url}/api/my-deliveries/on-delivery`);
          setOnDelivery(response.data);
          console.log('On-going', response.data)
          // Object.values(response.data).forEach((order) => {
          //   console.log('Purchase Order ID:', order.purchase_order_id)
          // })
        } catch (error){
          console.log(error);
        }
      }

      const fetchPendingData = async () => {
        try{
          const response = await axios.get(`${url}/api/my-deliveries/pending`);
          setPendingDeliveries(response.data);
          console.log('Pending data: ', response.data);
        }catch (error){
          console.log(error);
        }
      };

      const fetchSuccessData = async () => {
        try{
          const response = await axios.get(`${url}/api/my-deliveries/successful`);
          setSuccessDelivery(response.data);
        }catch (error){
          console.log(error)
        }
      }


      fetchOnDeliveryData();
      fetchPendingData();
      // fetchSuccessData();
      const timeInterval = setInterval(fetchPendingData, 20000);

      return () => clearInterval(timeInterval);
    }, [url]); 

    
    
  // END FETCH DELIVERIES


  return (
    <div className="flex w-full bg-white-100">
      <Navbar />
      <div className="w-full ml-80 bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-2xl mb-6 border">
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
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl focus:outline-none">
                Search
              </button>
            </div>
          </div>

          {/* 1st Container - Confirmation */}
          <h2 className="text-xs mt-10 text-green-600 font-bold ">Confirmation</h2>
          <div className="mt-2 bg-gray-100 p-4 rounded-lg shadow-2xl">
            <h3 className="text-sm text-gray-400 flex justify-between items-center">
              <span className="w-1/6 text-left">Purchase Order ID</span>
              <span className="w-1/3 text-left">Delivered to</span>
              <span className="w-1/3 text-left">Delivery Man</span>
              <span className="w-1/6 text-left">Date</span>
            </h3>
            <div className="p-4 rounded-lg shadow-2xl flex justify-between items-center bg-[#8EF7A8]">
            <ul>
                {pendingDeliveries && Object.values(pendingDeliveries).length > 0 ? (
                  Object.values(pendingDeliveries).map((pendingData, index)=> (
                    <div key={index}>
                      <li>
                        {pendingData.purchase_order_id} {pendingData.address.street}, {pendingData.address.barangay}, AmangKokak ka {pendingData.address.province}

                      </li>
                      <li>
                      </li>
                    </div>
                  ))
                ): (
                  <li>
                    No Pending Deliveries
                  </li>
                )}
              </ul>
              {/* <span className="w-1/6">2</span>
              <span className="w-1/3">Barangay Lumbia</span>
              <span className="w-1/3">Arlene Abad</span>
              <span className="w-1/6">06/04/2024</span> */}
              <img
                src="./src/assets/info.png"
                alt="Delivery Image"
                className="w-7 h-7 rounded-full cursor-pointer"
                onClick={() => handleOpenConfirmationModal({ deliveryNo: 2, deliveredTo: 'Barangay Lumbia', deliveryMan: 'Arlene Abad', date: '06/04/2024' })}
              />
            </div>    
            {/* <div className="mt-3 p-4 rounded-lg shadow-2xl flex justify-between items-center bg-[#8EF7A8]">
              <span className="w-1/6">3</span>
              <span className="w-1/3">Barangay Iponan</span>
              <span className="w-1/3">John Smith</span>
              <span className="w-1/6">06/05/2024</span>
              <img
                src="./src/assets/info.png"
                alt="Delivery Image"
                className="w-7 h-7 rounded-full cursor-pointer"
                onClick={() => handleOpenConfirmationModal({ deliveryNo: 3, deliveredTo: 'Barangay Iponan', deliveryMan: 'John Smith', date: '06/05/2024' })}
              />
            </div>         */}
          </div>

          {/* 2nd Container - Ongoing Delivery */}
          <h2 className="text-xs mt-10 text-green-600 font-bold">Ongoing Delivery</h2>
          <div className="mt-2 bg-gray-100 p-4 rounded-lg shadow-2xl">
            <h3 className="text-sm text-gray-400 flex justify-between items-center">
              <span className="w-1/6 text-left">Purchase Order ID</span>
              <span className="relative left-[12px] w-1/3 text-left">Delivered to</span>
              <span className="relative left-[-10px] w-1/3 text-left">Delivery Man</span>
              <span className="relative left-[-40px] w-1/6 text-left">Date</span>
            </h3>
            {onDelivery && Object.values(onDelivery).length > 0 ? (
              Object.values(onDelivery).map((onDeliveryData, index) => (
                <div
                  key={index}
                  className="m-3 p-4 rounded-lg shadow-2xl flex justify-between items-center bg-[#E6FCE6]"
                >
                  <span className="w-1/6 text-left">{onDeliveryData.purchase_order_id}</span>
                  <span className="w-1/3 text-left">{onDeliveryData.customer_name}</span>
                  <span className="w-1/3 text-left">{onDeliveryData.deliveryman_name}</span>
                  <span className="w-1/6 text-left">{onDeliveryData.date}</span>

                  <img
                    src="./src/assets/info.png"
                    alt="Delivery Image"
                    className="w-7 h-7 rounded-full cursor-pointer"
                    onClick={() => handleOpenOngoingDeliveryModal(onDeliveryData)} // Pass specific delivery
                  />
                </div>
              ))
            ) : (
              <span>No On-delivery.</span>
            )}
              {/* <span className="w-1/6">4</span>
              <span className="w-1/3">Iponan</span>
              <span className="w-1/3">Edelcris Cabarrubias</span>
              <span className="w-1/6">07/04/2024</span> */}
          </div>

          {/* 3rd Container - Delivered Order */}
          <h2 className="text-xs mt-10 text-gray-400 font-bold">Delivered Order</h2>
          <div className="mt-2 bg-gray-100 p-4 rounded-lg shadow-2xl">
            <h3 className="text-sm text-gray-400 flex justify-between items-center">
              <span className="w-1/6 text-left">Purchase Order ID</span>
              <span className="w-1/3 text-left">Delivered to</span>
              <span className="w-1/3 text-left">Delivery Man</span>
              <span className="w-1/6 text-left">Date</span>
            </h3>
            <div className="bg-white p-4 rounded-lg shadow-2xl flex justify-between items-center">
              <span className="w-1/6">5</span>
              <span className="w-1/3">Barangay Talaga</span>
              <span className="w-1/3">Mark Cabarrubias</span>
              <span className="w-1/6">09/04/2024</span>
              <img
                src="./src/assets/info.png"
                alt="Delivery Image"
                className="w-7 h-7 rounded-full cursor-pointer"
                onClick={() => handleOpenOrderDeliveredModal()}
              />
            </div>
          </div>
          
          {/* Order Delivered modal */}
          {isOrderDeliveredModalOpen && selectedDelivery && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Order Delivered Details</h2>
                <p><strong>Delivery Number:</strong> {selectedDelivery.deliveryNo}</p>
                 <p><strong>Delivered to:</strong> {selectedDelivery.deliveredTo}</p>
                <p><strong>Delivery Man:</strong> {selectedDelivery.deliveryMan}</p>
                <p><strong>Date:</strong> {selectedDelivery.date}</p>

                {/* ongoing delivered modal content */}
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-2xl">
                  <div className="flex justify-between">
                    <span>₱1500</span>
                    <span>Submersible Pump</span>
                    <span>x5</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-2xl">
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
                    className="w-auto h-auto rounded-lg shadow-2xl"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Note:</h3>
                  <p>Hello Guten Morge Por que novenas achomera micasa oi?</p>
                </div>

                <button
                  className="mt-4 bg-blue-500 text-white ml-80 px-4 py-2 rounded-md shadow-2xl focus:outline-none"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}

         {/* Confirm Delivery modal ✅✅✅✅✅ */} 
         {isConfirmationModalOpen && selectedDelivery && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Confirmation Details</h2>
                <p><strong>Delivery Number:</strong> {selectedDelivery.deliveryNo}</p>
                <p><strong>Delivered to:</strong> {selectedDelivery.deliveredTo}</p>
                <p><strong>Delivery Man:</strong> {selectedDelivery.deliveryMan}</p>
                <p><strong>Date:</strong> {selectedDelivery.date}</p>

                {/* Content for confirm delivery */}
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-2xl">
                  <div className="flex justify-between">
                    <span>₱1500</span>
                    <span>Submersible Pump</span>
                    <span>x5</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-2xl">
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
                    className="w-auto h-auto rounded-lg shadow-2xl"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Note:
                  </h3>
                  <p>
                    Hello Guten Morge Por que novenas achomera micasa oi?
                  </p>
                </div>

                <button
                  className="mt-4 bg-blue-500 text-white ml-80 px-4 py-2 rounded-md shadow-2xl focus:outline-none"
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
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">Ongoing Delivery Details</h2>
              <p>
                <strong>Delivery Number:</strong> {selectedDelivery.delivery_no}
              </p>
              <p>
                <strong>Delivered to:</strong> {selectedDelivery.customer_name}
              </p>
              <p>
                <strong>Delivery Man:</strong> {selectedDelivery.deliveryman_name}
              </p>
              <p>
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </p>

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Order List:</h3>
                {selectedDelivery.products.map((product, productIndex) => (
                  <div
                    className="p-4 bg-gray-100 rounded-lg shadow-2xl"
                    key={productIndex}
                  >
                    <div className="flex justify-between">
                      <span>₱{product.price}</span>
                      <span>{product.product_name}</span>
                      <span>x{product.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="mt-4 bg-blue-500 text-white ml-80 px-4 py-2 rounded-md shadow-2xl focus:outline-none"
                onClick={handleCloseModal}
              >
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
            <p><strong>Delivery Number:</strong> {selectedDelivery.deliveryNo}</p>
            <p><strong>Delivered to:</strong> {selectedDelivery.deliveredTo}</p>
            <p><strong>Delivery Man:</strong> {selectedDelivery.deliveryMan}</p>
            <p><strong>Date:</strong> {selectedDelivery.date}</p>

            {/* Example content */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-2xl">
              <div className="flex justify-between">
                <span>₱1500</span>
                <span>Submersible Pump</span>
                <span>x5</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-2xl">
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
                className="w-auto h-auto rounded-lg shadow-2xl"
              />
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Note:</h3>
              <p>Hello Guten Morge Por que novenas achomera micasa oi?</p>
            </div>

            <button
              className="mt-4 bg-blue-500 text-white ml-80 px-4 py-2 rounded-md shadow-2xl focus:outline-none"
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