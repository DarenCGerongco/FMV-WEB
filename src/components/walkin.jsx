import React, { useState, useCallback } from 'react';
import WalkinIcon from '../assets/Floating-Button/cart.png';
import WalkInOrderModal from '../pages/order/pages/CreateWalkInOrderModal'; // Path updated accordingly

const Walkin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userID = localStorage.getItem('userID'); // Assuming user ID is stored here

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative z-50">
      {/* Walk-in Order Button */}
      <button
        onClick={toggleModal}
        className="duration-300 hover:scale-105 fixed bottom-6 right-6 bg-blue-500 p-2 rounded-full shadow-md hover:bg-blue-700 focus:outline-none group"
      >
        <img
          className="w-5 h-5 hover:scale-125 duration-200"
          src={WalkinIcon}
          alt="Walk-in Icon"
        />
        {/* Tooltip Text on Hover */}
        <span
          className="absolute bottom-[20%] right-[-80%] transform -translate-x-1/2 w-max py-1 px-2 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-bold z-100"
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
