import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProductModal = ({ onClose, fetchProducts }) => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [productName, setProductName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL;

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}/api/categories`);
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [url]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/products`, {
        category_id: categoryId,
        product_name: productName,
        original_price: parseFloat(originalPrice),
        quantity: parseInt(quantity, 10),
      });
      if (response.status === 200) {
        fetchProducts(); // Refresh products list after adding
        onClose(); // Close the modal
      } else {
        console.error("Error creating product:", response.data);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-3/5 max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-500 text-white text-center py-2 mb-4 rounded-md">
          <h3 className="text-lg font-bold">Add New Product</h3>
        </div>

        {/* Category Dropdown */}
        <div className="mb-4">
          <label className="block font-bold text-blue-600 mb-2">Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Name Input */}
        <div className="mb-4">
          <label className="block font-bold text-blue-600 mb-2">Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Original Price Input */}
        <div className="mb-4">
          <label className="block font-bold text-blue-600 mb-2">Original Price:</label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Quantity Input */}
        <div className="mb-4">
          <label className="block font-bold text-blue-600 mb-2">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md transition-all mr-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
          <button
            className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded-md transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
