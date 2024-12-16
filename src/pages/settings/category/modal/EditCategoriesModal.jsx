import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditCategoriesModal = ({ isOpen, onClose, category, onCategoryUpdated }) => {
  const url = import.meta.env.VITE_API_URL;
  const categoriesApi = `/api/categories/${category?.id}/update`;

  const [categoryName, setCategoryName] = useState('');
  const [safetyStock, setSafetyStock] = useState('');

  // Populate category details when modal is opened
  useEffect(() => {
    if (category) {
      setCategoryName(category.category_name);
      setSafetyStock(category.safety_stock || ''); // Initialize safety stock value
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!categoryName.trim()) {
      toast.error('Category name cannot be empty!');
      return;
    }

    if (safetyStock < 0) {
      toast.error('Safety stock must be a positive number!');
      return;
    }

    try {
      // Send POST request to update category
      await axios.post(url + categoriesApi, {
        category_name: categoryName,
        safety_stock: safetyStock,
      });

      toast.success('Category updated successfully!');
      onCategoryUpdated(); // Trigger parent component to refresh the category list
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.response && error.response.data?.error) {
        // Display validation errors
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
        <h2 className="text-lg font-bold mb-4">Edit Category</h2>
        <form onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-bold mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              className="w-full p-2 border rounded"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Safety Stock */}
          <div className="mb-4">
            <label htmlFor="safetyStock" className="block text-sm font-bold mb-2">
              Safety Stock Level
            </label>
            <input
              type="number"
              id="safetyStock"
              className="w-full p-2 border rounded"
              value={safetyStock}
              onChange={(e) => setSafetyStock(e.target.value)}
              placeholder="Enter safety stock"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            {/* Cancel Button */}
            <button
              type="button"
              className="w-20 p-1 bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-transparent rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>

            {/* Update Button */}
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

export default EditCategoriesModal;
