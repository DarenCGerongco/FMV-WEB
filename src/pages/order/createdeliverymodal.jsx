import React from 'react';

const CreateDeliveryModal = ({ createDeliveryModalOpen, closeCreateDeliveryModal, setNewDeliveryModalOpen }) => {
  if (!createDeliveryModalOpen) return null;

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
          <div className="mb-4">
            <input
              type="text"
              id="deliveredTo"
              className="border border-gray-300 p-2 w-full rounded-md"
              placeholder="Delivered to"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {/* Other input fields */}
            <div><input type="text" className="border border-gray-300 p-2 rounded-md w-full" placeholder="Str." /></div>
            <div><input type="text" className="border border-gray-300 p-2 rounded-md w-full" placeholder="City" /></div>
            <div><input type="text" className="border border-gray-300 p-2 rounded-md w-full" placeholder="Barangay" /></div>
            <div><input type="text" className="border border-gray-300 p-2 rounded-md w-full" placeholder="Zipcode" /></div>
          </div>

          {/* Delivery Man Section */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold" htmlFor="deliveryMan">Delivery Man:</label>
            <div className="border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto">
              <div className="flex flex-col space-y-2">
                <div className="p-2 rounded-md">MufFEy</div>
                <div className="p-2 rounded-md">Wat The dOg</div>
                <div className="p-2 rounded-md">GroGgy</div>
              </div>
            </div>
          </div>

          {/* Add Item Section */}
          <div className="mb-4 flex items-center">
            <input type="text" className="border border-gray-300 p-2 rounded-md w-full" placeholder="Add Item" />
            <button type="button" className="bg-blue-600 text-white hover:bg-blue-500 px-3 py-2 rounded-md ml-2">
              Add
            </button>
          </div>
          
          {/* Action buttons */}
          <div className="flex mt-20 justify-end space-x-2">
            <button className="bg-gray-500 text-white hover:bg-gray-700 px-3 py-1 rounded-md" onClick={closeCreateDeliveryModal}>Close</button>
            <button className="bg-blue-600 text-white hover:bg-blue-500 px-3 py-1 rounded-md" onClick={() => { closeCreateDeliveryModal(); setNewDeliveryModalOpen(true); }}>Create Delivery</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDeliveryModal;
