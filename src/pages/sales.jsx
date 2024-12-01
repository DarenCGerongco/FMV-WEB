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
  const [monthlyData, setMonthlyData] = useState([]);
  const [chartData, setChartData] = useState(null);

  const url = `${import.meta.env.VITE_API_URL}/api/Insights/Monthly-Records`;

  // Fetch monthly records based on the selected year
  const fetchMonthlyData = async () => {
    try {
      const response = await axios.get(url, {
        params: { year }, // Use the year state for filtering
      });

      const data = response.data.data || [];
      setMonthlyData(data);

      // Prepare data for the chart
      const months = data.map((item) => item.month || "Unknown");
      const revenues = data.map((item) =>
        parseFloat(item.total_revenue?.replace(/,/g, "") || 0)
      );
      const damages = data.map((item) =>
        parseFloat(item.total_damages?.replace(/,/g, "") || 0)
      );

      setChartData({
        labels: months,
        datasets: [
          {
            label: "Total Revenue",
            backgroundColor: "#4caf50", // Green color
            data: revenues,
          },
          {
            label: "Total Damages",
            backgroundColor: "#f44336", // Red color
            data: damages,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch monthly data:", error);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [year]);

  // Safely get data for the current and previous months
  const getMonthlyData = (monthIndex) =>
    monthlyData[monthIndex] || { total_revenue: "0.00", total_damages: "0.00" };

  const currentMonthIndex = new Date().getMonth();
  const previousMonthIndex =
    currentMonthIndex === 0 ? 11 : currentMonthIndex - 1; // Handle January case

  const currentMonthData = getMonthlyData(currentMonthIndex);
  const previousMonthData = getMonthlyData(previousMonthIndex);

  return (
    <div className="flex w-full">
      <Navbar />
      <div className="w-full bg-white-100">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg drop-shadow-md mb-6 border">
          <h2 className="text-xl font-bold">Management System Sales</h2>
        </div>
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
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: `Revenue and Damages for ${year}`,
                  },
                },
              }}
            />
          )}
        </div>
        <div className="w-4/5 mx-auto bg-white p-3 rounded-lg drop-shadow-md grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 border rounded">
            <span className="font-bold mb-2">Total Revenue:</span>
            <span>
              Php{" "}
              {monthlyData
                .reduce(
                  (sum, item) =>
                    sum +
                    parseFloat(item.total_revenue?.replace(/,/g, "") || 0),
                  0
                )
                .toLocaleString()}
            </span>
            <span className="font-bold mt-4">Total Damages:</span>
            <span>
              Php{" "}
              {monthlyData
                .reduce(
                  (sum, item) =>
                    sum +
                    parseFloat(item.total_damages?.replace(/,/g, "") || 0),
                  0
                )
                .toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded">
            <span className="font-bold mb-2">Current Month's Revenue:</span>
            <span>Php {currentMonthData.total_revenue}</span>
            <span className="font-bold mt-4">Current Month's Damages:</span>
            <span>Php {currentMonthData.total_damages}</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded">
            <span className="font-bold mb-2">Previous Month's Revenue:</span>
            <span>Php {previousMonthData.total_revenue}</span>
            <span className="font-bold mt-4">Previous Month's Damages:</span>
            <span>Php {previousMonthData.total_damages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sales;
