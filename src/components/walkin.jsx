import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import WalkinIcon from '../assets/Floating-Button/cart.png';
import WalkInOrderModal from '../pages/order/pages/CreateWalkInOrderModal';

const Walkin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userID = localStorage.getItem('userID'); // Assuming user ID is stored here
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  const handleRedirectToCreateDelivery = () => {
    navigate('/order/create-delivery'); // Redirect to Create Delivery page
  };

  return (
    <div className="fixed z-50">
      {/* Button to redirect to Create Purchase Order */}
      <button
        onClick={handleRedirectToCreateDelivery} // Handle the redirect
        className="duration-300 hover:scale-105 fixed bottom-20 right-5 bg-blue-500 p-2 rounded-full shadow-md hover:bg-blue-700 focus:outline-none group"
      >
        <img
          className="w-5 h-5 hover:scale-125 duration-200"
          src={WalkinIcon}
          alt="Walk-in Icon"
        />
        <span
          className="absolute bottom-0 mb-2 right-[-80%] transform -translate-x-1/2 w-max py-1 px-2 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-bold"
          style={{ whiteSpace: 'nowrap' }}
        >
          Create Purchase Order
        </span>
      </button>

      {/* Button to open the Walk-In Order Modal */}
      <button
        onClick={toggleModal}
        className="duration-300 hover:scale-105 fixed bottom-6 right-5 bg-green-500 p-2 rounded-full shadow-md hover:bg-green-700 focus:outline-none group"
      >
        <img
          className="w-5 h-5 hover:scale-125 duration-200"
          src={WalkinIcon}
          alt="Walk-in Icon"
        />
        <span
          className="absolute bottom-0 mb-2 right-[-80%] transform -translate-x-1/2 w-max py-1 px-2 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-bold"
          style={{ whiteSpace: 'nowrap' }}
        >
          Create Walk In Order
        </span>
      </button>

      {/* Walk-In Order Modal */}
      {isModalOpen && (
        <WalkInOrderModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          userID={userID}
        />
      )}
    </div>
  );
};

export default Walkin;
