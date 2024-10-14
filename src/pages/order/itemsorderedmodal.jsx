import React from 'react';

const ItemsOrderedModal = ({ itemsOrderedModalOpen, onClose }) => {
  if (!itemsOrderedModalOpen) return null;

  return (
    <div
      id="itemsOrderedModal"
      className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl w-1/3">
        <h3 className="text-center text-lg font-bold mb-5">Items Ordered</h3>
        
        {/* Static container for items */}
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
          <div className="flex flex-col">
            <div className="border-b border-gray-300 pb-2 mb-2 flex justify-between items-start">
              <div className="flex flex-col">
                <h4 className="font-semibold">Item 1</h4>
                <p className="text-gray-500">Amount: 2</p> {/* Amount below item name */}
              </div>
              <p className="ml-4">Price: $100</p> {/* Price on the right */}
            </div>
            <div className="border-b border-gray-300 pb-2 mb-2 flex justify-between items-start">
              <div className="flex flex-col">
                <h4 className="font-semibold">Item 2</h4>
                <p className="text-gray-500">Amount: 1</p> {/* Amount below item name */}
              </div>
              <p className="ml-4">Price: $200</p> {/* Price on the right */}
            </div>
            <div className="border-b border-gray-300 pb-2 mb-2 flex justify-between items-start">
              <div className="flex flex-col">
                <h4 className="font-semibold">Item 3</h4>
                <p className="text-gray-500">Amount: 5</p> {/* Amount below item name */}
              </div>
              <p className="ml-4">Price: $50</p> {/* Price on the right */}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemsOrderedModal;
