import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TopDamagedProductsModal = ({ onClose, month, year }) => {
  const [topProducts, setTopProducts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 20,
    currentPage: 1,
    lastPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [chartData, setChartData] = useState(null);

  const url = import.meta.env.VITE_API_URL;

  // Fetch top damaged products
  const fetchTopDamagedProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/Insights/View/Month-Data/Top-Damaged-Products`, {
        params: { page, perPage: 20, month, year },
      });

      const { data, pagination } = response.data;

      // Safeguard against missing pagination data
      if (!pagination) {
        console.error("Pagination data missing");
        return;
      }

      // Update state
      setTopProducts(data || []);
      setPagination({
        total: pagination.total || 0,
        perPage: pagination.perPage || 20,
        currentPage: pagination.currentPage || 1,
        lastPage: pagination.lastPage || 1,
      });
      setCurrentPage(pagination.currentPage || 1);

      // Prepare chart data for top 10 products
      const top10 = data.slice(0, 10);
      setChartData({
        labels: top10.map((product) => product.product_name),
        datasets: [
          {
            label: "Total Damages",
            data: top10.map((product) => product.total_damages),
            backgroundColor: [
              "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50",
              "#F44336", "#7E57C2", "#FF7043", "#AB47BC",
              "#26A69A", "#EC407A",
            ],
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch damaged products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopDamagedProducts();
  }, [month, year]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.lastPage) {
      fetchTopDamagedProducts(page);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white w-3/4 max-w-4xl rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b z-10 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Top Damaged Products - {month}/{year}</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-900 font-bold text-2xl">
                    &times;
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
            <div className="text-center text-gray-500 py-6">Loading...</div>
            ) : topProducts.length > 0 ? (
            <>
                {/* Pie Chart */}
                {chartData && (
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-center mb-4">Top 10 Damaged Products Distribution</h3>
                    <div className="relative w-full h-[400px] bg-gray-100 rounded-md">
                    <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
                )}

                {/* Product Table */}
                <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b bg-gray-200 text-left">
                    <th className="p-3 font-bold">#</th>
                    <th className="p-3 font-bold">Product Name</th>
                    <th className="p-3 font-bold">Price (Php)</th>
                    <th className="p-3 font-bold">Total Damages</th>
                    </tr>
                </thead>
                <tbody>
                    {topProducts.map((product, index) => (
                    <tr key={product.product_id} className="border-b hover:bg-gray-100">
                        <td className="p-3">{index + 1 + (currentPage - 1) * pagination.perPage}</td>
                        <td className="p-3">{product.product_name}</td>
                        <td className="p-3">₱ {parseFloat(product.price).toLocaleString()}</td>
                        <td className="p-3">{product.total_damages}</td>
                    </tr>
                    ))}
                </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {pagination.lastPage}
                    </span>
                    <button
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= pagination.lastPage}
                    >
                        Next
                    </button>
                </div>
            </>
            ) : (
            <div className="text-center text-gray-500 py-6">No damaged products available for this month and year.</div>
            )}
        </div>
    </div>
  );
};

export default TopDamagedProductsModal;
