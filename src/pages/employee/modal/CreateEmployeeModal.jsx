import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateEmployee = ({
  newDeliveryMan,
  handleAddDeliveryManChange,
  submitAddModal,
  closeAddModal,
}) => {
  const url = import.meta.env.VITE_API_URL;

  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({}); // State for error messages
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility

  // Fetch user types inside the modal
  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await axios.get(`${url}/api/user-type`);
        if (response.data && Array.isArray(response.data.data)) {
          setUserTypes(response.data.data); // Extract the `data` property
        } else {
          console.error("Expected an array for user types, got:", response.data);
          setUserTypes([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching user types:", error);
        setUserTypes([]); // Ensure it's still an array
      } finally {
        setLoading(false);
      }
    };

    fetchUserTypes();
  }, []);

  // Validate the form fields
  const validateForm = () => {
    let formErrors = {};
    if (!newDeliveryMan.usertype) formErrors.usertype = "Usertype is required";
    if (!newDeliveryMan.name) formErrors.name = "Name is required";
    if (!newDeliveryMan.username) formErrors.username = "Username is required";
    if (!newDeliveryMan.email && newDeliveryMan.email !== "") formErrors.email = "Email is required";
    if (!newDeliveryMan.number) formErrors.number = "Phone number is required";
    if (!newDeliveryMan.password) formErrors.password = "Password is required";
    if (newDeliveryMan.password !== newDeliveryMan.confirmPassword) formErrors.confirmPassword = "Passwords do not match";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      submitAddModal(); // Proceed with submission if form is valid
    }
  };

  // Handle phone number input (allow only numbers, spaces, +, -, and parentheses)
  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    if (/^[\d\s()+-]*$/.test(value)) {
      handleAddDeliveryManChange(e);
    }
  };

  // Handle name input (allow only letters)
  const handleNameChange = (e) => {
    const { value } = e.target;
    if (/^[A-Za-z\s]*$/.test(value)) {
      handleAddDeliveryManChange(e);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-1/2">
        <h3 className="text-lg font-bold mb-4">Add Employee</h3>

        {/* Usertype Dropdown */}
        <div className="mb-4">
          <label htmlFor="usertype" className="block text-gray-700">
            Usertype:
          </label>
          <select
            id="usertype"
            name="usertype"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={newDeliveryMan.usertype}
            onChange={handleAddDeliveryManChange}
          >
            <option value="">Select Usertype</option>
            {loading ? (
              <option disabled>Loading...</option>
            ) : (
              userTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.user_type}
                </option>
              ))
            )}
          </select>
          {errors.usertype && <p className="text-red-500 text-sm">{errors.usertype}</p>}
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={newDeliveryMan.name}
            onChange={handleNameChange} // Changed to handle name change
            placeholder="Enter the name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={newDeliveryMan.username}
            onChange={handleAddDeliveryManChange}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email (optional):
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={newDeliveryMan.email}
            onChange={handleAddDeliveryManChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Number Field */}
        <div className="mb-4">
          <label htmlFor="number" className="block text-gray-700">
            Phone Number:
          </label>
          <input
            type="text"
            id="number"
            name="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={newDeliveryMan.number}
            onChange={handlePhoneNumberChange} // Changed to handle phone number change
            placeholder="Enter the phone number"
          />
          {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={newDeliveryMan.password}
              onChange={handleAddDeliveryManChange}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700">
            Confirm Password:
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={newDeliveryMan.confirmPassword}
              onChange={handleAddDeliveryManChange}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            className="w-32 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white px-4 py-2 border border-blue-500 hover:border-transparent rounded-lg"
            onClick={closeAddModal}
          >
            Cancel
          </button>
          <button
            className="w-32 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit} // Trigger form validation on submit
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
