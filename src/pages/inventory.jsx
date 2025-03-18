import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import QuickButtons from '../components/quickButtons';
import axios from 'axios';
import { MdExpandMore } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci"; // Import the delivery truck icon
import { GiWalkingBoot } from "react-icons/gi"; // Import the walking boot icon
import { BiRefresh } from "react-icons/bi"; // Import the refresh icon
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { RiResetLeftLine } from "react-icons/ri";
import TransactionModal from "./inventory/TransactionModal"; // Import the modal component

const Inventory = () => {
  const url = import.meta.env.VITE_API_URL;
  const [inventoryData, setInventoryData] = useState([]);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [searchType, setSearchType] = useState("product");

  const currentDate = new Date();
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const weekday = currentDate.toLocaleString("default", { weekday: "long" });

  const [isFilterOpenCategory, setIsFilterOpenCategory] = useState(false);
  const [isFilterOpenTransactionType, setIsFilterOpenTransactionType] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Initialize selectedTransactionTypes as an array
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState(["All"]);
  const transactionTypes = ["All", "Delivery", "Walk-In", "Restock"];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // You can change this value to set the number of items per page
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false); // Loading state
  const [searchTerm, setSearchTerm] = useState(''); // Search term state

  const navigate = useNavigate();
  const debounceTimeout = useRef(null); // Ref to store the debounce timeout

  const handleTransactionTypeToggle = (type) => {
    setSelectedTransactionTypes((prev) => {
      if (type === "All") return ["All"]; // If "All" is selected, clear all other selections
      if (prev.includes(type)) return prev.filter((t) => t !== type); // Remove if already selected
      return prev.filter((t) => t !== "All").concat(type); // Add type & remove "All" if selected
    });
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) return prev.filter((c) => c !== category); // Remove if already selected
      return [...prev, category]; // Add category if not already selected
    });
  };

  const fetchDataLabel = ["Product ID", "Product Name", "Category", "Date in (m/d/y)", "Date out (m/d/y)", "Quantity", "Transaction Type", "Total Value"];
  
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      console.log("Fetching transactions with filters:", {
        date_from: dateFrom ? moment(dateFrom).format('YYYY-MM-DD') : null,
        date_to: dateTo ? moment(dateTo).format('YYYY-MM-DD') : null,
        transaction_types: selectedTransactionTypes.includes("All") ? null : selectedTransactionTypes,
        categories: selectedCategories.length > 0 ? selectedCategories : null,
        page: currentPage,
        per_page: itemsPerPage,
        search: searchTerm,
        search_type: searchType, // ✅ Send search type to backend
      });
  
      const response = await axios.get(`${url}/api/view/inventory/transactions`, {
        params: {
          date_from: dateFrom ? moment(dateFrom).format('YYYY-MM-DD') : null,
          date_to: dateTo ? moment(dateTo).format('YYYY-MM-DD') : null,
          transaction_types: selectedTransactionTypes.includes("All") ? null : selectedTransactionTypes,
          categories: selectedCategories.length > 0 ? selectedCategories : null,
          page: currentPage,
          per_page: itemsPerPage,
          search: searchTerm,
          search_type: searchType, // ✅ Send search type (Product or Category)
        },
      });
  
      console.log("Transactions fetched:", response.data.transactions.data);
      setTransactions(response.data.transactions.data);
      setTotalPages(response.data.transactions.pagination.lastPage);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/categories`);
      console.log("Categories fetched:", response.data.data);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories(); // Fetch categories first
      fetchTransactions(); // Fetch transactions after categories are available
    };
    
    fetchData();
  }, [dateFrom, dateTo, selectedCategories, selectedTransactionTypes, currentPage]);

  useEffect(() => {
    // Reset pagination when search term or search type changes
    setCurrentPage(1); // ✅ Reset to page 1 before searching
  
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  
    debounceTimeout.current = setTimeout(() => {
      fetchTransactions();
    }, 500);
  
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchTerm, searchType]); // ✅ Added `searchType` as a dependency
  

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setDateFrom(null);
    setDateTo(null);
    setSelectedCategories([]);
    setSelectedTransactionTypes(["All"]);
    setSearchTerm('');
    setCurrentPage(1);
    fetchTransactions(); // Re-fetch with default filters
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 15;
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <button
        key={number}
        className={`px-4 py-2 hover:bg-blue-500 hover:text-white duration-200 font-bold mx-1 border rounded-md  ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </button>
    ));
  };

  const [filteredCategories, setFilteredCategories] = useState([]); // Store filtered results
  const [categoryInput, setCategoryInput] = useState(""); // Store search input

  // Function to filter categories based on user input
  const handleCategorySearch = (input) => {
    setCategoryInput(input);
    if (input.trim() === "") {
      setFilteredCategories([]); // Clear suggestions if input is empty
      return;
    }

    // Filter categories based on input
    const filtered = categories.filter(category =>
      category.category_name.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredCategories(filtered);
  };


  const [selectedTransaction, setSelectedTransaction] = useState(null); // Store selected transaction
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state


  // Function to select category from dropdown
  const selectCategory = (category) => {
    setSelectedCategories([category]); // Select category
    setCategoryInput(category); // Update input value
    setFilteredCategories([]); // Hide dropdown
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true); // Open modal when a transaction is clicked
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "Delivery":
        return <CiDeliveryTruck className="inline-block mr-1 text-blue-500" />;
      case "Walk-In":
        return <GiWalkingBoot className="inline-block mr-1 text-green-500" />;
      case "Restock":
        return <BiRefresh className="inline-block mr-1 text-yellow-500" />;
      default:
        return null;
    }
  };


  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <QuickButtons />
      <div className="w-full bg-white-100 mb-5 ">
        <div className="w-4/5 flex justify-between mx-auto p-6 mt-3 rounded-lg bg-white shadow-lg shadow-gray-400 mb-6">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM INVENTORY</h2>
          <h3 className="font-bold">
            {month}, {day} {weekday} {year}
          </h3>
        </div>

        <div className="w-4/5 mx-auto bg-white p-3 m-3 rounded-lg shadow-lg shadow-gray-400">
          <div className="flex flex-row items-center w-full px-2 py-2 mr-1 border border-gray-300 rounded-md shadow-md focus-within:border-blue-500 relative h-12">
            <div className="font-bold text-black-500 whitespace-nowrap">INVENTORY</div>
            <div className="border-l border-gray-300 h-10 mx-2 "></div>

            {/* Search Type Dropdown */}
            <select
              className="font-bold py-2 bg-blue-500 text-white rounded-md focus:border-white"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="product">Product</option>
              <option value="category">Category</option>
            </select>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search for items"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow focus:outline-none px-4 py-2 rounded-md sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
            />
          </div>


          <div className="flex items-center justify-between p-1">
            <div className="flex items-center justify-between space-x-1">
              {/* Category Filter Button */}
              <div className="relative">
                <div 
                  onClick={() => setIsFilterOpenCategory(prev => !prev)} 
                  className="cursor-pointer flex p-2 hover:bg-blue-500 hover:text-white shadow-md duration-200 rounded-full justify-center items-center mt-4"
                >
                  <h1 className="text-xs font-bold">Category</h1>
                  <MdExpandMore />
                </div>

                {/* Category Dropdown */}
                {isFilterOpenCategory && (
                  <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 w-48">
                    <div className="p-2">
                      <div className="font-bold mb-2">Category Filter</div>
                      <div className="space-y-1">
                        {categories.map((category) => (
                          <label 
                            key={category.id} 
                            className="flex items-center hover:bg-blue-500 hover:text-white duration-200 rounded space-x-2 cursor-pointer p-1"
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
                        className="w-full mt-4 px-4 py-2 hover:bg-blue-500 duration-200 hover:text-white border font-bold rounded-lg"
                        onClick={() => setSelectedCategories([])}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Transaction Type Filter */}
              <div className="relative">
                <div 
                  onClick={() => setIsFilterOpenTransactionType((prev) => !prev)}
                  className="cursor-pointer flex px-4 py-2 hover:bg-blue-500 hover:text-white shadow-md duration-200 mt-4 rounded-full justify-center items-center"
                >
                  <h1 className="text-xs font-bold">Transaction</h1>
                  <MdExpandMore />
                </div>
                {/* Dropdown */}
                {isFilterOpenTransactionType && (
                  <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 w-48">
                    <div className="p-2">
                      <div className="font-bold mb-2">Transaction Type</div>
                      <div className="space-y-1">
                        {transactionTypes.map((type) => (
                          <label key={type} className="flex items-center hover:bg-blue-500 hover:text-white duration-200 rounded space-x-2 cursor-pointer p-1">
                            <input
                              type="checkbox"
                              checked={selectedTransactionTypes.includes(type)}
                              onChange={() => handleTransactionTypeToggle(type)}
                            />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                      <button
                        className="w-full mt-4 px-4 py-2 hover:bg-blue-500 duration-200 hover:text-white border font-bold rounded-lg"
                        onClick={() => setIsFilterOpenTransactionType(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center space-x-1 mt-4">
                <h1 className='text-xs font-bold'>
                  Date
                </h1>
                <h1 className="text-xs font-bold">from:</h1>
                <DatePicker
                  selected={dateFrom}
                  onChange={(date) => setDateFrom(date)}
                  className="px-2 py-1  border border-gray-300 rounded-md"
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select Date"
                  maxDate={new Date()} // Restrict "From" date to be up to the current date
                />
                <h1 className="text-xs mx-2 font-bold">to:</h1>
                <DatePicker
                  selected={dateTo}
                  onChange={(date) => setDateTo(date)}
                  className="px-2 py-1 border border-gray-300 rounded-md"
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select Date"
                  minDate={dateFrom} // Restrict "To" date to be after "From" date
                  maxDate={new Date()} // Restrict "To" date to be up to the current date
                />
                <button
                  className="px-4 py-2 border hover:bg-blue-500 hover:text-white rounded-md text-black font-bold duration-200"
                  onClick={resetFilters} // ✅ Call the reset function when clicked
                >
                  <RiResetLeftLine />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Data Table */}
        <div className="w-4/5 mx-auto bg-white rounded-lg shadow-lg shadow-gray-400">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="spinner"></div>
              <span>Loading...</span>
            </div>
          ) : (
            <>
              <table className="w-full border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-gray-300">
                    {fetchDataLabel.map((label, index) => (
                      <th 
                        key={index} 
                        className={`px-2 py-2 text-sm font-bold ${
                          label === "Transaction Type" ? "text-center" : "text-left"
                        }`}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((item, index) => (
                      <tr 
                        key={index} 
                        className="border-b text-xs border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleTransactionClick(item)} // ✅ Handle transaction click
                      >
                        <td className="px-3 py-3">{item.product_id}</td>
                        <td className="px-3">{item.product_name}</td>
                        <td className="px-3">{item.category_name}</td>
                        <td className="px-3">{item.date_in}</td>
                        <td className="px-3">{item.date_out}</td>
                        <td className="px-3">{item.quantity}</td>
                        <td className="px-3 text-center">
                          {getTransactionIcon(item.transaction_type)}
                          {item.transaction_type}
                        </td>
                        <td className="px-3">₱ {item.total_value}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={fetchDataLabel.length} className="text-center p-4 text-gray-500">
                        No inventory data found.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Transaction Modal */}
                  {isModalOpen && (
                    <TransactionModal 
                      transaction={selectedTransaction} 
                      onClose={() => setIsModalOpen(false)} 
                    />
                  )}
              </table>
              {/* Pagination Controls */}
              <div className="flex justify-center mt-4 pb-4 duration-200">
                <button
                  className="px-4 py-2 mx-1 border rounded-md hover:bg-blue-500 hover:text-white font-bold duration-200"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {renderPageNumbers()}
                <button
                  className="px-4 py-2 mx-1 border rounded-md hover:bg-blue-500 hover:text-white font-bold duration-200"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Inventory;