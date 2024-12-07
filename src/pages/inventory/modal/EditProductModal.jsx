import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProductModal = ({ product, onClose, onEditSuccess }) => {
  const url = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    product_name: product.product_name || "",
    category_id: product.category_id || "",
    original_price: product.original_price || "",
    quantity: product.quantity || "",
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}/api/categories`);
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${url}/api/products/${product.product_id}`, formData);
      onEditSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-1/2">
        <h3 className="text-lg font-bold mb-4">Edit Product</h3>
        <div className="mb-4">
          <label htmlFor="product_name" className="block text-gray-700">
            Product Name:
          </label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label htmlFor="current_category" className="block text-gray-700">
            Current Category:
          </label>
          <span 
            className="w-full px-3 py-2 border border-gray-300 bg-gray-200 text-blue-500 font-bold rounded-md"
            >
            {product.category_name}
          </span>
        </div>
        <div className="mb-4">
          <label htmlFor="category_id" className="block text-gray-700">
            Category:
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border text-red-500 font-bold  border-gray-300 rounded-md"
          >
            <option value="">Select a category</option>
            {loadingCategories ? (
              <option disabled>Loading categories...</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="original_price" className="block text-gray-700">
            Price:
          </label>
          <input
            type="number"
            id="original_price"
            name="original_price"
            value={formData.original_price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-gray-700">
            Quantity:
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
