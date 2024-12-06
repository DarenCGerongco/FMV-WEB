import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import AddProductModal from "./inventory/modal/AddProductModal";
import RestockModal from "./inventory/modal/RestockModal";
import QuickButtons from "../components/quickButtons";

function Inventory() {
  const url = import.meta.env.VITE_API_URL;

  // State management
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
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
          categories: selectedCategories,
        },
      });
      const fetchedItems = response.data.products || [];
      setItems(fetchedItems);
      setFilteredItems(fetchedItems); // Initialize filtered items
      setTotalAssets(response.data.totalValue);
      setPagination(response.data.pagination || { currentPage: 1, lastPage: 1 });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchCategories();
    fetchProducts(pagination.currentPage);
  }, [pagination.currentPage, selectedCategories]);

  // Handle search input
  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    // Live search functionality
    const filtered = items.filter((item) =>
      item.product_name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  // Handle category selection toggle
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle Restock button click
  const handleRestockClick = (product) => {
    setRestockProduct({
      id: product.product_id,
      name: product.product_name,
    });
    setShowRestockModal(true);
  };

  return (
    <div className="flex w-full bg-white">
      <Navbar/>
      <QuickButtons/>
      <div className="flex flex-col w-full bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg  shadow-lg shadow-gray-400 mb-6 ">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM INVENTORY</h2>
        </div>

        {/* Searchbar and Filters */}
        <div className="w-4/5 mx-auto bg-white p-3 m-3 rounded-lg  shadow-lg shadow-gray-400">
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
              className="w-40 r-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 rounded-lg"
              onClick={() => setShowAddProductModal(true)}
            >
              <h1 className="text-center text-md">
                Add Product
              </h1>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-bold my-auto text-xs text-blue-500">
              Filter:
            </span>
            <button
              className={`px-2 text-xs py-1 rounded-md shadow-md font-bold ${
                selectedCategories.length === 0
                  ? "bg-white text-blue-500 hover:bg-blue-500 hover:text-white duration-200"
                  : "bg-blue-500 text-white hover:bg-white hover:text-blue-500 duration-200"
              }`}
              onClick={clearFilters}
            >
              All Categories
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-2 text-xs py-1 rounded-md shadow-md font-bold ${
                  selectedCategories.includes(category.category_name)
                    ? "bg-white text-blue-500 hover:bg-blue-500 hover:text-white duration-200"
                    : "bg-blue-500 text-white hover:bg-white hover:text-blue-500 duration-200"
                }`}
                onClick={() => handleCategoryToggle(category.category_name)}
              >
                {category.category_name}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <span className="font-bold text-xs text-blue-500">Selected: </span>
            {selectedCategories.length > 0 ? (
              selectedCategories.map((category, index) => (
                <span
                  key={index}
                  className="px-2 text-xs py-1 rounded-md bg-blue-500 text-white font-semibold mr-2 shadow-sm"
                >
                  {category}
                </span>
              ))
            ) : (
              <span className="px-2 text-xs py-1 rounded-md bg-blue-500 text-white font-semibold mr-2 shadow-sm">
                All Categories
              </span>
            )}
          </div>
        </div>

        {/* <div className="flex flex-col ml-[10%] bg-white">
          <div className="w-[12rem] font-bold h-[10rem] text-black hover:bg-green-400 duration-200 rounded-lg p-2 bg-blue-500 flex flex-col shadow-md justify-center items-center">
            <span className="text-sm font-bold text-white mt-2 ">
              Total Value of Assets:
            </span>
            <span className="text-2xl font-bold text-white mt-2">
              ₱{totalAssets}
            </span>
          </div>
        </div> */}

        {/* Inventory List */}
        <div className="w-4/5 mx-auto p-5 m-3 rounded-lg bg-white shadow-lg shadow-gray-400">
          {loading ? (
            <div className="spinner text-center"></div>
          ) : (
            <>
              {/* Header */}
              <div className="grid grid-cols-8 text-sm font-bold border-b py-2">
                <div className="col-span-1">Product ID</div>
                <div className="col-span-2">Product Name</div>
                <div className="col-span-2">Category</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Actions</div>
              </div>

              {/* Items */}
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  className={` grid text-sm grid-cols-8 shadow-lg shadow-gray-400 ${
                    item.quantity <= 100
                      ? "bg-[#C6C6C6] text-white shadow-md"
                      : "hover:bg-blue-50 shadow-md"
                  } rounded my-1 border-gray-300 p-1 items-center`}
                >
                  <div className="col-span-1">{item.product_id}</div>
                  <div className="col-span-2">{item.product_name}</div>
                  <div className="col-span-2">{item.category_name}</div>
                  <div>₱ {item.original_price}</div>
                  <div>{item.quantity}</div>
                  <div>
                    <button
                      className="bg-blue-500 hover:bg-white hover:text-blue-500 shadow-md duration-200 font-bold text-white px-3 py-1 rounded-md"
                      onClick={() => handleRestockClick(item)}
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Add Product Modal */}
        {showAddProductModal && (
          <AddProductModal
            onClose={() => setShowAddProductModal(false)}
            fetchProducts={() => fetchProducts(pagination.currentPage)}
          />
        )}

        {/* Restock Modal */}
        {showRestockModal && restockProduct && (
          <RestockModal
            productId={restockProduct.id}
            productName={restockProduct.name}
            onClose={() => setShowRestockModal(false)}
            onRestockSuccess={() => fetchProducts(pagination.currentPage)}
          />
        )}


        {/* Pagination */}
        <div className="flex justify-center w-full space-x-2 my-10">
          <button
            onClick={() => setPagination((prev) => ({ ...prev, currentPage: 1 }))}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 hover:bg-white hover:text-blue-500 duration-200 font-bold bg-blue-500 text-white rounded disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: pagination.currentPage - 1,
              }))
            }
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 hover:bg-white hover:text-blue-500 duration-200 font-bold bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(pagination.lastPage)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, currentPage: i + 1 }))
              }
              className={`px-3 py-1 rounded ${
                pagination.currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: pagination.currentPage + 1,
              }))
            }
            disabled={pagination.currentPage === pagination.lastPage}
            className="px-3 py-1 hover:bg-white hover:text-blue-500 duration-200 font-bold bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: pagination.lastPage,
              }))
            }
            disabled={pagination.currentPage === pagination.lastPage}
            className="px-3 py-1 hover:bg-white hover:text-blue-500 duration-200 font-bold bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
