import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import AddProductModal from "./products/modal/AddProductModal";
import RestockModal from "./products/modal/RestockModal";
import EditProductModal from "./products/modal/EditProductModal";
import QuickButtons from "../components/quickButtons";
import { useNavigate } from "react-router-dom";

import { MdExpandMore } from "react-icons/md";
import { IoMdMore } from "react-icons/io";

function Product() {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // State management
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
  });

  const [loading, setLoading] = useState(false);
  const [totalAssets, setTotalAssets] = useState(0);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [restockProduct, setRestockProduct] = useState(null);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [sortBy, setSortBy] = useState("product_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({}); // State for dropdowns
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/categories`);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async (page = 1, filterReorder = false) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/products`, {
        params: {
          page,
          limit: 30,
          categories: selectedCategories.length > 0 ? selectedCategories.join(",") : null,
          search: searchInput,
          sort_by: sortBy,
          sort_order: sortOrder,
          needs_reorder: filterReorder ? true : null, // Pass the filter to the backend
        },
      });
  
      const products = response.data.products || [];
      setItems(products);
  
      setPagination({
        currentPage: response.data.pagination.currentPage,
        lastPage: response.data.pagination.lastPage,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and re-fetch when dependencies change
  useEffect(() => {
    fetchCategories();
    fetchProducts(pagination.currentPage);
  }, [pagination.currentPage, selectedCategories, sortOrder]);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchProducts(1);
  };

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleRestockClick = (product) => {
    setRestockProduct({
      id: product.product_id,
      name: product.product_name,
    });
    setShowRestockModal(true);
  };

  const handleEditClick = (item) => {
    setEditProduct({ ...item  });
    // console.log("HandleEditClick", item)
    setShowEditProductModal(true);
  };

  const handleSortByColumn = (column) => {
    const newSortOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newSortOrder);
  };

    // Toggle dropdown for a specific product
    const toggleDropdown = (productId) => {
      setOpenDropdowns((prev) => ({
        ...prev,
        [productId]: !prev[productId], // Toggle visibility for the clicked product
      }));
    };
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        const dropdowns = document.querySelectorAll(".dropdown-menu");
        let isClickInside = false;
  
        dropdowns.forEach((dropdown) => {
          if (dropdown.contains(event.target)) {
            isClickInside = true;
          }
        });
  
        if (!isClickInside) {
          setOpenDropdowns({}); // Close all dropdowns
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // console.log(items)

  const renderPagination = () => {
    const { currentPage, lastPage } = pagination;

    const maxPagesShown = 20; // Show 20 pages initially
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesShown / 2));
    let endPage = Math.min(lastPage, startPage + maxPagesShown - 1);

    // Dynamically extend when near the last page
    if (currentPage >= endPage - 3 && endPage < lastPage) {
      endPage = Math.min(lastPage, endPage + 5); // Dynamically add 5 pages
    }

    // Adjust the start page if the range exceeds limits
    if (endPage - startPage < maxPagesShown) {
      startPage = Math.max(1, endPage - maxPagesShown + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

      return (
        <div className="flex flex-col justify-center w-full space-x-2 my-7">
          <div className="">
            {isRestockMode && (
                <div className="text-center  mb-8  text-red-500 font-bold mt-4">
                  You are in Restock Mode. Select products to restock.
                </div>
              )}
          </div>
          <div className="flex gap-1 w-full justify-center">
          {/* First and Previous Buttons */}
          <button
            onClick={() => fetchProducts(1)}
            disabled={currentPage === 1}
            className="duration-200 font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white rounded disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => fetchProducts(currentPage - 1)}
            disabled={currentPage === 1}
            className="duration-200 font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white rounded disabled:opacity-50"
          >
            Previous
          </button>

          {/* Dynamic Page Numbers */}
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => fetchProducts(page)}
              className={`font-bold px-3 py-1 rounded cursor-pointer ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-blue-500 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next and Last Buttons */}
          <button
            onClick={() => fetchProducts(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="duration-200 font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => fetchProducts(lastPage)}
            disabled={currentPage === lastPage}
            className="duration-200 font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white rounded disabled:opacity-50"
          >
            Last
          </button>
          </div>
        </div>
      );
  };

    
// Newly Added
  const [isRestockMode, setIsRestockMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [isReorderFilterEnabled, setIsReorderFilterEnabled] = useState(false);

  const submitRestocks = async () => {
    try {
      const restocks = Object.entries(selectedProducts)
        .filter(([_, product]) => product.quantity > 0) // Only products with a valid quantity
        .map(([productId, product]) => ({
          product_id: productId,
          quantity: product.quantity,
        }));
  
      if (restocks.length === 0) {
        alert("No products selected for restock.");
        return;
      }
  
      // Make an API call to submit the restocks
      await axios.post(`${url}/api/products/restock`, { restocks });
  
      alert("Restocks successfully submitted!");
      setSelectedProducts({}); // Clear selected products
      setShowRestockModal(false); // Close the modal
      fetchProducts(pagination.currentPage); // Refresh the product list
    } catch (error) {
      console.error("Error submitting restocks:", error);
      alert("Failed to submit restocks. Please try again.");
    }
  };

  useEffect(() => {
    console.log("Reorder filter enabled:", isReorderFilterEnabled);
    console.log("Filtered items:", items);
  }, [items, isReorderFilterEnabled]);
  
  useEffect(() => {
    if (showRestockModal) {
        console.log("Selected Products:", selectedProducts);
    }
  }, [showRestockModal]);


  const handleReorderToggle = () => {
    setIsReorderFilterEnabled((prev) => !prev); // Toggle the filter
    fetchProducts(1, !isReorderFilterEnabled); // Pass the updated filter state
  };
  
  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <QuickButtons />
      <div className="flex flex-col w-full bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-lg shadow-gray-400 mb-6">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM PRODUCT</h2>
        </div>
        <div className="w-4/5 mx-auto bg-white p-3 m-3 rounded-lg shadow-lg shadow-gray-400">
          {/* Searchbar and Filters */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row items-center w-full px-2 py-2 mr-1 border border-gray-300 rounded-md shadow-md focus-within:border-blue-500 relative h-12">
              <span className="font-bold text-black-500 whitespace-nowrap">
                PRODUCT
              </span>
              <div className="border-l border-gray-300 h-10 mx-2"></div>
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search for items"
                className="flex-grow focus:outline-none px-4 py-2 rounded-md sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
              />
            </div>
            <div className="flex flex-row items-center justify-end px-2 py-2">
              <button
                className="w-40 r-4 px-4 py-2 bg-blue-500 text-white hover:bg-white hover:text-blue-500 shadow-md duration-200 rounded-lg font-bold"
                onClick={() => setShowAddProductModal(true)}
              >
                <h1 className="text-center text-md">Add Product</h1>
              </button>
            </div>
          </div>
          {/* Searchbar and Filters */}

          {/* Category Filter */}
          <div className="mt-4 flex justify-between items-center ">
            <div className="">
              <div className="flex items-center ">
                <div 
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="cursor-pointer relative flex p-2 hover:bg-blue-500 hover:text-white shadow-md duration-200 rounded-full justify-center items-center"
                >
                  <h1 className=" text-xs font-bold">
                    Category 
                  </h1>
                  <MdExpandMore/>
                </div>
                  <div
                    className={`ml-1 cursor-pointer relative flex p-2 ${
                      isReorderFilterEnabled ? "bg-blue-500 text-white" : "bg-white text-black"
                    } hover:bg-blue-500 hover:text-white shadow-md duration-200 rounded-full justify-center items-center`}
                    onClick={() => {
                      setIsReorderFilterEnabled((prev) => !prev); // Toggle reorder filter
                      setPagination((prev) => ({ ...prev, currentPage: 1 }));
                      fetchProducts(1, !isReorderFilterEnabled); // Pass updated filter state
                    }}
                  >
                    <h1 className="text-xs font-bold">Reorder</h1>
                  </div>
                  <div
                  className={` p-2  cursor-pointer ${
                    isRestockMode ? "bg-red-500 " : "bg-green-500"
                  } text-white hover:bg-white hover:text-green-500 shadow-md duration-200 rounded-full  font-bold ml-2`}
                  onClick={() => setIsRestockMode((prev) => !prev)} // Toggle Restock Mode
                >
                  <h1 className="text-xs font-bold">
                    {isRestockMode ? "Exit Restock" : "Restock"}
                  </h1>
                </div>
              </div>
              {isFilterOpen && (
                <div className="absolute mt-2 bg-white border rounded-lg shadow-lg z-10 w-48">
                  <div className="p-2">
                    <div className="font-bold mb-2">Category Filter</div>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center hover:bg-blue-500 hover:text-white duration-200 rounded space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.category_name)}
                            onChange={() => handleCategoryToggle(category.category_name)}
                          />
                          <span>{category.category_name}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      className="w-full mt-4 px-4 py-2 hover:bg-blue-500 hover:text-white border font-bold rounded-lg"
                      onClick={() => setSelectedCategories([])}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex">
              <button
                className="px-4 py-2 bg-blue-500 text-white  hover:bg-white hover:text-blue-500 shadow-md duration-200 rounded-lg font-bold"
                onClick={() => navigate("/products/reorder")}
                >
                View Reorder Level
              </button>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="w-4/5 mx-auto p-5 m-3 rounded-lg bg-white shadow-lg shadow-gray-400">
            {loading ? (
              <div className="flex justify-center">
                <p>Loading...</p>
                <div className="spinner"></div>
              </div>
            ) : items.length > 0 ? (
              <>
                {/* Table Headers */}
                <div className="grid grid-cols-10 text-sm font-bold border-b py-2">
                  {isRestockMode && (
                    <div className="col-span-1 flex items-center justify-center space-x-2">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setSelectedProducts((prev) => {
                            if (isChecked) {
                              // Select all products
                              const allProducts = {};
                              items.forEach((item) => {
                                allProducts[item.product_id] = { ...item, quantity: 0 }; // Default quantity
                              });
                              return allProducts;
                            } else {
                              // Deselect all
                              return {};
                            }
                          });
                        }}
                        checked={Object.keys(selectedProducts).length === items.length && items.length > 0} // Check if all are selected
                      />
                      <h1 className="text-sm">Select All</h1>
                    </div>
                  )}
                  <div className="col-span-1 text-left">Product ID</div>
                  <div className="col-span-3 text-left">Product Name</div>
                  <div className="col-span-3 text-left">Category</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">In Stock</div>
                  {!isRestockMode && (
                    <div className="text-center">Actions</div>
                  )}
                </div>

                {(isReorderFilterEnabled
                  ? items.filter((item) => item.needs_reorder)
                  : items
                ).map((item) => (
                  <div
                    key={item.product_id}
                    className={`grid text-sm grid-cols-10 shadow-md border duration-100 rounded my-2 border-gray-300 p-2 items-center ${
                      item.needs_reorder ? "bg-red-200 hover:bg-red-400" : "hover:bg-blue-100"
                    }`}
                  >
                    {isRestockMode && (
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600"
                          checked={!!selectedProducts[item.product_id]} // Check if the product is selected
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setSelectedProducts((prev) => {
                                const updated = { ...prev };
                                if (isChecked) {
                                    updated[item.product_id] = { ...item, quantity: item.quantity || 0 }; // Ensure quantity is included
                                } else {
                                    delete updated[item.product_id];
                                }
                                return updated;
                            });
                          }}
                        />
                      </div>
                    )}
                    <div className="col-span-1 text-left">{item.product_id}</div>
                    <div className="col-span-3 text-left">{item.product_name}</div>
                    <div className="col-span-3 text-left">{item.category_name}</div>
                    <div className="text-center">₱ {item.original_price}</div>
                    <div className="text-center">{item.quantity}</div>
                    {!isRestockMode && (
                      <div className="relative flex justify-center">
                        <button
                          className="px-2 py-1 bg-gray-400 hover:bg-gray-700 duration-200 text-white font-bold rounded-lg"
                          onClick={() => toggleDropdown(item.product_id)}
                        >
                          <IoMdMore />
                        </button>
                        {openDropdowns[item.product_id] && (
                          <div className="absolute dropdown-menu left-24 top-0 w-40 bg-white border rounded-lg shadow-lg z-10">
                            <ul>
                              <li
                                className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer font-bold"
                                onClick={() => navigate(`/products/${item.product_id}/details`)}
                              >
                                Details
                              </li>
                              <li
                                className="px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer font-bold"
                                onClick={() => handleEditClick(item)}
                              >
                                Edit
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {renderPagination()}
              </>
            ) : (
              <div>No products found.</div>
            )}
          {isRestockMode && (
            <div className="flex justify-end mt-4">
            <button
              className={`px-4 py-2 ${
                Object.keys(selectedProducts).length > 0
                  ? "bg-green-500 text-white hover:bg-white hover:text-green-500"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } shadow-md duration-200 rounded-lg font-bold`}
              disabled={Object.keys(selectedProducts).length === 0}
              onClick={() => setShowRestockModal(true)}
            >
              Confirm Restock
            </button>
            </div>
          )}
        </div>
        {/* Modals */}
        {showAddProductModal && (
          <AddProductModal
            onClose={() => setShowAddProductModal(false)}
            fetchProducts={() => fetchProducts(pagination.currentPage)}
          />
        )}
        {showRestockModal && Object.keys(selectedProducts).length > 0 && (
            <RestockModal
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts} // you may want to pass this too
              onClose={() => setShowRestockModal(false)}
              onRestockSuccess={() => fetchProducts(pagination.currentPage)}
            />
        )}
        {showEditProductModal && editProduct && (
          <EditProductModal
            item={editProduct}
            onClose={() => setShowEditProductModal(false)}
            onEditSuccess={() => fetchProducts(pagination.currentPage)}
          />
        )}
      </div>
    </div>
  );
}

export default Product;
