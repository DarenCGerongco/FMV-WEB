import React, { useState, useEffect } from 'react';

const EditEmployeeModal = ({
  editDeliveryMan,
  handleEditDeliveryManChange,
  submitEditModal,
  closeEditModal
}) => {
  const [errors, setErrors] = useState({}); // State for error messages

  // Validate the form fields
  const validateForm = () => {
    let formErrors = {};
    if (!editDeliveryMan.name) formErrors.name = "Name is required";
    if (!editDeliveryMan.username) formErrors.username = "Username is required";
    if (!editDeliveryMan.email && editDeliveryMan.email !== "") formErrors.email = "Email is required";
    if (!editDeliveryMan.number) formErrors.number = "Phone number is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      submitEditModal(); // Proceed with submission if form is valid
    }
  };

  return (
    <div className="fixed justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-2xl w-1/3">
      <h3 className="text-lg font-bold mb-4">Edit Employee</h3>
      
      {/* Name Field */}
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
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Username Field */}
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
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
      </div>

      {/* Email Field */}
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
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Number Field */}
      <div className="mb-4">
        <label htmlFor="number" className="block text-gray-700">Phone Number:</label>
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
        {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={closeEditModal}
          className="w-32 r-4 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white px-4 py-2 border border-blue-500 hover:border-transparent rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit} // Submit function is triggered here
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
