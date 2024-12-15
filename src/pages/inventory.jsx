import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import AddProductModal from "./inventory/modal/AddProductModal";
import RestockModal from "./inventory/modal/RestockModal";
import EditProductModal from "./inventory/modal/EditProductModal";
import QuickButtons from "../components/quickButtons";
import { useNavigate } from "react-router-dom";

function Inventory() {
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
  const [showRestockModal, setShowRestockModal] = useState(false);
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

  // Fetch products
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/products`, {
        params: {
          page,
          categories: selectedCategories.length > 0 ? selectedCategories.join(",") : null,
          search: searchInput,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });

      setItems(response.data.products || []);
      setTotalAssets(response.data.totalValue || 0);
      setPagination(response.data.pagination || { currentPage: 1, lastPage: 1 });
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

  const handleEditClick = (product) => {
    setEditProduct({ ...product, category_name: product.category_name });
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

  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <QuickButtons />
      <div className="flex flex-col w-full bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-lg shadow-gray-400 mb-6">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM INVENTORY</h2>
        </div>

        {/* Searchbar and Filters */}
        <div className="w-4/5 mx-auto bg-white p-3 m-3 rounded-lg shadow-lg shadow-gray-400">
          <div className="flex flex-row">
            <div className="flex flex-row items-center w-full px-2 py-2 mr-1 border border-gray-300 rounded-md shadow-md focus-within:border-blue-500 relative h-12">
              <span className="font-bold text-black-500 whitespace-nowrap">
                INVENTORY
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
            <button
              className="w-40 r-4 px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 rounded-lg font-bold"
              onClick={() => setShowAddProductModal(true)}
            >
              <h1 className="text-center text-md">Add Product</h1>
            </button>
          </div>

          {/* Category Filter */}
          <div className="mt-4">
            <div className="relative">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg font-bold"
                onClick={() => setIsFilterOpen((prev) => !prev)}
              >
                Filter by Category
              </button>
              {isFilterOpen && (
                <div className="absolute mt-2 bg-white border rounded-lg shadow-lg z-10 w-48">
                  <div className="p-2">
                    <div className="font-bold mb-2">Category Filter</div>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center space-x-2 cursor-pointer"
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
                      className="w-full mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply Filters
                    </button>
                    {/* <button
                      className="ml-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <div className="w-4/5 mx-auto p-5 m-3 rounded-lg bg-white shadow-lg shadow-gray-400">
          {loading ? (
            <div className="spinner text-center"></div>
          ) : items.length > 0 ? (
            <>
              {/* Table Headers */}
              <div className="grid grid-cols-8 text-sm font-bold border-b py-2">
                <div
                  className="col-span-1 cursor-pointer"
                  onClick={() => handleSortByColumn("product_id")}
                >
                  Product ID {sortBy === "product_id" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
                <div className="col-span-2">Product Name</div>
                <div className="col-span-2">Category</div>
                <div>Price</div>
                <div
                  className="cursor-pointer flex items-center"
                  onClick={() => handleSortByColumn("quantity")}
                >
                  Quantity {sortBy === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}
                </div>
                <div>Actions</div>
              </div>
              {/* Table Rows */}
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="grid text-sm grid-cols-8 shadow-md shadow-gray-400 hover:bg-blue-50 rounded my-1 border-gray-300 p-1 items-center"
                >
                  <div className="col-span-1">{item.product_id}</div>
                  <div className="col-span-2">{item.product_name}</div>
                  <div className="col-span-2">{item.category_name}</div>
                  <div>₱ {item.original_price}</div>
                  <div>{item.quantity}</div>
                  <div className="relative">
                    {/* Dropdown Button */}
                    <button
                      className="px-2 py-1 bg-blue-500 text-white font-bold rounded-lg"
                      onClick={() => toggleDropdown(item.product_id)}
                    >
                      More
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdowns[item.product_id] && (
                      <div className="absolute dropdown-menu right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                        <ul>
                          <li
                            className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer font-bold"
                            onClick={() => handleRestockClick(item)}
                          >
                            Restock
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer font-bold"
                            onClick={() => navigate(`/inventory/product/${item.product_id}/details`)}
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
                </div>
              ))}

            </>
          ) : (
            <div>No products found.</div>
          )}
        </div>

        {/* Modals */}
        {showAddProductModal && (
          <AddProductModal
            onClose={() => setShowAddProductModal(false)}
            fetchProducts={() => fetchProducts(pagination.currentPage)}
          />
        )}
        {showRestockModal && restockProduct && (
          <RestockModal
            productId={restockProduct.id}
            productName={restockProduct.name}
            onClose={() => setShowRestockModal(false)}
            onRestockSuccess={() => fetchProducts(pagination.currentPage)}
          />
        )}
        {showEditProductModal && editProduct && (
          <EditProductModal
            product={editProduct}
            onClose={() => setShowEditProductModal(false)}
            onEditSuccess={() => fetchProducts(pagination.currentPage)}
          />
        )}
      </div>
    </div>
  );
}

export default Inventory;
