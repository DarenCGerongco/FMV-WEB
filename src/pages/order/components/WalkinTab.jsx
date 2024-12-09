import React from 'react';

const WalkinTab = ({
  loading,
  searchInput,
  handleSearchChange,
  searchResults,
  paginationInfo,
  handlePageChange,
}) => {
  return (
    <div className="w-full">
      <div className="w-4/5 mx-auto p-3 rounded-lg bg-white shadow-lg shadow-gray-400">
        <div className="relative flex items-center space-x-4">
          <div className="flex items-center w-full px-4 border border-gray-300 rounded-md shadow-md focus-within:border-blue-500 relative h-12">
            <span className="text-black-500 font-bold whitespace-nowrap">ORDER</span>
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
          <div className="grid grid-cols-11 font-bold px-2 text-sm py-3 border-b border-gray-300">
            <p className="col-span-1 text-left">ID</p>
            <p className="col-span-2 text-left">Customer Name</p>
            <p className="col-span-1 text-left">Status</p>
            <p className="col-span-3 px-1 text-left">Address</p>
            <p className="col-span-2 text-left">Date</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-5">
              <h2>Loading...</h2>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((walkin, index) => (
              <div
                key={walkin.purchase_order_id || index} // Use purchase_order_id as the key
                className="grid grid-cols-11 px-2 py-2 items-center bg-white text-sm border-b border-gray-200 hover:bg-blue-50 duration-300"
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
                <div className="col-span-3 text-left font-bold text-xs px-1">
                  <p>{`${walkin.street}, ${walkin.barangay}, ${walkin.province}, ${walkin.city}`}</p>
                </div>
                <p className="col-span-2 text-left text-sm text-gray-700">{walkin.purchase_date}</p>
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
    </div>
  );
};

export default WalkinTab;
