import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

import TopSoldProductsModal from "../modal/TopSoldProductsModal";
import TopDamagedProductsModal from "../modal/TopDamagedProductsModal";

import { SlBadge } from "react-icons/sl";
import { FaArrowRightLong } from "react-icons/fa6";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Month = () => {
    const [monthData, setMonthData] = useState(null);
    const [dailyData, setDailyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(null);

    const [top3SoldProducts, setTop3SoldProducts] = useState([]);
    const [top3DamagedProducts, setTop3DamagedProducts] = useState([]);
    const url = import.meta.env.VITE_API_URL;

    const [topSoldModal, setTopSoldModal] = useState(false)
    const [topDamagedModal, setTopDamagedModal] = useState(false)

    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so add 1
    const currentYear = currentDate.getFullYear();

    const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate(); // Get total days in the month
    
    const fullDailyData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const existingData = dailyData.find((data) => data.day === day);
    
        return {
        day: day,
        dailyTotalSales: existingData ? parseFloat(existingData.dailyTotalSales.replace(/,/g, "")) : 0,
        dailyTotalDamageCost: existingData ? parseFloat(existingData.dailyTotalDamageCost.replace(/,/g, "")) : 0,
        };
    });

  // Generate months up to the current month
  const months = Array.from({ length: currentMonth }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"), // Ensure two digits (e.g., 01, 02)
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  const fetchMonthlyRecords = async (month) => {
    try {
        setLoading(true);
    
        const response = await axios.get(`${url}/api/Insights/View/Month-Data`, {
            params: { month, year: currentYear },
        });
    
        const chartResponse = await axios.get(`${url}/api/Insights/View/Month-Data/Chart`, {
            params: { month, year: currentYear },
        });
    
        const fetchedTop3Data = await axios.get(
            `${url}/api/Insights/View/Month-Data/Top-3-Products`,
            { params: { month, year: currentYear } }
        );

        setMonthData(response.data || {});
        setDailyData(chartResponse.data.dailyData || []);
        setTop3SoldProducts(fetchedTop3Data.data?.top_sold_products || []);
        setTop3DamagedProducts(fetchedTop3Data.data?.top_damaged_products || []);
        setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const defaultMonth = String(currentMonth).padStart(2, "0");
    setSelectedMonth(defaultMonth);
    fetchMonthlyRecords(defaultMonth);
  }, []);

  const handleMonthChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedMonth(selectedValue);
    fetchMonthlyRecords(selectedValue);
  };

  // Chart Data Configuration
  const chartData = {
    labels: fullDailyData.map((day) => `D${day.day}`),
    datasets: [
      {
        label: "Daily Sales",
        data: fullDailyData.map((day) => day.dailyTotalSales),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Damage Cost",
        data: fullDailyData.map((day) => day.dailyTotalDamageCost),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };
    
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Daily Sales and Damage Cost" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-gray-50">
      {/* Header Section */}
      <div className="my-2 flex justify-between bg-white p-4 border rounded-lg">
        <div>
          <h1 className="text-xl font-bold">Monthly Sales Insights</h1>
          <p className="text-gray-600">
            Insights for {months.find((m) => m.value === selectedMonth)?.label} {currentYear}
          </p>
        </div>
        {/* Month Dropdown */}
        <div>
          <select
            id="month-dropdown"
            value={selectedMonth || ""}
            onChange={handleMonthChange}
            className="p-2 border rounded bg-white"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Section */}
      {loading ? (
        <div className="text-center text-gray-500">
            <h1>
                Loading...
            </h1>
            <div className="spinner"></div>
        </div>
      ) : (
        <>
        <div className="flex gap-4 mb-3">
            {/* Month Total Sales */}
            <div className="hover:scale-105 duration-300 bg-white rounded-lg shadow p-4 text-center flex-1">
                <h2 className="text-md font-semibold text-gray-700">Month Total Sales</h2>
                <p className="text-md  font-bold text-blue-600">
                    PHP {monthData.monthTotalSales || "0"}
                </p>
            </div>

            {/* Total Delivered Products */}
            <div className="hover:scale-105 duration-300 bg-white rounded-lg shadow p-4 text-center flex-1">
                <h2 className="text-md  font-semibold text-gray-700">Total Delivered Products</h2>
                <p className="text-md  font-bold text-green-600">
                {monthData.totalSuccessDeliveredProduct || "0"}
                </p>
            </div>

            {/* Successful Deliveries */}
            <div className="hover:scale-105 duration-300 bg-white rounded-lg shadow p-4 text-center flex-1">
                <h2 className="text-md  font-semibold text-gray-700">Successful Deliveries</h2>
                <p className="text-md  font-bold text-purple-600">
                {monthData.successfulDeliveriesCount || "0"}
                </p>
            </div>

            {/* Damage Cost */}
            <div className="hover:scale-105 duration-300 bg-white rounded-lg shadow p-4 text-center flex-1">
                <h2 className="text-md  font-semibold text-gray-700">Total Damage Cost</h2>
                <p className="text-md  font-bold text-red-600">
                PHP {monthData.monthTotalDamageCost || "0"}
                </p>
            </div>
        </div>


          {/* Chart Section */}
        <div className=" bg-white w-full rounded-lg shadow p-4">
            {/* Full Width with Custom Height */}
            <div className="w-full" style={{ height: '18rem' }}> 
                <Bar
                data={chartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false, // Allows custom height
                    plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: "Daily Sales and Damage Cost",
                    },
                    },
                    scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                        callback: function (value) {
                            return `PHP ${value.toLocaleString()}`; // Add PHP format to Y-axis
                        },
                        },
                    },
                    x: {
                        grid: {
                        display: false, // Remove X-axis grid
                        },
                    },
                    },
                }}
                />
            </div>
        </div>
        <div className="w-full flex gap-2 mt-2">
            <div className="w-1/2 mt-2 p-4 border border-yellow-200 rounded-xl shadow-md bg-white">
                <div className="flex items-center justify-between w-full gap-2">
                    {/* Left-aligned items */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-md font-bold text-gray-700">
                            Most Sold Products as of {months.find((m) => m.value === selectedMonth)?.label}
                        </h2>
                        <SlBadge className="bg-yellow-300 rounded-full p-1 w-6 h-6" />
                    </div>

                    {/* Right-aligned button with arrow */}
                    <button 
                        onClick={() => setTopSoldModal(true)} // Corrected function call
                        className="text-blue-600 font-semibold "
                    >
                        See All
                    </button>

                    {topSoldModal && ( // Correct condition for rendering the modal
                        <TopSoldProductsModal
                            month={selectedMonth}
                            year={currentYear}
                            onClose={() => setTopSoldModal(false)} // Close the modal
                        />
                    )}

                </div>

                <div className="flex flex-col gap-4">
                    {top3SoldProducts.length > 0 ? (
                        top3SoldProducts.map((product) => (
                            <div
                                key={product.product_id}
                                className="bg-white hover:bg-blue-200 flex justify-between items-center rounded-lg shadow-md p-4 w-full  duration-300"
                            >
                            {/* Product Name */}
                            <div className="w-1/3 flex items-center">
                                {/* <SlBadge className="bg-yellow-300 rounded-full mr-1 w-4 h-4" /> */}
                                <h2 className="text-xs mr-1  font-bold  rounded ">
                                    ID{product.product_id}
                                </h2>
                                <h3 className="text-xs font-bold text-gray-800"> {product.product_name}</h3>
                            </div>

                            {/* Product Price */}
                            <div className="w-1/3 text-center">
                                <p className="text-sm text-gray-600">
                                Price:{" "}
                                <span className="font-semibold text-blue-600">PHP {product.price}</span>
                                </p>
                            </div>

                            {/* Total Sold */}
                            <div className="w-1/3 text-right">
                                <p className="text-sm text-gray-600">
                                    Total Sold:{" "}
                                <span className="font-semibold text-green-600">{product.total_sold}</span>
                                </p>
                            </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No products available.</p>
                    )}
                </div>
            </div>
            <div className="w-1/2 mt-2 p-4 border border-red-200 rounded-xl shadow-md bg-white">
                <div className="flex items-center justify-between w-full gap-2">
                    {/* Left-aligned items */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-md font-bold text-gray-700">
                            Most Damaged Products as of {months.find((m) => m.value === selectedMonth)?.label}
                        </h2>
                        <SlBadge className="bg-red-300 rounded-full p-1 w-6 h-6" />
                    </div>

                    {/* Right-aligned button with arrow */}
                    <div className="flex items-center gap-1 hover:bg-gray-300 duration-200 bg-gray-100 rounded-full p-1">
                        <button
                        onClick={() => setTopDamagedModal(true)}
                        className="text-blue-600 font-semibold"
                        >
                            See All
                        </button>
                        <FaArrowRightLong className="text-blue-600" />
                        {topDamagedModal && ( // Render the modal conditionally
                        <TopDamagedProductsModal
                            month={selectedMonth}
                            year={currentYear}
                            onClose={() => setTopDamagedModal(false)} // Close the modal
                        />
                    )}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {top3DamagedProducts.length > 0 ? (
                        top3DamagedProducts.map((product) => (
                            <div
                                key={product.product_id}
                                className="bg-white hover:bg-blue-200 flex justify-between items-center rounded-lg shadow-md p-4 w-full  duration-300"
                            >
                            {/* Product Name */}
                            <div className="w-1/3 flex items-center">
                                <h2 className="text-xs mr-1  font-bold  rounded ">
                                    ID{product.product_id}
                                </h2>
                                <h3 className="text-xs font-bold text-gray-800">{product.product_name}</h3>
                            </div>

                            {/* Product Price */}
                            <div className="w-1/3 text-center">
                                <p className="text-sm text-gray-600">
                                Price:{" "}
                                <span className="font-bold text-blue-600">PHP {product.price}</span>
                                </p>
                            </div>

                            {/* Total Sold */}
                            <div className="w-1/3 text-right">
                                <p className="text-sm text-gray-600">
                                    Total Damage(s):{" "}
                                <span className="font-bold text-green-600">{product.total_damages}</span>
                                </p>
                            </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No products available.</p>
                    )}
                </div>
            </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Month;
