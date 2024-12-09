import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePurchaseOrderModal = ({ isOpen, onClose, addProductToList, orderType }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // Added search input state
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async (page) => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${url}/api/products`, {
          params: {
            page,
            search: searchInput.trim() || null, // Pass search parameter to API
          },
        });

        setProducts(response.data.products);
        setTotalPages(response.data.pagination.lastPage);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchProducts(currentPage);
    }
  }, [isOpen, currentPage, url, searchInput]);

  const handleSelectProduct = (event, product) => {
    event.stopPropagation();
    const newSelection = { ...selectedProducts };
    if (newSelection[product.product_id]) {
      delete newSelection[product.product_id];
    } else {
      newSelection[product.product_id] = product;
    }
    setSelectedProducts(newSelection);
    addProductToList(Object.values(newSelection));
  };

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    setCurrentPage(1); // Reset to page 1 whenever search changes
  };

  // Pagination Logic with a maximum of 15 visible pages
  const maxPageNumbersToShow = 15;
  let startPage = 1;
  let endPage = totalPages;
  if (totalPages > maxPageNumbersToShow) {
    if (currentPage <= 8) {
      // near the start
      startPage = 1;
      endPage = 15;
    } else if (currentPage > totalPages - 7) {
      // near the end
      startPage = totalPages - 14;
      endPage = totalPages;
    } else {
      // center around currentPage
      startPage = currentPage - 7;
      endPage = currentPage + 7;
    }
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={`${isOpen ? 'fixed inset-0 z-40 flex items-center justify-center' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden transform transition-all min-h-[47rem] w-[70%] relative">
        <h3 className="text-lg font-bold mb-4">
          "Select a Product for Delivery Order"
        </h3>
        
        {/* Searchbar */}
        <div className="flex mb-4">
          <div className="flex items-center w-full px-2 py-2 mr-1 border border-gray-300 rounded-md shadow-md focus-within:border-blue-500 relative h-12">
            <span className="font-bold text-black-500 whitespace-nowrap">PRODUCTS</span>
            <div className="border-l border-gray-300 h-10 mx-2"></div>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search for products"
              className="flex-grow focus:outline-none px-4 py-2 rounded-md sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
            />
          </div>
        </div>

        {/* Product List */}
        <div className="overflow-y-auto h-[43rem] border-t border-b border-gray-300">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <span>Loading...</span>
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.product_id}
                className="grid grid-cols-8 border-b hover:bg-gray-200 duration-100 cursor-pointer rounded p-0.5 m-1 bg-gray-100"
                onClick={(e) => handleSelectProduct(e, product)}
              >
                <div className="col-span-1 text-center flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={!!selectedProducts[product.product_id]}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectProduct(e, product);
                    }}
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
          ) : (
            <div className="text-center mt-4">No products found.</div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100 disabled:opacity-50"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {/* Page Number Buttons with Ellipses */}
          {startPage > 1 && (
            <span className="px-2 py-1">...</span>
          )}

          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-2 py-1 mx-1 rounded font-bold duration-100 shadow-md ${
                currentPage === pageNum ? "bg-blue-500 text-white" : "bg-gray-300 hover:bg-blue-500 hover:text-white"
              }`}
            >
              {pageNum}
            </button>
          ))}

          {endPage < totalPages && (
            <span className="px-2 py-1">...</span>
          )}

          <button
            className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
          <button
            className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100 disabled:opacity-50"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Last
          </button>
        </div>

        <button className="absolute top-0 right-0 p-4" onClick={onClose}>
          <span className="text-2xl text-gray-600">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderModal;
