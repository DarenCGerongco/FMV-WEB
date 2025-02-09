import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import QuickButtons from '../components/quickButtons';
import axios from 'axios';
import { MdExpandMore } from "react-icons/md";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const Inventory = () => {
  const url = import.meta.env.VITE_API_URL;
  const [inventoryData, setInventoryData] = useState([]);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

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

  const navigate = useNavigate();

  const handleTransactionTypeToggle = (type) => {
    setSelectedTransactionTypes((prev) => {
      if (type === "All") return ["All"]; // If "All" is selected, clear all other selections
      if (prev.includes(type)) return prev.filter((t) => t !== type); // Remove if already selected
      return prev.filter((t) => t !== "All").concat(type); // Add type & remove "All" if selected
    });
  };

  const fetchDataLabel = ["Product ID", "Product Name", "Category", "Date in (m/d/y)", "Date out (m/d/y)", "Quantity", "Transaction Type", "Total Value"];
  
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${url}/api/view/inventory/transactions`, {
        params: {
          date_from: dateFrom ? moment(dateFrom).format('YYYY-MM-DD') : null,
          date_to: dateTo ? moment(dateTo).format('YYYY-MM-DD') : null,
          transaction_types: selectedTransactionTypes.includes("All") ? null : selectedTransactionTypes,
        },
      });
  
      setTransactions(response.data.transactions.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
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
    fetchTransactions();
    fetchCategories();
  }, [dateFrom, dateTo, selectedCategories, selectedTransactionTypes]);

  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <QuickButtons />
      <div className="w-full bg-white-100">
        <div className="w-4/5 flex justify-between mx-auto p-6 mt-3 rounded-lg bg-white shadow-lg shadow-gray-400 mb-6">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM INVENTORY</h2>
          <h3 className="font-bold">
            {month}, {day} {weekday} {year}
          </h3>
        </div>

        <div className="w-4/5 mx-auto bg-white p-3 m-3 rounded-lg shadow-lg shadow-gray-400">
          <div className="flex flex-row items-center w-full px-2 py-2 mr-1 border border-gray-300 rounded-md shadow-md focus-within:border-blue-500 relative h-12">
            <span className="font-bold text-black-500 whitespace-nowrap">
              INVENTORY
            </span>
            <div className="border-l border-gray-300 h-10 mx-2"></div>
            <input
              type="text"
              placeholder="Search for items"
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
                <h1 className="text-xs mr-2 font-bold">from:</h1>
                <DatePicker
                  selected={dateFrom}
                  onChange={(date) => setDateFrom(date)}
                  className="px-1 py-1 border border-gray-300 rounded-md"
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select Date"
                />
                <h1 className="text-xs mx-2 font-bold">to:</h1>
                <DatePicker
                  selected={dateTo}
                  onChange={(date) => setDateTo(date)}
                  className="px-2 py-1 border border-gray-300 rounded-md"
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select Date"
                  minDate={dateFrom} // Restrict "To" date to be after "From" date
                />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Data Table */}
        <div className="w-4/5 mx-auto bg-white rounded-lg shadow-lg shadow-gray-400">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-300">
                {fetchDataLabel.map((label, index) => (
                  <th key={index} className="text-left text-sm px-2 py-2 font-bold ">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((item, index) => (
                  <tr key={index} className="border-b text-xs border-gray-200 hover:bg-gray-50">
                    <td className="px-3 py-3">{item.product_id}</td>
                    <td className="px-3">{item.product_name}</td>
                    <td className="px-3">{item.category_name}</td>
                    <td className="px-3">{item.date_in}</td>
                    <td className="px-3">{item.date_out}</td>
                    <td className="px-3">{item.quantity}</td>
                    <td className="px-3">{item.transaction_type}</td>
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
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;