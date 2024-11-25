import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import axios from "axios";

function Delivery() {
  const url = import.meta.env.VITE_API_URL;

  // State for deliveries and filters
  const [deliveries, setDeliveries] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Status filter state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [totalPages, setTotalPages] = useState(1); // Total pages from backend
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch deliveries from the backend


  const fetchDeliveries = async () => {
    try {
      const response = await axios.get(`${url}/api/deliveries/index`, {
        params: {
          status: statusFilter,
          page: currentPage,
        },
      });
      console.log("API Response:", response.data);
      setDeliveries(response.data.deliveries || []); // Correctly access the deliveries array
      setTotalPages(response.data.pagination?.lastPage || 1); // Adjust for nested pagination data
      setFilteredDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setDeliveries([]); // Ensure deliveries are cleared on error
      setFilteredDeliveries([]);
    }
  };

  const getStatusDisplayName = (status) => {
    if(status == "OD"){
      return "On-Delivery";
    } else if (status == "P"){
      return "Pending •";
    } else if (status == "F"){
      return "Failed";
    } else if (status == "S"){
      return "Successful"
    } else{
      return "unknown";
    }
  };

   // Live search functionality
   const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter deliveries based on the search query
    const filtered = deliveries.filter((delivery) =>
      delivery.delivery_man.name.toLowerCase().includes(query)
    );
    setFilteredDeliveries(filtered);
  };

  // Fetch deliveries when the filter or page changes
  useEffect(() => {
    fetchDeliveries();
  }, [statusFilter, currentPage]);

  // Handle filter change
  const handleFilterChange = (status) => {
    setStatusFilter(status); // Update the filter
    setCurrentPage(1); // Reset to the first page
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page); // Update the current page
    }
  };

  return (
    <div className="flex w-full bg-white-100">
      <Navbar />
      <div className="flex flex-col w-full bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6 border">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM DELIVERY</h2>
        </div>
        <div className="w-4/5 mx-auto bg-white p-3 rounded-lg drop-shadow-md">
          <div className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md shadow-md focus-within:border-blue-500 relative h-12">
            <span className="font-bold text-black-500 whitespace-nowrap">DELIVERY</span>
            <div className="border-l border-gray-300 h-10 mx-2"></div>
            <input
              type="text"
              className="flex-grow focus:outline-none px-4 py-2 rounded-md sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
              placeholder="Search for Delivery man"
              value={searchQuery}
              onChange={handleSearchChange} // Live search handler
            />
          </div>
          <div className="flex mt-4">
            <span className="mx-1 font-bold py-1 px-3 text-blue-500 rounded">
              Filter:
            </span>
            <button
              className={`mx-1 font-bold py-1 px-3 ${
                statusFilter === "" ? "bg-blue-500 text-white" : ""
              } rounded shadow-md hover:bg-blue-500 hover:text-white duration-200`}
              onClick={() => handleFilterChange("")}
            >
              All
            </button>
            <button
              className={`mx-1 font-bold py-1 px-3 ${
                statusFilter === "P" ? "bg-blue-500 text-white" : ""
              } rounded shadow-md hover:bg-blue-500 hover:text-white duration-200`}
              onClick={() => handleFilterChange("P")}
            >
              Pending
            </button>
            <button
              className={`mx-1 font-bold py-1 px-3 ${
                statusFilter === "OD" ? "bg-blue-500 text-white" : ""
              } rounded shadow-md hover:bg-blue-500 hover:text-white duration-200`}
              onClick={() => handleFilterChange("OD")}
            >
              On-Delivery
            </button>
            <button
              className={`mx-1 font-bold py-1 px-3 ${
                statusFilter === "F" ? "bg-blue-500 text-white" : ""
              } rounded shadow-md hover:bg-blue-500 hover:text-white duration-200`}
              onClick={() => handleFilterChange("F")}
            >
              Failed
            </button>
            <button
              className={`mx-1 font-bold py-1 px-3 ${
                statusFilter === "S" ? "bg-blue-500 text-white" : ""
              } rounded shadow-md hover:bg-blue-500 hover:text-white duration-200`}
              onClick={() => handleFilterChange("S")}
            >
              Successful
            </button>
          </div>

        </div>
        <div className="w-4/5 mx-auto mt-2 bg-white p-3 rounded-lg drop-shadow-md">
          <div 
            className="grid grid-cols-7 text-sm font-bold p-1 rounded-md"
          >
            <div className="col-span-1">Delivery ID#</div>
            <div className="col-span-1">Purchase Order ID#</div>
            <div className="col-span-2">Delivery man</div>
            <div className="col-span-1 text-center w-[80%]">Status</div>
            <div className="col-span-1">Delivery Created (24hrs)</div>
          </div>
                {filteredDeliveries && filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((delivery) => (
                  <div
                    key={delivery.delivery_id} // Use the correct unique identifier
                    className="hover:bg-blue-50 duration-200 grid text-sm grid-cols-7 border-b shadow-md rounded my-1 border-gray-300 p-1 items-center"
                  >
                    <div className="col-span-1">{delivery.delivery_id}</div>
                    <div className="col-span-1">{delivery.purchase_order.purchase_order_id}</div>
                    <div className="col-span-2">{delivery.delivery_man.name}</div>
                    <div
                      className={`col-span-1 px-2 w-[80%] font-bold text-center rounded-full ${
                        delivery.status === "OD"
                          ? "bg-green-200 border-1 border border-green-500 text-green-500" // On-delivery (Blue)
                          : delivery.status === "P"
                          ? "bg-pink-200 border-1 border border-pink-500 text-pink-500" // Pending (Pink)
                          : delivery.status === "F"
                          ? "bg-red-500" // Failed (Red)
                          : delivery.status === "S"
                          ? "bg-green-500" // Successful (Green)
                          : "bg-gray-500" // Default (Gray)
                      }`}
                    >
                      {getStatusDisplayName(delivery.status)}
                    </div>
                    <div className="col-span-1">{delivery.formatted_date}</div>
                    <div className="flex justify-center ">
                      <span 
                        className="cursor-pointer duration-200 bg-blue-500 px-3 rounded-lg text-white font-bold hover:bg-white hover:text-blue-500"
                      >
                        View
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">No deliveries found.</div>
              )}
          </div>
          <div className="flex justify-center w-full space-x-2 my-4">
            {/* First Page Button */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded disabled:opacity-50"
            >
              First
            </button>

            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded disabled:opacity-50"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`font-bold px-3 py-1 rounded cursor-pointer duration-100 shadow-md ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-blue-500 shadow-md hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded disabled:opacity-50"
            >
              Next
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded disabled:opacity-50"
            >
              Last
            </button>
          </div>
      </div>
    </div>
  );
}

export default Delivery;
