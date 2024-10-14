// src/pages/order/viewdeliveriesmodal.jsx
import React from 'react';

const ViewDeliveriesModal = ({ onClose, viewDeliveriesModalOpen }) => {
  if (!viewDeliveriesModalOpen) return null; // Do not render if the modal is not open

  return (
    <div
      id="viewDeliveriesModal"
      className="modal fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl w-3/5 max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-500 text-white text-center py-2 mb-4 rounded-md">
          <h3 className="text-lg font-bold">View Deliveries</h3>
        </div>

        {/* Delivery 1 */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold">Delivery 1</h4>
          </div>
          <p className="text-gray-500">Delivered to: <span className="font-bold">Barangay Lumbia</span></p>
          <p className="text-sm text-gray-500">Address: Masterson Ave, Lumbia, Cagayan de Oro City, 9000</p>
          <p className="text-sm text-gray-500">Date Delivered: 06/04/2024</p>
          <p className="text-sm text-gray-500">Delivery man: <span className="font-bold">Daren Rebote</span></p>

          {/* Items for Delivery 1 */}
          <div className="mt-4">
            <div className="border border-gray-300 rounded-md p-4 mb-2">
              <div className="flex justify-between">
                <p>₱1,500</p>
                <p>Submersible Pump</p>
                <p>x5</p>
              </div>
            </div>
            <div className="border border-gray-300 rounded-md p-4 mb-2">
              <div className="flex justify-between">
                <p>₱500</p>
                <p>Submersible Motor</p>
                <p>x1</p>
              </div>
            </div>
            <div className="border border-gray-300 rounded-md p-4">
              <div className="flex justify-between">
                <p>₱50</p>
                <p>1 Inch Tube 1 Meter</p>
                <p>x25</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery 2 */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h4 className="font-bold">Delivery 2</h4>
          </div>
          <p className="text-gray-500">Delivered to: <span className="font-bold">Barangay Lumbia</span></p>
          <p className="text-sm text-gray-500">Address: Masterson Ave, Lumbia, Cagayan de Oro City, 9000</p>
          <p className="text-sm text-gray-500">Date Delivered: 06/09/2024</p>
          <p className="text-sm text-gray-500">Delivery man: <span className="font-bold">Owen Cabarribas</span></p>

          {/* Items for Delivery 2 */}
          <div className="mt-4">
            <div className="border border-gray-300 rounded-md p-4 mb-2">
              <div className="flex justify-between">
                <p>₱1,500</p>
                <p>Submersible Pump</p>
                <p>x5</p>
              </div>
            </div>
            <div className="border border-gray-300 rounded-md p-4">
              <div className="flex justify-between">
                <p>₱50</p>
                <p>1 Inch Tube 1 Meter</p>
                <p>x15</p>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDeliveriesModal;
