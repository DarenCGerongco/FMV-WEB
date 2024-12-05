import React from 'react';

const CreateEmployee = ({ newDeliveryMan, handleAddDeliveryManChange, submitAddModal, closeAddModal }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl w-1/2">
      <h3 className="text-lg font-bold mb-4">Add Employee</h3>
      <div className="mb-4">
        <label htmlFor="usertype" className="block text-gray-700">Usertype:</label>
        <select
          id="usertype"
          name="usertype"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={newDeliveryMan.usertype}
          onChange={handleAddDeliveryManChange}
        >
          <option value="">Select Usertype</option> {/* Default placeholder */}
          <option value="1">Admin</option>
          <option value="2">Employee</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={newDeliveryMan.name}
          onChange={(e) => {
            const { value } = e.target;
            // Allow any character except numbers (0-9)
            if (!/\d/.test(value)) {
              handleAddDeliveryManChange(e);
            }
          }}
          placeholder="Enter the name"
        />
      </div>


      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={newDeliveryMan.username}
          onChange={handleAddDeliveryManChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700">Email(optional):</label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={newDeliveryMan.email}
          onChange={handleAddDeliveryManChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="number" className="block text-gray-700">Number:</label>
        <input
          type="text"
          id="number"
          name="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={newDeliveryMan.number}
          onChange={(e) => {
            const { value } = e.target;
            // Allow only numbers, spaces, plus (+), minus (-), and parentheses ()
            if (/^[\d\s()+-]*$/.test(value)) {
              handleAddDeliveryManChange(e);
            }
          }}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={newDeliveryMan.password}
          onChange={handleAddDeliveryManChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={newDeliveryMan.confirmPassword}
          onChange={handleAddDeliveryManChange}
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          className="w-32 r-4 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white px-4 py-2 border border-blue-500 hover:border-transparent rounded-lg"
          onClick={closeAddModal}
        >
          Cancel
        </button>
        <button
          className="w-32 r-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 rounded-lg"
          onClick={submitAddModal}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateEmployee;
