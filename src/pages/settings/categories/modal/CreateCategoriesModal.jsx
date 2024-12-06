import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCategoriesModal = ({ isOpen, onClose, onCategoryCreated }) => {
  const url = import.meta.env.VITE_API_URL;
  const categoriesApi = '/api/categories';

  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!categoryName.trim()) {
      toast.error('Category name cannot be empty!');
      return;
    }
  
    const confirmation = window.confirm(
      `Are you sure you want to create the category: "${categoryName}"?`
    );
  
    if (!confirmation) return;
  
    setIsSubmitting(true);
  
    try {
      await axios.post(`${url}${categoriesApi}`, { category_name: categoryName });
      toast.success('Category created successfully!');
      setCategoryName(''); // Clear the input
      onCategoryCreated(); // Refresh parent categories list
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error creating category:', error);
  
      if (error.response && error.response.data) {
        const { error: validationErrors } = error.response.data;
  
        if (validationErrors && typeof validationErrors === 'object') {
          Object.keys(validationErrors).forEach((field) => {
            validationErrors[field].forEach((msg) => toast.error(msg));
          });
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
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Create New Category</h2>
        <form onSubmit={handleSubmit}>
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

export default CreateCategoriesModal;
