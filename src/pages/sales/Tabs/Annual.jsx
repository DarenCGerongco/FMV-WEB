import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { SlBadge } from "react-icons/sl";

import AnnualTopSoldProduct from './../modal/annual/TopSoldProductsModal'
import AnnualTopDamagedProduct from './../modal/annual/TopDamagedProductsModal'
import { FaArrowRightLong } from "react-icons/fa6";



// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Annual = ({ onDataSend }) => {
  const url = import.meta.env.VITE_API_URL;

  const [annualData, setAnnualData] = useState([]); // Annual totals
  const [chartAnnualData, setChartAnnualData] = useState([]); // Monthly chart data
  const [top3AnnualData, setTop3AnnualData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);


  const [topSoldModal, setTopSoldModal] = useState(false)
  const [topDamagedModal, setTopDamagedModal] = useState(false)




  // Fetch Annual Records and Chart Data
  const fetchAnnualRecords = async (year) => {
    try {
      setLoading(true);
      setError(false);

      const responseTotalAnnual = await axios.get(`${url}/api/Insights/View/Annual-Data`, {
        params: { year },
      });

      const responseTotalAnnualChart = await axios.get(
        `${url}/api/Insights/View/Annual-Data/Chart`,
        { params: { year } }
      );

      const responseTop3Products = await axios.get(
        `${url}/api/Insights/View/Annual-Data/Top-3-Products`,
        {params: {year}}
      );

      console.log(responseTop3Products.data);
      setAnnualData(responseTotalAnnual.data || {});
      setChartAnnualData(responseTotalAnnualChart.data.monthlyData || []);
      setTop3AnnualData(responseTop3Products.data || []); 
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch annual records:", error);
      setError(true);
      setLoading(false);
    }
  };
  console.log(chartAnnualData);
  useEffect(() => {
    fetchAnnualRecords(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Prepare Full Monthly Data (Jan - Dec)
  const fullMonths = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthlyTotalSales: 0,
    monthlyTotalDamageCost: 0,
  }));

  const mergedMonthlyData = fullMonths.map((defaultMonth) => {
    const existingMonth = chartAnnualData.find((data) => data.month === defaultMonth.month);
    return {
      month: defaultMonth.month,
      monthlyTotalSales: existingMonth
        ? parseFloat(existingMonth.monthlyTotalSales.replace(/,/g, ""))
        : 0,
      monthlyTotalDamageCost: existingMonth
        ? parseFloat(existingMonth.monthlyTotalDamageCost.replace(/,/g, ""))
        : 0,
    };
  });

  const chartData = {
    labels: mergedMonthlyData.map((data) => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return monthNames[data.month - 1];
    }),
    datasets: [
      {
        label: "Monthly Sales",
        data: mergedMonthlyData.map((data) => data.monthlyTotalSales),
        backgroundColor: "rgb(147, 250, 165, 1)",
      },
      {
        label: "Damage Cost",
        data: mergedMonthlyData.map((data) => data.monthlyTotalDamageCost),
        backgroundColor: "rgba(246, 71, 71, 1)",
      },
    ],
  };
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: `Monthly Sales and Damage Cost for ${selectedYear}` },
        tooltip: {
          callbacks: {
            label: function (context) {
              let value = context.raw || 0;
              return `PHP ${value.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return `PHP ${value.toLocaleString()}`;
            },
          },
        },
        x: {
          grid: { display: false },
        },
      },
    };
  
  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="my-2 flex justify-between bg-white p-4 shadow-lg shadow-gray-400 rounded-lg">
        <div>
          <h1 className="text-xl font-bold">Annual Sales Insights</h1>
          <p className="text-gray-600">Insights for the year {selectedYear}</p>
        </div>
        <div>
          <select
            id="year-dropdown"
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border rounded bg-white"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Section */}
      {loading ? (
        <div className="text-center text-gray-500">
          <h1>Loading Annual Sales...</h1>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-6">
          Failed to load annual records. Please try again later.
        </div>
      ) : (
        <>
        <div className="flex gap-4 mb-3">
          {/* Annual Total Sales */}
          <div className="hover:scale-105 duration-300 bg-white rounded-lg shadow-lg shadow-gray-400 p-4 text-center flex-1">
            <h2 className="text-md font-semibold text-gray-700">Annual Total Sales</h2>
            <p className="text-md font-bold text-blue-600">
              PHP {annualData.annualTotalSales || "0"}
            </p>
          </div>
          {/* Total Delivered Products */}
          <div className="hover:scale-105 duration-300 bg-white rounded-lg shadow-lg shadow-gray-400 p-4 text-center flex-1">
            <h2 className="text-md font-semibold text-gray-700">Total Delivered Products</h2>
            <p className="text-md font-bold text-green-600">
              {annualData.totalSuccessDeliveredProduct || "0"}
            </p>
          </div>
          {/* Successful Deliveries */}
          <div className="hover:scale-105 duration-300 bg-white rounded-lg shadow-lg shadow-gray-400 p-4 text-center flex-1">
            <h2 className="text-md font-semibold text-gray-700">Successful Deliveries</h2>
            <p className="text-md font-bold text-purple-600">
              {annualData.successfulDeliveriesCount || "0"}
            </p>
          </div>
          {/* Annual Total Damage Cost */}
          <div className="hover:scale-105 duration-300 bg-white rounded-lg shadow-lg shadow-gray-400 p-4 text-center flex-1">
            <h2 className="text-md font-semibold text-gray-700">Annual Total Damage Cost</h2>
            <p className="text-md font-bold text-red-600">
              PHP {annualData.annualTotalDamageCost || "0"}
            </p>
          </div>
        </div>

          {/* Chart Section */}
          <div className="bg-white w-full rounded-lg shadow-lg shadow-gray-400 p-4">
            {/* Full Width with Custom Height */}
            <div className="w-full" style={{ height: "18rem" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
        </div>

        <div className="w-full flex gap-2 mt-2">

          {/* LEFT TOP 3 SOLD PRODUCT */}
          <div className="w-1/2 mt-2 p-4 border border-green-500 rounded-xl shadow-lg shadow-gray-400 bg-white">
            {/* Header Section */}
            <div className="flex items-center justify-between w-full gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-md font-bold text-gray-700">
                        Most Sold Products of Year {selectedYear}
                    </h2>
                    <SlBadge className="bg-green-300 text-white rounded-full p-1 w-6 h-6" />
                </div>

                {/* See All Button */}
                <div className="flex items-center gap-1 hover:bg-gray-300 duration-200 bg-gray-100 rounded-full p-1">
                <button
                    onClick={() => setTopSoldModal(true)} // Open Modal
                    className="text-blue-600 font-semibold"
                >
                    See All
                </button>
                <FaArrowRightLong className="text-blue-600" />
                </div>
            </div>
            {/* Top 3 Sold Products List */}
            <div className="flex flex-col gap-4">
                {top3AnnualData.top_sold_products?.length > 0 ? (
                    top3AnnualData.top_sold_products.map((product) => (
                        <div
                            key={product.product_id}
                            className="hover:bg-blue-200 flex justify-between items-center rounded-lg shadow-md p-4 duration-300"
                        >
                            {/* Product Name and ID */}
                            <div className="w-1/3 flex items-center">
                                <h2 className="text-xs font-bold mr-2">ID{product.product_id}</h2>
                                <h3 className="text-xs font-bold text-gray-800">
                                    {product.product_name}
                                </h3>
                            </div>

                            {/* Product Price */}
                            <div className="w-1/3 text-center">
                                <p className="text-xs text-gray-600">
                                    Price:{" "}
                                    <span className="font-semibold text-blue-600">
                                        PHP {product.price}
                                    </span>
                                </p>
                            </div>

                            {/* Total Sold */}
                            <div className="w-1/3 text-right">
                                <p className="text-xs text-gray-600">
                                    Total Sold:{" "}
                                    <span className="font-semibold text-green-600">
                                        {product.total_sold}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No products available.</p>
                )}
            </div>
                {/* Modal for "See All" */}
                {topSoldModal && (
                    <AnnualTopSoldProduct
                        year={selectedYear}
                        onClose={() => setTopSoldModal(false)} // Close modal
                    />
                )}
          </div>
            {/* LEFT TOP 3 SOLD PRODUCT */}

            {/* RIGHT TOP DAMAGED PRODUCT */}
            <div className="w-1/2 mt-2 p-4 border border-red-500 rounded-xl shadow-lg shadow-gray-400 bg-white">
              <div className="flex items-center justify-between w-full gap-2 mb-4">
                  <div className="flex items-center gap-2">
                      <h2 className="text-md font-bold text-gray-700">
                          Most Damaged Products of Year {selectedYear}
                      </h2>
                      <SlBadge className="bg-red-300 text-white rounded-full p-1 w-6 h-6" />
                  </div>

                  {/* See All Button */}
                  <div className="flex items-center gap-1 hover:bg-gray-300 duration-200 bg-gray-100 rounded-full p-1">
                  <button
                      onClick={() => setTopSoldModal(true)} // Open Modal
                      className="text-blue-600 font-semibold"
                  >
                      See All
                  </button>
                  <FaArrowRightLong className="text-blue-600" />
                  </div>
              </div>
              <div className="flex flex-col gap-4">
                {top3AnnualData.top_damaged_products?.length > 0 ? (
                    top3AnnualData.top_damaged_products.map((product) => (
                        <div
                            key={product.product_id}
                            className="hover:bg-blue-200 flex justify-between items-center rounded-lg shadow-md p-4 duration-300"
                        >
                            {/* Product Name and ID */}
                            <div className="w-1/3 flex items-center">
                                <h2 className="text-xs font-bold mr-2">ID{product.product_id}</h2>
                                <h3 className="text-xs font-bold text-gray-800">
                                    {product.product_name}
                                </h3>
                            </div>

                            {/* Product Price */}
                            <div className="w-1/3 text-center">
                                <p className="text-xs text-gray-600">
                                    Price:{" "}
                                    <span className="font-semibold text-blue-600">
                                        PHP {product.price}
                                    </span>
                                </p>
                            </div>

                            {/* Total Sold */}
                            <div className="w-1/3 text-right">
                                <p className="text-xs text-gray-600">
                                    Total Damage:{" "}
                                    <span className="font-semibold text-red-500">
                                        {product.total_damages}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No products available.</p>
                )}
            </div>
                {/* Modal for "See All" */}
                {topDamagedModal && (
                    <AnnualTopDamagedProduct
                        year={selectedYear}
                        onClose={() => setTopDamagedModal(false)} // Close modal
                    />
                )}
            </div>
        </div>
      </>
    )}
  </div>
);
};

export default Annual;
