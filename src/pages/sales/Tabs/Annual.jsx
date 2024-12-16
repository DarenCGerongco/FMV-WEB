import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Annual = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnnualRecords = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Insights/Annual-Records`);
      const data = response.data || [];

      // Prepare chart data
      setChartData({
        labels: data.map((item) => item.year),
        datasets: [
          {
            label: "Annual Sales (Php)",
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            data: data.map((item) => parseFloat(item.total_revenue.replace(/,/g, ""))),
          },
          {
            label: "Annual Damages (Php)",
            borderColor: "#F44336",
            backgroundColor: "rgba(244, 67, 54, 0.2)",
            data: data.map((item) => parseFloat(item.total_damages.replace(/,/g, ""))),
          },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch annual records:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnualRecords();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Annual Records</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        chartData && (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Annual Sales and Damages" },
              },
            }}
          />
        )
      )}
    </div>
  );
};

export default Annual;
