import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../../../../GlobalContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MdExpandMore } from "react-icons/md";
// import { RiResetLeftLine } from "react-icons/ri";
import { GrPowerReset } from "react-icons/gr";



const CreateWalkInOrderModal = ({ isOpen, onClose }) => {
  const { id, userName } = useContext(GlobalContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [chosenProducts, setChosenProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [globalDiscount, setGlobalDiscount] = useState('');
  const url = import.meta.env.VITE_API_URL;

  // Categories 
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}/api/categories`);
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, url]);
  


  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${url}/api/products`, {
          params: {
            page: currentPage,
            categories: selectedCategories.length > 0 ? selectedCategories.join(',') : null,
            search: searchQuery, // This is where the search query is passed
          },
        });
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
        setTotalPages(response.data.pagination.lastPage);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
  
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen, currentPage, selectedCategories, searchQuery, url]);
  

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  const handleProductClick = (product) => {
    setChosenProducts((prev) => {
      const newChosenProducts = { ...prev };
      if (newChosenProducts[product.product_id]) {
        delete newChosenProducts[product.product_id];
      } else {
        newChosenProducts[product.product_id] = {
          ...product,
          orderQuantity: '',
          discount: '',
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

  const handleDiscountChange = (productId, discount) => {
    setChosenProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        discount,
      },
    }));
  };

  const calculateDiscountedPrice = (price, individualDiscount) => {
    const globalDiscountValue = globalDiscount ? parseInt(globalDiscount, 10) : 0;
    const individualDiscountValue = individualDiscount ? parseInt(individualDiscount, 10) : 0;
  
    // Calculate discounts independently on the original price
    const priceAfterGlobal = price - (price * globalDiscountValue) / 100;
    const priceAfterIndividual = price - (price * individualDiscountValue) / 100;
  
    // Use the lowest price (if both are applied, it ensures they don't stack)
    return Math.min(priceAfterGlobal, priceAfterIndividual);
  };
  

  const handleSubmit = async () => {
    const orderData = {
      user_id: id,
      sale_type_id: 2,
      customer_name: customerName || 'John Doe',
      product_details: Object.keys(chosenProducts).map((productId) => {
        const product = chosenProducts[productId];
        const discountedPrice = calculateDiscountedPrice(product.original_price, product.discount);
        return {
          product_id: productId,
          price: discountedPrice,
          quantity: product.orderQuantity,
        };
      }),
    };

    try {
      await axios.post(`${url}/api/purchase-orders/create/walk-in`, orderData);
      toast.success('Walk-in order created successfully!');
      handleReset();
    } catch (error) {
      console.error('Error creating walk-in order:', error);
    
      const errorResponse = error.response?.data;
    
      // Check if error response contains validation errors
      if (errorResponse && typeof errorResponse === 'object') {
        // Assuming `errorResponse` is an object like { field: [errors] }
        Object.entries(errorResponse).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(message));
          } else {
            toast.error(`${field}: ${messages}`);
          }
        });
      } else {
        const errorMessage =
          errorResponse?.error || 'Failed to create walk-in order. Please try again later.';
        toast.error(errorMessage);
      }
    }
    
    
  };


  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleCustomerNameChange = (value) => {
    // Validate the name using regex
    if (!/^[A-Za-z\s.\-]*$/.test(value)) {
      toast.error('Invalid input. Use letters, spaces, "-", or "." only.');
      return;
    }
    setCustomerName(value); // Update state only if the indput is valid
  };
  
  const handleReset = () => {
    if (
      Object.keys(chosenProducts).length === 0 &&
      !customerName.trim() &&
      !globalDiscount
    ) {
      toast.info('There is nothing to reset.');
      return;
    }
  
    setChosenProducts({}); // Clear the selected products
    setCustomerName(''); // Clear the customer name input
    setGlobalDiscount(''); // Reset global discount
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        discount: '', // Reset individual product discounts
        manualPrice: null, // Reset manual price, if applicable
      }))
    );
    
    toast.info('Everything has been reset: selected products, discounts, and customer name.');
  };
  
  
  
  return (
    <div className={`${isOpen ? 'fixed inset-0 z-50 flex items-center justify-center' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden transform transition-all w-[90%] h-[90%] flex flex-row">
        <div className="w-2/3 pr-4 flex flex-col">
          <h3 className="text-lg font-bold mb-4">Product List</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products by name..."
            className="mb-4 p-2 border rounded text-black"
          />
          <div className="relative  mb-2">
            <div className="flex">              
              <button
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className={`p-2 flex items-center text-xs shadow-md border font-bold duration-200 rounded-full ${
                  isFilterOpen ? 'bg-blue-900 text-white' : 'bg-white hover:bg-blue-500 hover:text-white'
                }`}
              >
                Category
                <MdExpandMore/>
              </button>
              <button
                  onClick={handleReset}
                  className="px-2 flex ml-2  justify-between items-center duration-300 hover:text-white text-xs shadow-md border hover:bg-yellow-500 bg-white  font-bold rounded-full"
                >
                <GrPowerReset
                  className='mr-2 w-5 h-3'
                />
                  Reset Walk-In Orders
              </button>
            </div>
            {isFilterOpen && (
              <div className="absolute flex flex-col mt-2 bg-white border rounded-lg shadow-lg z-10 w-48">
                <div className="p-1">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center text-sm cursor-pointer duration-100 hover:bg-blue-500 hover:text-white rounded px-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.category_name)}
                          onChange={() => handleCategoryToggle(category.category_name)}
                          className="mr-2"
                        />
                        {category.category_name}
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategories([])}
                  className=" m-1 shadow py-2 text-center font-bold border  hover:text-white duration-100  hover:bg-blue-500 rounded-lg mt-2"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          <div className=" rounded-lg transform transition-all w-full max-h-[100%] overflow-hidden flex flex-row">
          {/* Scrollable Container */}
            <div className="flex-1 flex flex-col overflow-hidden border-b border-gray-300 mb-5">
              {/* Header Row */}
              <div className="grid grid-cols-9 border-b bg-gray-200 rounded font-bold sticky px-1 top-0 z-10">
                <div className="col-span-1">ID</div>
                <div className="col-span-3">Product Name</div>
                <div className="col-span-3">Category Name</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-1 text-center">Quantity</div>
              </div>
              {/* Scrollable Product Rows */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <span>Loading...</span>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className={`grid grid-cols-9 border-b py-1 px-1 m-1 cursor-pointer rounded hover:bg-blue-500 hover:text-white duration-100 ${
                        chosenProducts[product.product_id]
                          ? 'bg-white'
                          : product.needs_reorder
                          ? 'bg-red-200 hover:bg-red-300 hover:font-bold hover:text-white'
                          : 'bg-gray-50'
                      }`}
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="col-span-1  flex items-center">
                        <input
                          type="checkbox"
                          checked={!!chosenProducts[product.product_id]}
                          onChange={() => handleProductClick(product)}
                          className="mr-2 pointer-events-none"
                        />
                        <span className="font-bold text-left">{product.product_id}</span>
                      </div>
                      <div className="col-span-3">{product.product_name}</div>
                      <div className="col-span-3">{product.category_name}</div>
                      <div className="col-span-1">₱ {product.original_price}</div>
                      <div
                        className={`col-span-1 text-center ${
                          product.needs_reorder ? 'text-red-600' : ''
                        }`}
                      >
                        {product.quantity}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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

        <div className="w-1/3 pl-4 border-l border-gray-300 b overflow-y-auto">
          <h4 className="font-bold mb-2">Walk-in Order Details:</h4>
          <input
            type="text"
            value={customerName}
            onChange={(e) => handleCustomerNameChange(e.target.value)}
            className="w-full p-2 border rounded text-black"
            placeholder="Customer Name"
          />

          <div className="mt-4">
            <h5 className="font-semibold mb-2">Global Discount:</h5>
            <select
              value={globalDiscount}
              onChange={(e) => setGlobalDiscount(e.target.value)}
              className="w-full p-2 border rounded text-black"
            >
              <option value="">No Discount</option>
              <option value="1">1%</option>
              <option value="2">2%</option>
              <option value="3">3%</option>
              <option value="4">4%</option>
              <option value="5">5%</option>
              <option value="10">10%</option>
            </select>
          </div>
          <div className="mt-4 ">
            <h5 className="font-semibold mb-2">Selected Products:</h5>
            {Object.keys(chosenProducts).length === 0 ? (
              <p className="text-gray-500">No products selected.</p>
            ) : (
              <ul className="space-y-2">
                {Object.keys(chosenProducts).map((productId) => {
                  const product = chosenProducts[productId];
                  const discountedPrice = calculateDiscountedPrice(
                    product.original_price,
                    product.discount
                  );

                  return (
                    <li key={productId} className="flex flex-col p-2 bg-gray-100 border rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-md font-bold text-blue-600  ">{product.product_name}</span>
                        <button
                          onClick={() => handleProductClick(product)}
                          className="text-red-500 font-bold border px-2 rounded-xl bg-white hover:bg-gray-200 duration-200 shadow-md hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">

                        <div className="flex items-center">
                          <label htmlFor={`quantity-${productId}`} className="mr-2">
                            Qty:
                          </label>
                          <input
                            id={`quantity-${productId}`}
                            type="number"
                            value={product.orderQuantity}
                            onChange={(e) =>
                              handleQuantityChange(productId, e.target.value)
                            }
                            className="w-16 p-1 text-right border rounded"
                            placeholder="Qty"
                            min="1"
                            max={product.quantity}
                          />
                        </div>
                        <div className="flex items-center">
                          <label htmlFor={`manual-price-${productId}`} className="mr-2">
                            Manual Price:
                          </label>
                          <input
                            id={`manual-price-${productId}`}
                            type="number"
                            value={product.manualPrice || ""}
                            onChange={(e) =>
                              setChosenProducts((prev) => ({
                                ...prev,
                                [productId]: {
                                  ...prev[productId],
                                  manualPrice: parseFloat(e.target.value) || null,
                                },
                              }))
                            }
                            className="w-16 p-1 text-right border rounded"
                            placeholder="Price"
                          />
                        </div>
                        <div className="flex items-center mt-2">
                          <label htmlFor={`discount-${productId}`} className="mr-2">
                            Discount:
                          </label>
                          <select
                            id={`discount-${productId}`}
                            value={product.discount || ""}
                            onChange={(e) => handleDiscountChange(productId, e.target.value)}
                            className="w-20 p-1 border rounded"
                          >
                            <option value="">None</option>
                            <option value="1">1%</option>
                            <option value="5">5%</option>
                            <option value="10">10%</option>
                          </select>
                        </div>
                      </div>
                      {/* Display discounted price */}
                      <div className="mt-2 flex justify-between text-sm text-green-500 font-semibold">
                      <span
                          className={` italic ${
                            product.quantity <= 200 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {product.quantity} left in stock
                        </span>
                        Actual Price: ₱{" "}
                        {product.manualPrice
                          ? product.manualPrice.toFixed(2)
                          : discountedPrice.toFixed(2)}

                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="bottom-0 left-0 right-0 p-4 bg-white flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black font-bold rounded duration-200"
              >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded duration-200"
              >
              Submit Order
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={true} />
    </div>
  );
};

export default CreateWalkInOrderModal;
