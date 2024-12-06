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
            onChange={handleAddDeliveryManChange}
            placeholder="Enter the name"
          />
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
            onChange={handleAddDeliveryManChange}
            placeholder="Enter the phone number"
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={newDeliveryMan.password}
            onChange={handleAddDeliveryManChange}
          />
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700">
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={newDeliveryMan.confirmPassword}
            onChange={handleAddDeliveryManChange}
          />
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
            onClick={submitAddModal} // Call the submit function passed as a prop
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
