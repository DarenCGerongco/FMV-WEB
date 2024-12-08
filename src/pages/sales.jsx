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

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Sales() {
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const [monthlyData, setMonthlyData] = useState(null); // Combined data for current and previous months
  const [chartData, setChartData] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  const monthlyRecordsUrl = `${import.meta.env.VITE_API_URL}/api/Insights/Monthly-Records`;
  const monthlyDataUrl = `${import.meta.env.VITE_API_URL}/api/Insights/Monthly-Data`;

  const getYears = () => {
    // If availableYears exists, use it. Otherwise, fallback to a range from 2023 to current year
    return availableYears.length > 0 ? availableYears : [2023, new Date().getFullYear()];
  };

  const fetchMonthlyRecords = async () => {
    try {
      const response = await axios.get(monthlyRecordsUrl, {
        params: { year },
      });
  
      console.log("Monthly Records Response (Bar Graph):", response.data);
  
      const data = response.data.data || [];
      
      // Set available years from the API response
      setAvailableYears(response.data.available_years || []);
  
      // Set the chart data for revenue and damages
      setChartData({
        labels: data.map((item) => item.month || "Unknown"),
        datasets: [
          {
            label: "Total Revenue (Php)",
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

  useEffect(() => {
    fetchMonthlyRecords();
    fetchMonthlyData();
  }, [year]);

  return (
    <div className="flex w-full">
      <Navbar />
      <QuickButtons/>

      <div className="w-full bg-white-100">
        <div className="w-4/5 mx-auto p-6 m-3 rounded-lg bg-white shadow-lg shadow-gray-400 mb-6">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM SALES</h2>
        </div>

        {monthlyData && (
          <div className="w-4/5 mx-auto bg-white rounded-lg flex justify-between items-stretch gap-x-4">
          {[
            {
              title: "Total Revenue",
              value: `Php ${monthlyData.TotalRevenueOfPurchaseOrder || "0.00"}`,
              leftImage: "up.png",
              rightImage: "upt.ico",
            },
            {
              title: "This Month's Revenue",
              value: `Php ${monthlyData.CurrentPurchaseOrderRevenue || "0.00"}`,
              leftImage: "up.png",
              rightImage: "upt.ico",
            },
            {
              title: "Last Month's Revenue",
              value: `Php ${monthlyData.PreviousMonthRevenue || "0.00"}`,
              leftImage: "up.png",
              rightImage: "upt.ico",
            },
            {
              title: "Total Damages",
              value: `Php ${monthlyData.TotalDamagesOfPurchaseOrder || "0.00"}`,
              leftImage: "damage.png",
              rightImage: "downt.ico",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col bg-white shadow-lg shadow-gray-400 my-5 p-5 rounded-lg w-11/12 space-y-2"
            >
              <div className="flex items-center justify-start space-x-2 w-full">
                <img
                  src={`/src/assets/${item.leftImage}`}
                  alt={item.title}
                  className="w-6 h-6"
                />
                <span className="font-bold text-sm text-left flex-grow">{item.title}</span>
                <img
                  src={`/src/assets/${item.rightImage}`}
                  alt={item.title}
                  className="w-20 h-20"
                />
              </div>
              <span className="text-center">{item.value}</span>
            </div>
          ))}
        </div>
        
        )}

        <div className="w-4/5 mx-auto bg-white shadow-lg shadow-gray-400 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Monthly Records</h3>
            <select
              className="border rounded"
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
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: `Revenue and Damages (Php) for ${year}` },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Sales;
