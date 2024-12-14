import React, { useState, useEffect } from "react";
import axios from "axios";

const CreatePurchaseOrderModal = ({ isOpen, onClose, addProductToList }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async (page) => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${url}/api/products`, {
          params: {
            page,
            search: searchInput.trim() || null,
            sort_by: sortBy,
            sort_order: sortOrder,
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
  }, [isOpen, currentPage, sortBy, sortOrder, searchInput]);

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

  const handleUnselectAll = () => {
    setSelectedProducts({});
    addProductToList([]); // Clear the selected products in the parent component
  };

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - 7);
  let endPage = Math.min(totalPages, currentPage + 7);
  
  if (endPage - startPage < 14) {
    if (startPage === 1) {
      endPage = Math.min(15, totalPages);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - 14);
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  

  return (
    <div className={`${isOpen ? "fixed inset-0 z-40 flex items-center justify-center" : "hidden"}`}>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden min-h-[47rem] w-[70%] relative">
        <h3 className="text-lg font-bold mb-4">Select a Product for Delivery Order</h3>

        {/* Searchbar */}
        <div className="flex mb-4 items-center">
          <div className="flex items-center w-full px-2 py-2 mr-1 border rounded-md shadow-md">
            <span className="font-bold">PRODUCTS</span>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search for products"
              className="flex-grow focus:outline-none px-4 py-2 rounded-md border-gray-300"
            />
          </div>
          <button
            className="w-1/6 px-4 py-4 font-bold bg-red-500 text-white rounded shadow hover:bg-red-600"
            onClick={handleUnselectAll}
            disabled={Object.keys(selectedProducts).length === 0}
          >
            Unselect All
          </button>
        </div>

        {/* Product List */}
        <div className="overflow-y-auto h-[43rem] border-t border-b">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">Loading...</div>
          ) : (
            <>
              {/* Header Row with Sorting */}
              <div className="grid grid-cols-8 border-b bg-gray-400 text-white font-bold rounded p-1">
                <div className="col-span-1 text-center">Select</div>
                <div
                  className="col-span-1 text-center cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  Product ID {sortBy === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </div>
                <div
                  className="col-span-2 text-left cursor-pointer"
                  onClick={() => handleSort("product_name")}
                >
                  Product Name {sortBy === "product_name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </div>
                <div
                  className="col-span-2 text-left cursor-pointer"
                  onClick={() => handleSort("category_name")}
                >
                  Category {sortBy === "category_name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </div>
                <div
                  className="col-span-1 text-right cursor-pointer"
                  onClick={() => handleSort("original_price")}
                >
                  Price {sortBy === "original_price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </div>
                <div
                  className="col-span-1 text-right cursor-pointer"
                  onClick={() => handleSort("quantity")}
                >
                  Stock {sortBy === "quantity" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </div>
              </div>

              {/* Product Rows */}
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.product_id}
                    className="grid grid-cols-8 border-b hover:bg-gray-200 duration-100 cursor-pointer rounded p-1"
                    onClick={(e) => handleSelectProduct(e, product)}
                  >
                    <div className="col-span-1 text-center">
                      <input
                        type="checkbox"
                        checked={!!selectedProducts[product.product_id]}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(e, product);
                        }}
                      />
                    </div>
                    <div className="col-span-1 text-center">{product.product_id}</div>
                    <div className="col-span-2 text-left">{product.product_name}</div>
                    <div className="col-span-2 text-left">{product.category_name}</div>
                    <div className="col-span-1 text-right">₱ {product.original_price}</div>
                    <div className="col-span-1 text-right">{product.quantity}</div>
                  </div>
                ))
              ) : (
                <div className="text-center mt-4">No products found.</div>
              )}
            </>
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
