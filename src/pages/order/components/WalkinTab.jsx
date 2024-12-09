import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WalkinTab = () => {
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const url = import.meta.env.VITE_API_URL;

  const fetchWalkins = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/purchase-orders/walk-in?page=${page}`);
      const data = response.data;

      const combinedData = data.map((order) => ({
        purchase_order_id: order.purchase_order_id,
        customer_name: order.customer_name,
        status:
          order.status === 'P' ? 'Pending'
          : order.status === 'F' ? 'Failed'
          : 'Success',
        address: `${order.address.street}, ${order.address.barangay}, ${order.address.city}, ${order.address.province}`,
        purchase_date: order.purchase_date,
        products: order.products,
      }));

      setSearchResults(combinedData);
      setPaginationInfo({
        currentPage: data.current_page,
        lastPage: data.last_page,
        perPage: data.per_page,
        total: data.total,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching walk-in orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalkins(currentPage);
  }, [currentPage]);

  const handleSearchChange = (event) => {
    const input = event.target.value;
    setSearchInput(input);

    if (input.trim() === '') {
      fetchWalkins(currentPage);
    } else {
      const filteredResults = searchResults.filter((order) =>
        order.customer_name.toLowerCase().includes(input.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= paginationInfo.lastPage) {
      setCurrentPage(page);
    }
  };

  const openProductModal = (products) => {
    setSelectedOrderProducts(products);
    calculateTotalPrice(products);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedOrderProducts([]);
    setTotalPrice(0);
  };

  const calculateTotalPrice = (products) => {
    const total = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    setTotalPrice(total);
  };

  return (
    <div className="w-full">
      <div className="w-4/5 mx-auto p-3 rounded-lg bg-white shadow-lg shadow-gray-400">
        <div className="relative flex items-center space-x-4">
          <div className="flex items-center w-full px-4 border border-gray-300 rounded-md shadow-md focus-within:border-blue-500 relative h-12">
            <span className="text-black-500 font-bold whitespace-nowrap">WALK-IN ORDERS</span>
            <div className="border-l border-gray-300 h-10 mx-2"></div>
            <input
              type="text"
              className="flex-grow focus:outline-none px-4 py-2 rounded-md sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
              placeholder="Search for Walk-In Orders"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="w-4/5 mx-auto mt-6">
        <div className="bg-white shadow-lg shadow-gray-400 rounded-lg">
          <div className="grid grid-cols-10 font-bold px-2 text-sm py-3 border-b border-gray-300">
            <p className="col-span-1 text-left">ID</p>
            <p className="col-span-2 text-left">Customer Name</p>
            <p className="col-span-1 text-left">Status</p>
            <p className="col-span-3 px-1 text-left">Address</p>
            <p className="col-span-2 text-left">Date</p>
            <p className="col-span-1 text-left">Actions</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-5">
              <h2>Loading...</h2>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((walkin) => (
              <div
                key={walkin.purchase_order_id}
                className="grid grid-cols-10 px-2 py-2 items-center bg-white text-sm border-b border-gray-200 hover:bg-blue-50 duration-300"
              >
                <p className="col-span-1 font-bold text-left">{walkin.purchase_order_id}</p>
                <p className="col-span-2 font-bold text-left">{walkin.customer_name}</p>
                <p
                  className={`col-span-1 font-bold text-left ${
                    walkin.status === 'Failed'
                      ? 'text-red-500'
                      : walkin.status === 'Success'
                      ? 'text-green-500'
                      : 'text-yellow-500'
                  }`}
                >
                  {walkin.status}
                </p>
                <p className="col-span-3 text-left font-bold text-xs px-1">{walkin.address}</p>
                <p className="col-span-2 text-left text-sm text-gray-700">{walkin.purchase_date}</p>
                <button
                  onClick={() => openProductModal(walkin.products)}
                  className="col-span-1 text-blue-500 underline hover:text-blue-700"
                >
                  View Products
                </button>
              </div>
            ))
          ) : (
            <div className="flex justify-center py-5">
              <h2>No Walk-In Orders Found</h2>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center w-full space-x-2 my-7">
        <button
          onClick={() => handlePageChange(1)}
          disabled={paginationInfo.currentPage === 1}
          className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
          disabled={paginationInfo.currentPage === 1}
          className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded"
        >
          Previous
        </button>
        {Array.from({ length: paginationInfo.lastPage }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`font-bold px-3 py-1 rounded cursor-pointer duration-100 shadow-md ${
              paginationInfo.currentPage === i + 1
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-blue-500 hover:text-white'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
          disabled={paginationInfo.currentPage === paginationInfo.lastPage}
          className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(paginationInfo.lastPage)}
          disabled={paginationInfo.currentPage === paginationInfo.lastPage}
          className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded"
        >
          Last
        </button>
      </div>

      {/* Products Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Products</h3>
            {selectedOrderProducts.map((product, index) => (
              <div key={index} className="border-b border-gray-300 py-2">
                <p>Product Name: {product.product_name}</p>
                <p>Price: ₱{product.price.toFixed(2)}</p>
                <p>Quantity: {product.quantity}</p>
              </div>
            ))}
            <h1 className="font-bold mt-4">Total Price: ₱{totalPrice.toFixed(2)}</h1>
            <button
              onClick={closeProductModal}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkinTab;
