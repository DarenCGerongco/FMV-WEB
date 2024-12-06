import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUsertypeModal = ({ isOpen, onClose, userType, onUsertypeUpdated }) => {
  const url = import.meta.env.VITE_API_URL;
  const usertypeApi = `/api/user-type/${userType?.id}/update`;

  const [userTypeName, setUserTypeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userType) setUserTypeName(userType.user_type);
  }, [userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userTypeName.trim()) {
      toast.error('User type name cannot be empty!');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(url + usertypeApi, { user_type: userTypeName });
      toast.success('User type updated successfully!');
      onUsertypeUpdated(); // Refresh the user types list
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating user type:', error);
      if (error.response && error.response.data?.error) {
        Object.values(error.response.data.error).forEach((errMsg) => toast.error(errMsg));
      } else {
        toast.error('An unknown error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Edit User Type</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userTypeName" className="block text-sm font-bold mb-2">
              User Type Name
            </label>
            <input
              type="text"
              id="userTypeName"
              className="w-full p-2 border rounded"
              value={userTypeName}
              onChange={(e) => setUserTypeName(e.target.value)}
              placeholder="Enter user type name"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="w-20 p-1 bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-transparent rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 ${
                isSubmitting
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } rounded`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUsertypeModal;
