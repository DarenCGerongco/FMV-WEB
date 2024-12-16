import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TopSalesModal = ({ onClose }) => {
  const [topProducts, setTopProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [chartData, setChartData] = useState(null);

  // Function to fetch top products
  const fetchTopProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/Insights/TopSold-All-Items`,
        { params: { page, perPage: 20 } }
      );

      const { data, pagination } = response.data;
      setTopProducts(data);
      setPagination(pagination);
      setCurrentPage(pagination.currentPage);

      // Set the Pie Chart data only for the first page (top 10 products)
      if (page === 1) {
        const top10 = data.slice(0, 10);
        setChartData({
          labels: top10.map((product) => product.product_name),
          datasets: [
            {
              label: "Total Sold",
              data: top10.map((product) => product.total_sold),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4CAF50",
                "#F44336",
                "#7E57C2",
                "#FF7043",
                "#AB47BC",
                "#26A69A",
                "#EC407A",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4CAF50",
                "#F44336",
                "#7E57C2",
                "#FF7043",
                "#AB47BC",
                "#26A69A",
                "#EC407A",
              ],
            },
          ],
        });
      }
    } catch (error) {
      console.error("Failed to fetch top products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTopProducts();
  }, []);

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.lastPage) {
      fetchTopProducts(page);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-3/4 max-w-4xl rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Top Sold Products</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-bold"
          >
            &times;
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            {/* Pie Chart */}
            {chartData && (
                <div className="mb-4">
                <h3 className="text-lg font-bold text-center mb-4">
                    Top 10 Product Sales Distribution
                </h3>
                    <div className="relative w-full bg-gray-100 p-2 h-[600px] rounded-md">
                        <Pie
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                            legend: { position: "top" },
                            tooltip: { enabled: true },
                            },
                        }}
                        />
                    </div>
                </div>
            )}

            {/* Product Table */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">#</th>
                  <th className="p-2">Product Name</th>
                  <th className="p-2">Price (Php)</th>
                  <th className="p-2">Total Sold</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.product_id} className="border-b">
                    <td className="p-2">
                      {index + 1 + (currentPage - 1) * 20}
                    </td>
                    <td className="p-2">{product.product_name}</td>
                    <td className="p-2">{product.price.toLocaleString()}</td>
                    <td className="p-2">{product.total_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.lastPage}
              </span>
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.lastPage}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopSalesModal;
