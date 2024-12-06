import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditSaleTypeModal = ({ isOpen, onClose, saleType, onSaleTypeUpdated }) => {
  const url = import.meta.env.VITE_API_URL;
  const [saleTypeName, setSaleTypeName] = useState('');

  useEffect(() => {
    if (saleType) setSaleTypeName(saleType.sale_type_name);
  }, [saleType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!saleTypeName.trim()) {
      toast.error('Sale type name cannot be empty!');
      return;
    }

    try {
      await axios.post(`${url}/api/sale-type/${saleType.id}/update`, {
        sale_type_name: saleTypeName,
      });
      toast.success('Sale type updated successfully!');
      onSaleTypeUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating sale type:', error);
      if (error.response && error.response.data.error) {
        Object.values(error.response.data.error).forEach((errMsg) => toast.error(errMsg));
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Edit Sale Type</h2>
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
              className="w-20 p-1 bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-transparent rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSaleTypeModal;
