import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import AddProductModal from "./inventory/modal/AddProductModal";
import RestockModal from "./inventory/modal/RestockModal";
import EditProductModal from "./inventory/modal/EditProductModal";
import QuickButtons from "../components/quickButtons";

function Inventory() {
  const url = import.meta.env.VITE_API_URL;

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

  const [sortBy, setSortBy] = useState("product_id"); // Default sorting column
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  
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
          search: searchInput,
          sort_by: sortBy, // Use state to determine sorting column
          sort_order: sortOrder, // Use state to determine sorting order
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

  // Search handling
  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchProducts(1); // Always fetch from the first page
  };

  // Handle category toggle
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
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
              className="w-40 r-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 rounded-lg font-bold"
              onClick={() => setShowAddProductModal(true)}
            >
              <h1 className="text-center text-md">Add Product</h1>
            </button>
          </div>
        </div>

        {/* Inventory List */}
        <div className="w-4/5 mx-auto p-5 m-3 rounded-lg bg-white shadow-lg shadow-gray-400">
          {loading ? (
            <div className="spinner text-center"></div>
          ) : items.length > 0 ? (
            <>
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
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`grid text-sm grid-cols-8 shadow-lg shadow-gray-400 ${
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
                  <div className="flex gap-x-1">
                    <button
                      className="bg-blue-500 text-white hover:bg-blue-700 rounded-lg px-3 py-1"
                      onClick={() => handleRestockClick(item)}
                    >
                      Restock
                    </button>
                    <button
                      className="bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-transparent px-3 py-1 rounded-md"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div>No products found.</div>
          )}
        </div>

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
          {/* Dynamic Pagination */}
          {(() => {
            const totalPages = pagination.lastPage;
            const currentPage = pagination.currentPage;
            const maxVisiblePages = 10;
            const pageButtons = [];

            const startPage = Math.max(
              1,
              currentPage - Math.floor(maxVisiblePages / 2)
            );
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);

            if (adjustedStartPage > 1) {
              pageButtons.push(
                <span key="start-ellipsis" className="px-3 py-1">
                  ...
                </span>
              );
            }

            for (let i = adjustedStartPage; i <= endPage; i++) {
              pageButtons.push(
                <button
                  key={i}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, currentPage: i }))
                  }
                  className={`px-3 py-1 rounded ${
                    pagination.currentPage === i
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {i}
                </button>
              );
            }

            if (endPage < totalPages) {
              pageButtons.push(
                <span key="end-ellipsis" className="px-3 py-1">
                  ...
                </span>
              );
            }

            return pageButtons;
          })()}
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
