import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUsertypeModal = ({ isOpen, onClose, onUsertypeCreated }) => {
  const url = import.meta.env.VITE_API_URL;
  const usertypeApi = '/api/user-type';

  const [userTypeName, setUserTypeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userTypeName.trim()) {
      toast.error('User type name cannot be empty!');
      return;
    }

    const confirmation = window.confirm(
      `Are you sure you want to create the user type: "${userTypeName}"?`
    );

    if (!confirmation) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${url}${usertypeApi}`, { user_type: userTypeName });
      toast.success('User type created successfully!');
      setUserTypeName('');
      onUsertypeCreated(); // Refresh user type list
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error creating user type:', error);

      // Handle specific error responses from the server
      if (error.response && error.response.data) {
        const { data } = error.response;

        if (data.error && typeof data.error === 'object') {
          Object.entries(data.error).forEach(([key, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((message) => toast.error(`${key}: ${message}`));
            }
          });
        } else if (data.error && typeof data.error === 'string') {
          toast.error(data.error);
        } else {
          toast.error('An unknown error occurred. Please try again.');
        }
      } else {
        toast.error('A network error occurred. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
          <h2 className="text-lg font-bold mb-4">Create New User Type</h2>
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
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default CreateUsertypeModal;
