import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
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
import axios from "axios";
import QuickButtons from '../components/quickButtons';

// Import assets (optional if using image imports)
import UpIcon from "/src/assets/up.png";
import UpTIcon from "/src/assets/upt.ico";
import DamageIcon from "/src/assets/damage.png";
import DownTIcon from "/src/assets/downt.ico";

import TopSaleModal from "./sales/modal/TopSalesModal"


// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Sales() {
  const url = import.meta.env.VITE_API_URL;
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const [monthlyData, setMonthlyData] = useState(null); // Combined data for current and previous months
  const [chartData, setChartData] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [top3, setTop3] = useState([]);

  // Modals
  const [showModalTopSales, setShowModalTopSales] = useState(false);


  const monthlyRecordsUrl = `${url}/api/Insights/Monthly-Records`;
  const monthlyDataUrl = `${url}/api/Insights/Monthly-Data`;
  const top3Data = `${url}/api/Insights/TopSold-Items`;

  const getYears = () => {
    // If availableYears exists, use it. Otherwise, fallback to a range from 2023 to current year
    return availableYears.length > 0 ? availableYears : [2023, new Date().getFullYear()];
  };

  const fetchMonthlyRecords = async () => {
    try {
      const response = await axios.get(monthlyRecordsUrl, {
        params: { year },
      });
  
      console.log("Annual Records Response (Bar Graph):", response.data);
  
      const data = response.data.data || [];
  
      // Helper array for short month names
      const monthAbbreviations = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
  
      // Set available years from the API response
      setAvailableYears(response.data.available_years || []);
  
      // Set the chart data for revenue and damages
      setChartData({
        labels: data.map((item, index) => monthAbbreviations[index] || "Unknown"),
        datasets: [
          {
            label: "Total Sales (Php)",
            backgroundColor: "#4caf50",
            borderRadius: 10,
            data: data.map((item) =>
              parseFloat(item.total_revenue?.replace(/,/g, "") || 0)
            ),
          },
          {
            label: "Total Damages (Php)",
            backgroundColor: "#f44336",
            borderRadius: 10,
            data: data.map((item) =>
              parseFloat(item.total_damages?.replace(/,/g, "") || 0)
            ),
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch monthly records:", error);
    }
  };
  

  const fetchMonthlyData = async () => {
    const currentMonth = new Date().getMonth() + 1;
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? year - 1 : year;

    try {
      const response = await axios.get(monthlyDataUrl, {
        params: { month: currentMonth, year },
      });

      console.log("Monthly Data Response (Current and Previous):", response.data);
      setMonthlyData(response.data);
    } catch (error) {
      console.error("Failed to fetch monthly data:", error);
    }
  };

  const top3SoldItemData = async () => {
    try {
      const response = await axios.get(top3Data);
      // console.log("Sold items:", JSON.stringify(response.data, null, 2));
      setTop3(response.data.data);
    }catch(error){
      console.error("failed to fetch top 3 data:", error)
    }
  }

  useEffect(() => {
    fetchMonthlyRecords();
    fetchMonthlyData();
    top3SoldItemData();
  }, [year]);

  console.log(top3);
  return (
    <div className="flex w-full">
      <Navbar />
      <QuickButtons/>

      <div className="w-full bg-gray-50">
        <div className="w-4/5 mx-auto p-6 mt-3 rounded-lg bg-white shadow-lg shadow-gray-400">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM SALES</h2>
        </div>

        {monthlyData && (
          <div className="w-4/5 mx-auto flex gap-x-2 py-1">
            {/* Total Sales Card */}
            <div className="hover:scale-105 duration-200 flex flex-col bg-white border shadow-md mt-10 p-5 rounded-lg w-11/12">
              <div className="flex items-center space-x-2">
                <img src={UpIcon} alt="Total Sales" className="w-6 h-6" />
                <h1 className="font-bold text-sm text-left flex-grow">Total Sales</h1>
                <img src="/src/assets/upt.ico" alt="Total Sales" className="w-16 h-16" />
              </div>
              <h1 className="text-center text-md font-bold">
                Php {monthlyData.TotalRevenueOfPurchaseOrder || "0.00"}
              </h1>
            </div>

            {/* This Month's Sales Card */}
            <div className="hover:scale-105 duration-200 flex flex-col bg-white border shadow-md mt-10 p-5 rounded-lg w-11/12">
              <div className="flex items-center justify-start space-x-2 w-full">
                <img src={UpIcon} alt="Total Sales" className="w-6 h-6" />
                <h1 className="font-bold text-sm text-left flex-grow">This Month's Sales</h1>
                <img src="/src/assets/upt.ico" alt="This Month's Sales" className="w-16 h-16" />
              </div>
              <h1 className="text-center text-md font-semibold">
                Php {monthlyData.CurrentPurchaseOrderRevenue || "0.00"}
              </h1>
            </div>

            {/* Last Month's Sales Card */}
            <div className="hover:scale-105 duration-200 flex flex-col bg-white border shadow-md mt-10 p-5 rounded-lg w-11/12">
            <div className="flex items-center justify-start space-x-2 w-full">
            <img src={UpIcon} alt="Total Sales" className="w-6 h-6" />
              <h1 className="font-bold text-sm text-left flex-grow">Last Month's Sales</h1>
                <img src="/src/assets/upt.ico" alt="Last Month's Sales" className="w-16 h-16" />
              </div>
              <h1 className="text-center text-md font-semibold">
                Php {monthlyData.PreviousMonthRevenue || "0.00"}
              </h1>
            </div>

            {/* Total Damages Card */}
            <div className="hover:scale-105 duration-200 flex flex-col bg-white border shadow-md mt-10 p-5 rounded-lg w-11/12">
              <div className="flex items-center justify-start space-x-2 w-full">
                <img src="/src/assets/damage.png" alt="Total Damages" className="w-6 h-6" />
                <h1 className="font-bold text-sm text-left flex-grow">Total Damages</h1>
                <img src={DownTIcon} alt="Total Damages" className="w-16 h-16"/>
              </div>
              <h1 className="text-center text-md font-semibold">
                Php {monthlyData.TotalDamagesOfPurchaseOrder || "0.00"}
              </h1>
            </div>
          </div>
        )}

        <div className="w-4/5 mx-auto py-2 gap-x-2">
          <div className="w-1/2 h-[400px] bg-white shadow-md  border rounded-xl p-7 hover:scale-105 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold">Annual Records</h3>
              <select
                className="border rounded-full bg-blue-500 text-white"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              >
                {getYears().map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            {chartData && (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: `Sales and Damages (Php) for ${year}` },
                  },
                }}
              />
            )}
          </div>
          <div className="bg-white w-1/2 p-2 mt-5 shadow-md rounded-lg">
            <div className="flex justify-between px-2">
              <h1 className="font-bold">
                Top Product Sales 
              </h1>
              <h1 
                className="bg-blue-500 p-1 px-2 font-bold text-white rounded"
                onClick={() => setShowModalTopSales(true)}
              >
                See all
              </h1>

            </div>
            {top3.length > 0 ? (
              <div className="flex p-2 flex-col w-full">
                {top3.map((product, index) => (
                  <div
                    key={product.product_id}
                    className="flex w-full  hover:shadow-lg hover:bg-blue-200 rounded-lg mb-1 p-2  duration-200"
                  >
                    <div className="flex justify-left items-center w-1/2">
                      <h2 className="text-xs font-bold mb-1 bg-blue-500 text-white p-1 rounded ">ID {product.product_id}</h2>
                      <h2 className="text-xs font-bold ml-2 mb-1">{product.product_name}</h2>
                    </div>
                    <div className=" flex w-1/2 justify-around items-center">
                      <span className="text-gray-500 font-bold text-xs text-left">
                        ₱{product.price.toLocaleString()}/item
                      </span>
                      <p className="text-gray-700 text-xs">
                        Total Sold: <span className="font-bold">{product.total_sold}</span>
                      </p>
                      <p className="text-gray-700  text-xs">
                        Total Worth: <span className="font-bold"> ₱{product.total_sold * product.price}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No data available</p>
            )}
          </div>
        </div>
      </div>
      {showModal && <TopSalesModal onClose={() => setShowModalTopSales(false)} />}
    </div>
  );
}
export default Sales;



