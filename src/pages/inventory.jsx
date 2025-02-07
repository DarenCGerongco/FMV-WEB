import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import QuickButtons from '../components/quickButtons';
import axios from 'axios';
import { MdExpandMore } from "react-icons/md";
import DatePicker from "react-datepicker";
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

  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  const fetchDataLabel = ["Product ID", "Product Name", "Category", "Date in (m/d/y)", "Date out (m/d/y)", "Quantity", "Transaction Type", "Total Value"];

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${url}/api/view/inventory/transactions`, {
        params: {
          date_from: dateFrom ? dateFrom.toISOString().split('T')[0] : null,
          date_to: dateTo ? dateTo.toISOString().split('T')[0] : null,
        },
      });
  
      // ✅ Correct way to access transactions data
      const transactions = response.data.transactions.data;
      
      console.log("Transactions fetched:", transactions);
      setTransactions(transactions);
      
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  
  

  useEffect(() => {
    fetchTransactions();
  }, [dateFrom, dateTo]);

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

          <div className="flex items-center justify-between p-2">
            <div className="flex">
              <div className="cursor-pointer relative flex p-2 hover:bg-blue-500 hover:text-white shadow-md duration-200 rounded-full justify-center items-center mt-4">
                <h1 className=" text-xs font-bold">Category</h1>
                <MdExpandMore />
              </div>
            </div>

            <div className="flex items-center">
              <div className="cursor-pointer relative flex p-2 hover:bg-blue-500 hover:text-white shadow-md duration-200 rounded-full justify-center items-center mt-4">
                <h1 className=" text-xs font-bold">Date</h1>
                <MdExpandMore />
              </div>
              <div className="px-2 mt-4">|</div>

              <div className="flex items-center mt-4 mr-16">
                <h1 className="text-xs mr-2 font-bold">Date from:</h1>
                <DatePicker
                  selected={dateFrom}
                  onChange={(date) => setDateFrom(date)}
                  className="px-2 py-1 border border-gray-300 rounded-md"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select Date"
                />
                <h1 className="text-xs mx-2 font-bold">Date to:</h1>
                <DatePicker
                  selected={dateTo}
                  onChange={(date) => setDateTo(date)}
                  className="px-2 py-1 border border-gray-300 rounded-md"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select Date"
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
