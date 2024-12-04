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

  // Handler for changing pages
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handler for adding/removing a product from the chosen list
  const handleProductClick = (product) => {
    setChosenProducts((prev) => {
        const newChosenProducts = { ...prev };
        if (newChosenProducts[product.product_id]) {
            // If product is already chosen, remove it
            delete newChosenProducts[product.product_id];
        } else {
            // If product is not chosen, add it and set default quantity to 1
            newChosenProducts[product.product_id] = {
                ...product,
                orderQuantity: "", // Separate field for order quantity
            };
        }
        return newChosenProducts;
    });
};


  // Handler for product search
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

  // Handler for changing the quantity of a selected product
  const handleQuantityChange = (productId, value) => {
    setChosenProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        orderQuantity: value,
      },
    }));
  };

  // Submit handler for creating the walk-in order
  const handleSubmit = async () => {
    const orderData = {
      user_id: 1, // Assume user_id is 1 for demo purposes
      sale_type_id: 2, // Walk-in sale type
      customer_name: customerName || 'John Doe', // Default to John Doe if not provided
      product_details: Object.keys(chosenProducts).map((productId) => ({
        product_id: productId,
        price: chosenProducts[productId].original_price,
        quantity: chosenProducts[productId].orderQuantity, // Get the inputted quantity for order
      })),
    };

    try {
      await axios.post(`${url}/api/purchase-orders/create/walk-in`, orderData);
      alert('Walk-in order created successfully!');
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error creating walk-in order:', error);
      alert('Failed to create walk-in order.');
    }
  };

  return (
    <div className={`${isOpen ? 'fixed inset-0 z-50 flex items-center justify-center' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden transform transition-all w-[80%] h-[80%] flex flex-row">
        
        {/* Left side - Product List with Search and Pagination */}
        <div className="w-2/3 pr-4 flex flex-col">
          <h3 className="text-lg font-bold mb-4">Product List</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products by name..."
            className="mb-4 p-2 border rounded text-black" // Ensure text is black
          />
          <div className="flex-1 overflow-y-auto mb-4 border-t border-b border-gray-300">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <span>Loading...</span>
              </div>
            ) : (
              <>
                {filteredProducts.map((product) => (
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
                ))}
              </>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center">
            <button
              className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className="px-2 py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>

        {/* Right Side - Walk-in Order Form */}
        <div className="w-1/3 pl-4 border-l border-gray-300 overflow-y-auto">
          <h4 className="font-bold mb-2">Walk-in Order Details:</h4>
          <div className="mb-4">
            <label className="block font-bold mb-1">Customer Name:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Default: John Doe"
              className="w-full p-2 border rounded text-black" // Ensure text is black
            />
          </div>

          <h4 className="font-bold mb-2">Selected Products:</h4>
          {Object.keys(chosenProducts).length > 0 ? (
            Object.values(chosenProducts).map((product) => (
              <div key={product.product_id} className="mb-4 p-2 border rounded shadow bg-white">
                <div className="font-bold text-sm">{product.product_name}</div>
                <div className="text-sm">Category: {product.category_name}</div>
                <div className="text-sm">Price: ₱ {product.original_price}</div>
                <div className="font-bold text-green-500 text-sm">
                  Quantity Available: {product.quantity}
                </div>
                <div className="mt-2">
                  <label className="block font-bold text-sm mb-1">Quantity to Order:</label>
                  <input
                      type="number"
                      min="1"
                      value={product.orderQuantity}  // Ensure a valid default value (1)
                      onChange={(e) =>
                          handleQuantityChange(product.product_id, parseInt(e.target.value, 10))
                      }
                      className="w-full p-2 border rounded text-black" // Ensure text is black
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products selected.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex">
          <button
            onClick={onClose}
            className="mr-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
            disabled={!Object.keys(chosenProducts).length}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWalkInOrderModal;
