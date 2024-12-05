import React from 'react';

const EditEmployeeModal = ({
  editDeliveryMan,
  handleEditDeliveryManChange,
  submitEditModal,
  closeEditModal
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl w-1/3">
      <h3 className="text-lg font-bold mb-4">Edit Employee</h3>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={editDeliveryMan.name}
          onChange={handleEditDeliveryManChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={editDeliveryMan.username}
          onChange={handleEditDeliveryManChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={editDeliveryMan.email}
          onChange={handleEditDeliveryManChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="number" className="block text-gray-700">Number:</label>
        <input
          type="text"
          id="number"
          name="number"
          value={editDeliveryMan.number}
          onChange={(e) => {
            const { value } = e.target;
            // Allow only numbers, plus (+), minus (-), parentheses (), and spaces
            if (/^[\d\s()+-]*$/.test(value)) {
              handleEditDeliveryManChange(e);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={closeEditModal}
          className="w-32 r-4 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white px-4 py-2 border border-blue-500 hover:border-transparent rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={submitEditModal}
          className="w-32 r-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// Make sure the component is exported as default
export default EditEmployeeModal;