import React from 'react';

const CreateEmployee = ({ newDeliveryMan, handleAddDeliveryManChange, submitAddModal, closeAddModal }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl w-1/4">
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
          onChange={handleAddDeliveryManChange}
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
          onChange={handleAddDeliveryManChange}
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
          className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-2xl"
          onClick={closeAddModal}
        >
          Close
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl"
          onClick={submitAddModal}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateEmployee;