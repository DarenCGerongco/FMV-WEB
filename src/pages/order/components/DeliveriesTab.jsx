import React from 'react';

const DeliveriesTab = ({
  loading,
  searchInput,
  handleSearchChange,
  createDeliveryPage,
  statusFilter,
  handleFilterChange,
  searchResults,
  handlePageChange,
  paginationInfo,
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
              placeholder="Search for Ongoing Order"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
          <button
            className="w-[15%] font-bold px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-lg text-white"
            onClick={createDeliveryPage}
          >
            Create Order
          </button>
        </div>
        <div className="flex mt-4">
          <span className="mx-1 font-bold py-1 px-3 text-blue-500 rounded">Filter:</span>
          <button
            className={`mx-1 font-bold py-1 px-3 ${
              statusFilter === "" ? "bg-blue-500 text-white" : "bg-white text-black"
            } rounded shadow-md hover:bg-blue-500 hover:text-white duration-200`}
            onClick={() => handleFilterChange("")}
          >
            All
          </button>
          <button
            className={`mx-1 font-bold py-1 px-3 ${
              statusFilter === "Pending" ? "bg-blue-500 text-white" : "bg-white text-black"
            } rounded shadow-md hover:bg-blue-500 hover:text-white duration-200`}
            onClick={() => handleFilterChange("Pending")}
          >
            Pending
          </button>
          <button
            className={`mx-1 font-bold py-1 px-3 ${
              statusFilter === "Failed" ? "bg-blue-500 text-white" : "bg-white text-black"
            } rounded shadow-md hover:bg-blue-500 hover:text-white duration-200`}
            onClick={() => handleFilterChange("Failed")}
          >
            Failed
          </button>
          <button
            className={`mx-1 font-bold py-1 px-3 ${
              statusFilter === "Success" ? "bg-blue-500 text-white" : "bg-white text-black"
            } rounded shadow-md hover:bg-blue-500 hover:text-white duration-200`}
            onClick={() => handleFilterChange("Success")}
          >
            Success
          </button>
        </div>
      </div>
      <div className="w-4/5 mx-auto mt-6">
        <div className="bg-white shadow-lg shadow-gray-400 rounded-lg">
          <div className="grid grid-cols-11 font-bold px-2 text-sm py-3 border-b border-gray-300">
            <p className="col-span-1 text-left">POID</p>
            <p className="col-span-2 text-left">Customer's Name</p>
            <p className="col-span-1 text-left">Status</p>
            <p className="col-span-3 px-1 text-left">Address</p>
            <p className="col-span-2 text-left">Date</p>
            <p className="col-span-2 text-center">Actions</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-5">
              <h2>Loading...</h2>
              <div className="spinner"></div>
            </div>
          ) : (
            searchResults.map((customerData, index) => {
            if (!customerData) return null; // Skip undefined objects
            return (
                <div
                key={index}
                className="grid grid-cols-11 px-2 py-2 items-center bg-white text-sm border-b border-gray-200 hover:bg-blue-50 duration-300"
                >
                <p className="col-span-1 font-bold text-left">
                    {customerData.purchase_order_id || "N/A"}
                </p>
                <p className="col-span-2 font-bold text-left">
                    {customerData.customer_name || "N/A"}
                </p>
                <p
                    className={`col-span-1 font-bold text-left ${
                    customerData.status === 'Failed'
                        ? 'text-red-500'
                        : customerData.status === 'Success'
                        ? 'text-green-500'
                        : customerData.status === 'Pending'
                        ? 'text-yellow-500'
                        : 'text-gray-900'
                    }`}
                >
                    {customerData.status || "Unknown"}
                </p>
                <div className="col-span-3 text-left font-bold text-xs px-1">
                    <p>{`${customerData.street || ""}, ${
                    customerData.barangay || ""
                    }, ${customerData.province || ""}, ${
                    customerData.city || ""
                    }`}</p>
                </div>
                <p className="col-span-2 text-left text-sm text-gray-700">
                    {customerData.created_at || "N/A"}
                </p>
                </div>
            );
            })
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

export default DeliveriesTab;
