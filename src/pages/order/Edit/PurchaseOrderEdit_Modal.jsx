import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurchaseOrderEdit_Modal = ({ isOpen, onClose, addProductToList, existingProducts }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL;

  const fetchProducts = async (page, term = '') => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${url}/api/products?page=${page}&search=${term}`);
      setProducts(response.data.products);
      setTotalPages(response.data.pagination.lastPage);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts(currentPage, searchTerm);
    }
  }, [isOpen, currentPage, searchTerm]);

  const handleSelectProduct = (product) => {
    const newSelection = { ...selectedProducts };
    if (newSelection[product.product_id]) {
      delete newSelection[product.product_id];
    } else {
      newSelection[product.product_id] = { ...product, isEditable: true }; // Mark newly added products as editable
    }
    setSelectedProducts(newSelection);
  };

  const handleAddSelectedProducts = () => {
    addProductToList(Object.values(selectedProducts));
    setSelectedProducts({});
    onClose();
  };

  const isExistingProduct = (productId) => {
    return existingProducts.some((product) => product.product_id === productId);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`px-2 py-1 mx-1 rounded border font-bold ${
            i === currentPage ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-500 hover:text-white'
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={`${isOpen ? 'fixed inset-0 z-40 flex items-center justify-center' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden transform transition-all min-h-[47rem] w-[70%]">
        <h3 className="text-lg font-bold mb-4">Select Products to Add</h3>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Product List */}
        <div className="overflow-y-auto h-[43rem] border-t border-b border-gray-300">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">Loading...</div>
          ) : (
            products.map((product) => (
              <div
                key={product.product_id}
                className={`grid grid-cols-8 border-b hover:bg-gray-200 duration-100 cursor-pointer rounded p-0.5 m-1 ${
                  isExistingProduct(product.product_id) ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100'
                }`}
                onClick={() => !isExistingProduct(product.product_id) && handleSelectProduct(product)}
              >
                <div className="col-span-1 text-center flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={!!selectedProducts[product.product_id]}
                    disabled={isExistingProduct(product.product_id)}
                    onChange={() => !isExistingProduct(product.product_id) && handleSelectProduct(product)}
                    className="accent-blue-500 h-5 w-5"
                  />
                </div>
                <div className="col-span-1 text-center">{product.product_id}</div>
                <div className="col-span-2 text-left pl-2">{product.product_name}</div>
                <div className="col-span-2 text-left pl-2">{product.category_name}</div>
                <div className="col-span-1 text-right pr-2">₱ {product.original_price}</div>
                <div className="col-span-1 text-right pr-2 text-red-600">{product.quantity}</div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          <button
            className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 mr-2 bg-gray-400 text-white rounded hover:bg-gray-500" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleAddSelectedProducts}
          >
            Add Selected Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderEdit_Modal;
