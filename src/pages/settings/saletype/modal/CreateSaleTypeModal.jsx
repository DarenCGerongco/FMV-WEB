import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateSaleTypeModal = ({ isOpen, onClose, onSaleTypeCreated }) => {
  const url = import.meta.env.VITE_API_URL;
  const saletypesApi = '/api/sale-type';

  const [saleTypeName, setSaleTypeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!saleTypeName.trim()) {
      toast.error('Sale type name cannot be empty!');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${url}${saletypesApi}`, { sale_type_name: saleTypeName });
      toast.success('Sale type created successfully!');
      setSaleTypeName(''); // Clear the input field
      onSaleTypeCreated(); // Refresh sale types in the parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error creating sale type:', error);
      if (error.response && error.response.data?.error) {
        // Display validation errors
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
        <h2 className="text-lg font-bold mb-4">Create Sale Type</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="saleTypeName" className="block text-sm font-bold mb-2">
              Sale Type Name
            </label>
            <input
              type="text"
              id="saleTypeName"
              className="w-full p-2 border rounded"
              value={saleTypeName}
              onChange={(e) => setSaleTypeName(e.target.value)}
              placeholder="Enter sale type name"
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
  );
};

export default CreateSaleTypeModal;
