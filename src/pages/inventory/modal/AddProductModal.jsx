import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProductModal = ({ onClose, fetchProducts }) => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [productName, setProductName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    categoryId: "",
    productName: "",
    originalPrice: "",
    quantity: "",
  });

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

  // Validate form fields
  const validateFields = () => {
    const newErrors = {};
    if (!categoryId) newErrors.categoryId = "Category is required.";
    if (!productName) newErrors.productName = "Product name is required.";
    if (!originalPrice || isNaN(originalPrice) || originalPrice <= 0)
      newErrors.originalPrice = "Price is required.";
    if (!quantity || quantity <= 0)
      newErrors.quantity = "Quantity missing and quantity must be greater than zero.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

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

  // Allow decimals in Original Price input
  const handleDecimalInput = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setOriginalPrice(value);
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
            className={`w-full p-2 border rounded-md ${errors.categoryId ? "border-red-500" : ""}`}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
        </div>

        {/* Product Name Input */}
        <div className="mb-4">
          <label className="block font-bold text-blue-600 mb-2">Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className={`w-full p-2 border rounded-md ${errors.productName ? "border-red-500" : ""}`}
          />
          {errors.productName && <p className="text-red-500 text-sm">{errors.productName}</p>}
        </div>

        {/* Original Price Input */}
        <div className="mb-4">
          <label className="block font-bold text-blue-600 mb-2">Original Price:</label>
          <input
            type="text"
            value={originalPrice}
            onChange={handleDecimalInput}
            className={`w-full p-2 border rounded-md ${errors.originalPrice ? "border-red-500" : ""}`}
          />
          {errors.originalPrice && <p className="text-red-500 text-sm">{errors.originalPrice}</p>}
        </div>

        {/* Quantity Input */}
        <div className="mb-4">
          <label className="block font-bold text-blue-600 mb-2">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={`w-full p-2 border rounded-md ${errors.quantity ? "border-red-500" : ""}`}
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end mt-4 gap-x-4">
          <button
            className="w-32 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white px-4 py-2 border border-blue-500 hover:border-transparent rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-40 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 rounded-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
