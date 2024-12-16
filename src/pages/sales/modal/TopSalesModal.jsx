import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopSalesModal = ({ onClose }) => {
  const [topProducts, setTopProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTopProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/Insights/TopSold-All-Items`,
        { params: { page, perPage: 5 } }
      );

      const { data, pagination } = response.data;
      setTopProducts(data);
      setPagination(pagination);
      setCurrentPage(pagination.currentPage);
    } catch (error) {
      console.error('Failed to fetch top products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.lastPage) {
      fetchTopProducts(page);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-3/4 max-w-4xl rounded-lg shadow-lg p-6">
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
                    <td className="p-2">{index + 1 + (currentPage - 1) * 5}</td>
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
