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

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Sales() {
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const [monthlyData, setMonthlyData] = useState(null); // Combined data for current and previous months
  const [chartData, setChartData] = useState(null);

  const monthlyRecordsUrl = `${import.meta.env.VITE_API_URL}/api/Insights/Monthly-Records`;
  const monthlyDataUrl = `${import.meta.env.VITE_API_URL}/api/Insights/Monthly-Data`;

  // Fetch data for bar graph
  const fetchMonthlyRecords = async () => {
    try {
      const response = await axios.get(monthlyRecordsUrl, {
        params: { year }, // Use the year state for filtering
      });

      console.log("Monthly Records Response (Bar Graph):", response.data); // Log bar graph data

      const data = response.data.data || [];
      setChartData({
        labels: data.map((item) => item.month || "Unknown"),
        datasets: [
          {
            label: "Total Revenue (Php)",
            backgroundColor: "#4caf50",
            data: data.map((item) =>
              parseFloat(item.total_revenue?.replace(/,/g, "") || 0)
            ),
          },
          {
            label: "Total Damages (Php)",
            backgroundColor: "#f44336",
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

  // Fetch current and previous month data
  const fetchMonthlyData = async () => {
    const currentMonth = new Date().getMonth() + 1;
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? year - 1 : year;

    try {
      // Fetch data for the current month
      const response = await axios.get(monthlyDataUrl, {
        params: { month: currentMonth, year },
      });

      console.log("Monthly Data Response (Current and Previous):", response.data); // Log monthly data
      setMonthlyData(response.data); // Directly set the entire response
    } catch (error) {
      console.error("Failed to fetch monthly data:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyRecords(); // Fetch bar graph data
    fetchMonthlyData(); // Fetch current and previous month data
  }, [year]);

  return (
    <div className="flex w-full">
      <Navbar />
      <div className="w-full bg-white-100">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6 border">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM SALES</h2>
        </div>

        {/* Bar Graph Section */}
        <div className="w-4/5 mx-auto bg-white p-3 rounded-lg drop-shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Monthly Records</h3>
            <select
              className="border p-2 rounded"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {[2023, 2024, 2025].map((y) => (
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
          {/* Monthly Data Section */}
          {monthlyData && (
            <div className="w-full mx-auto bg-white rounded-lg grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 border rounded">
                <span className="font-bold mb-2">Current Month's Revenue:</span>
                <span>Php {monthlyData.CurrentPurchaseOrderRevenue || "0.00"}</span>
                <span className="font-bold mt-4">Current Month's Damages:</span>
                <span>Php {monthlyData.CurrentMonthDamages || "0.00"}</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded">
                <span className="font-bold mb-2">Previous Month's Revenue:</span>
                <span>Php {monthlyData.PreviousMonthRevenue || "0.00"}</span>
                <span className="font-bold mt-4">Previous Month's Damages:</span>
                <span>Php {monthlyData.PreviousMonthDamages || "0.00"}</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded">
                <span className="font-bold mb-2">Contribution Percentage:</span>
                <span>{monthlyData.ContributionPercentage || "0.00"}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sales;
