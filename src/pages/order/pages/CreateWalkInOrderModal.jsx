import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateWalkInOrderModal = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [chosenProducts, setChosenProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch products from API based on current page
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${url}/api/products?page=${currentPage}`);
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
        setTotalPages(response.data.pagination.lastPage);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen, currentPage, url]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate the visible page numbers for the sliding window
  const getPageNumbers = () => {
    const maxPageNumbersToShow = 15;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxPageNumbersToShow) {
      if (currentPage <= 8) {
        startPage = 1;
        endPage = 15;
      } else if (currentPage > totalPages - 7) {
        startPage = totalPages - 14;
        endPage = totalPages;
      } else {
        startPage = currentPage - 7;
        endPage = currentPage + 7;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Handler for adding/removing a product from the chosen list
  const handleProductClick = (product) => {
    setChosenProducts((prev) => {
      const newChosenProducts = { ...prev };
      if (newChosenProducts[product.product_id]) {
        delete newChosenProducts[product.product_id];
      } else {
        newChosenProducts[product.product_id] = {
          ...product,
          orderQuantity: "",
        };
      }
      return newChosenProducts;
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.product_name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const handleQuantityChange = (productId, value) => {
    setChosenProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        orderQuantity: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const orderData = {
      user_id: 1,
      sale_type_id: 2,
      customer_name: customerName || 'John Doe',
      product_details: Object.keys(chosenProducts).map((productId) => ({
        product_id: productId,
        price: chosenProducts[productId].original_price,
        quantity: chosenProducts[productId].orderQuantity,
      })),
    };

    try {
      await axios.post(`${url}/api/purchase-orders/create/walk-in`, orderData);
      alert('Walk-in order created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating walk-in order:', error);
      alert('Failed to create walk-in order.');
    }
  };

  return (
    <div className={`${isOpen ? 'fixed inset-0 z-50 flex items-center justify-center' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden transform transition-all w-[80%] h-[80%] flex flex-row">
        <div className="w-2/3 pr-4 flex flex-col">
          <h3 className="text-lg font-bold mb-4">Product List</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products by name..."
            className="mb-4 p-2 border rounded text-black"
          />
          <div className="flex-1 overflow-y-auto mb-4 border-t border-b border-gray-300">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <span>Loading...</span>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.product_id}
                  className={`grid grid-cols-6 border-b p-1 m-1 cursor-pointer rounded hover:bg-blue-100 ${
                    chosenProducts[product.product_id] ? 'bg-blue-200' : 'bg-gray-100'
                  }`}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="col-span-1 text-center">{product.product_id}</div>
                  <div className="col-span-2 text-left pl-2">{product.product_name}</div>
                  <div className="col-span-1 text-right pr-2">₱ {product.original_price}</div>
                  <div className="col-span-1 text-right pr-2 text-red-600">{product.quantity}</div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
            >
              Previous
            </button>
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-2 py-1 mx-1 rounded ${
                  currentPage === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border font-bold hover:bg-blue-500 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
            >
              Last
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/3 pl-4 border-l border-gray-300 overflow-y-auto">
          <h4 className="font-bold mb-2">Walk-in Order Details:</h4>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border rounded text-black"
            placeholder="Customer Name"
          />
          {/* Render selected products */}
        </div>
      </div>
    </div>
  );
};

export default CreateWalkInOrderModal;
