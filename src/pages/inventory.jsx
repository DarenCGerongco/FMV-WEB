import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import axios from "axios";

function Inventory() {
  const url = import.meta.env.VITE_API_URL;

  // State management
  const productCategories = [
    "UPVC",
    "Pump and Motor",
    "Control Box and Controller",
    "PE fittings",
    "Trmk",
    "Fish",
    "Techno",
    "G.I Fittings",
    "Brass fittings",
    "Mechanical and STC",
    "CMI/Gibault type coupling",
    "ERA Blue Pressure main fittings"
  ];

    const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
  });
  const [loading, setLoading] = useState(false);

  // Fetch products with pagination and search
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/products`, {
        params: {
          page,
          search: searchInput,
        },
      });

      setItems(response.data.products || []);
      setPagination(response.data.pagination || { currentPage: 1, lastPage: 1 });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}/api/categories`);
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products on initial render or search/pagination changes
  useEffect(() => {
    fetchProducts(pagination.currentPage);
  }, [pagination.currentPage, searchInput]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.lastPage) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  // Add item function
  const addItem = async (newItem) => {
    try {
      const response = await axios.post(`${url}/api/products`, newItem);
      if (response.status === 201) {
        fetchProducts(); // Refresh product list
      }
    } catch (error) {
      console.error("Error adding item:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <div className="flex flex-col w-full ml-72 bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg drop-shadow-md mb-6 border">
          <h2 className="text-1xl font-bold">INVENTORY</h2>
        </div>
  
        {/* Searchbar and Buttons */}
        <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg shadow-md">
          <div className="relative mt-4 flex items-center space-x-4">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search for items"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
            <button
              onClick={() => fetchProducts()}
              className="text-white px-4 py-2 bg-blue-500 rounded-md"
            >
              Search
            </button>
          </div>
          <div className="flex space-x-1 mt-4">
            <span>
              filter:
            </span>
            {productCategories.map((category, index) => (
              <button
                key={index}
                className="text-xs px-1 font-bold bg-blue-500 text-white rounded"
                onClick={() => console.log(category)} // Handle button click
              >
                {category}
              </button>
            ))}
          </div>
        </div>
  
        {/* Inventory List */}
        {/* Inventory List */}
        <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg drop-shadow-md">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Header */}
              <div className="grid grid-cols-8 text-gray-700 font-bold border-b py-2">
                <div className="col-span-1">Product ID</div>
                <div className="col-span-2">Product Name</div>
                <div className="col-span-2">Category</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Actions</div>
              </div>

              {/* Items */}
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-8 py-1 text-gray-700 border-b items-center"
                >
                  <div className="col-span-2">{item.product_name}</div>
                  <div className="col-span-2">{item.category_name}</div>
                  <div>{item.original_price}</div>
                  <div>{item.quantity}</div>
                  <div>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md">
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(pagination.lastPage)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                pagination.currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(pagination.lastPage)}
            disabled={pagination.currentPage === pagination.lastPage}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
  

}

export default Inventory;
