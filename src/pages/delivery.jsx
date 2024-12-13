import { useEffect, useState, useRef } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import ViewDeliveryModal from "./delivery/modal/ViewDeliveryModal";
import EditDeliveryModal from "./delivery/modal/EditDeliveryModal";
import CancelDeliveryModal from "./delivery/modal/CancelDeliveryModal";

import QuickButtons from "../components/quickButtons";

import loading from '../pages/delivery/images/hourglass.png'
import warrantCheck from '../pages/delivery/images/warranty.png'


function Delivery() {
  const url = import.meta.env.VITE_API_URL;
  const [selectedDeliveryManName, setSelectedDeliveryManName] = useState("");
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState("");
  const [selectedReturnStatus, setSelectedReturnStatus] = useState(""); // NEW: Return Status

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedCancelDeliveryId, setSelectedCancelDeliveryId] = useState(null);
  const [selectedCancelDeliveryStatus, setSelectedCancelDeliveryStatus] = useState(""); // Delivery status
  const [selectedCancelReturnStatus, setSelectedCancelReturnStatus] = useState(""); // Return status
  
  const [deliveries, setDeliveries] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEditDeliveryId, setSelectedEditDeliveryId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const dropdownRefs = useRef({});

  // Define fetchDeliveries outside useEffect
  const fetchDeliveries = async () => {
    try {
      const response = await axios.get(`${url}/api/deliveries/index`, {
        params: { status: statusFilter, page: currentPage },
      });
      setDeliveries(response.data.deliveries || []);
      setTotalPages(response.data.pagination?.lastPage || 1);
      setFilteredDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setDeliveries([]);
      setFilteredDeliveries([]);
    }
  };

  // Fetch deliveries when filters change
  useEffect(() => {
    fetchDeliveries();
  }, [statusFilter, currentPage]);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleDeliveryClick = (deliveryId) => {
    setSelectedDeliveryId(deliveryId);
    setShowViewModal(true);
  };

  const handleEditDelivery = (delivery) => {
    setSelectedEditDeliveryId(delivery.delivery_id);
    setSelectedDeliveryManName(delivery.delivery_man.name);
    setSelectedDeliveryStatus(delivery.status);
    setSelectedReturnStatus(delivery.return_status); // NEW: Pass Return Status

    setEditModalOpen(true);
    setDropdownOpen(null); // Close dropdown
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = deliveries.filter((delivery) =>
      delivery.delivery_man.name.toLowerCase().includes(query)
    );
    setFilteredDeliveries(filtered);
  };

  const toggleDropdown = (deliveryId) => {
    setDropdownOpen((prev) => (prev === deliveryId ? null : deliveryId));
  };

  // Handle closing dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        (!dropdownRefs.current[dropdownOpen] ||
          !dropdownRefs.current[dropdownOpen].contains(event.target))
      ) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const getStatusDisplayName = (status) => {
    const statuses = {
      OD: "On-Delivery",
      P: "Pending",
      F: "Failed",
      S: "Delivered",
    };
    return statuses[status] || "Unknown";
  };

  const getReturnStatusDisplay = (return_status) => {
    const statuses = {
      NR: "No Returns",
      P: "Pending",
      S: "Refunded",
    };
    return statuses[return_status] || "Unknown";
  };


  return (
    <div className="flex w-full bg-white-100">
      <Navbar />
      <QuickButtons />
      <div className="flex flex-col w-full bg-white">
        <div className="w-4/5 mx-auto  p-6 m-3 rounded-lg bg-white shadow-lg shadow-gray-400 mb-6">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM DELIVERY</h2>
        </div>
        <div className="w-4/5 mx-auto  p-3 rounded-lg bg-white shadow-lg shadow-gray-400">
          <div className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md shadow-md relative h-12">
            <span className="font-bold text-black-500 whitespace-nowrap">
              DELIVERY
            </span>
            <div className="border-l border-gray-300 h-10 mx-2"></div>
            <input
              type="text"
              className="flex-grow focus:outline-none px-4 py-2 rounded-md sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
              placeholder="Search for Delivery man"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex mt-4">
            <span className="mx-1 font-bold py-1 px-3 text-blue-500 rounded">
              Delivery Status:
            </span>
            {["", "P", "OD", "F", "S"].map((status) => (
              <button
                key={status}
                className={`mx-1 font-bold py-1 px-3 ${
                  statusFilter === status ? "bg-blue-500 text-white" : ""
                } rounded shadow-md hover:bg-blue-500 hover:text-white duration-200`}
                onClick={() => handleFilterChange(status)}
              >
                {status ? getStatusDisplayName(status) : "All"}
              </button>
            ))}
          </div>
        </div>
        <div className="w-4/5 mx-auto mt-2 p-3 rounded-lg bg-white shadow-lg shadow-gray-400">
          <div className="grid grid-cols-9 text-sm font-bold rounded-md">
            <div className="col-span-1">Delivery ID#</div>
            <div className="col-span-1">Purchase Order ID#</div>
            <div className="col-span-2">Delivery man</div>
            <div className="col-span-1 text-center">Warranty Status</div>
            <div className="col-span-1 text-center">Delivery Status</div>
            <div className="col-span-1 text-center">Return Status</div>
            <div className="col-span-1 text-center">Delivery Created (24hrs)</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>
          {filteredDeliveries.length > 0 ? (
            filteredDeliveries.map((delivery) => (
              <div
                key={delivery.delivery_id}
                className="hover:bg-blue-50 duration-200 grid grid-cols-9 gap-2 rounded my-2 bg-white shadow-md p-3 items-center"
              >
                {/* Delivery ID */}
                <div className="col-span-1 text-sm font-medium text-left truncate">
                  {delivery.delivery_id}
                </div>

                {/* Purchase Order ID */}
                <div className="col-span-1 text-sm font-bold text-blue-700 text-left truncate">
                  {delivery.purchase_order.purchase_order_id}
                </div>

                {/* Delivery Man Name */}
                <div className="col-span-2 text-sm font-medium truncate">
                  {delivery.delivery_man.name}
                </div>

                {/* Warranty */}
                <div className="col-span-1 text-center">
                  <div
                    className={`inline-block p-2 rounded-full shadow-md ${
                      delivery.time_exceeded === "yes" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <img
                      src={delivery.time_exceeded === "yes" ? warrantCheck : loading}
                      alt={delivery.time_exceeded === "yes" ? "Warranty Active" : "Warranty Pending"}
                      className="h-6 w-6"
                    />
                  </div>
                </div>


                {/* Delivery Status */}
                <div
                  className={`col-span-1 px-2 py-1 font-bold text-center rounded-full truncate ${
                    delivery.status === "OD"
                      ? "bg-green-200 text-green-600"
                      : delivery.status === "P"
                      ? "bg-pink-200 text-pink-600"
                      : delivery.status === "F"
                      ? "bg-red-200 text-red-600"
                      : delivery.status === "S"
                      ? "bg-green-400 text-black"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {getStatusDisplayName(delivery.status)}
                </div>

                {/* Return Status */}
                <div
                  className={`col-span-1 px-2 py-1 font-bold text-center rounded-full truncate ${
                    delivery.return_status === "NR"
                      ? "border border-green-400 text-green-600"
                      : delivery.return_status === "P"
                      ? "bg-red-200 border border-red-500 text-red-600"
                      : delivery.return_status === "S"
                      ? "bg-green-200 border border-green-500 text-green-600"
                      : "bg-gray-200 border border-gray-400 text-gray-600"
                  }`}
                >
                  {getReturnStatusDisplay(delivery.return_status)}
                </div>

                {/* Formatted Date */}
                <div className="col-span-1 text-sm font-medium text-center truncate">
                  {delivery.formatted_date}
                </div>

                {/* Actions */}
                <div className="col-span-1 text-center relative">
                  <button
                    className="bg-blue-500 text-white font-bold px-3 py-1 rounded-md hover:bg-blue-600 hover:text-white duration-200 w-full"
                    onClick={() => toggleDropdown(delivery.delivery_id)}
                  >
                    More
                  </button>
                  {dropdownOpen === delivery.delivery_id && (
                    <div
                      className="absolute left-36 top-0 z-50 w-40 bg-white border border-gray-300 rounded shadow-lg"
                      ref={(el) => (dropdownRefs.current[delivery.delivery_id] = el)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="block w-full px-4 py-2 text-left font-bold text-blue-500 hover:bg-blue-100 duration-200"
                        onClick={() => handleDeliveryClick(delivery.delivery_id)}
                      >
                        View Details
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left font-bold text-blue-500 hover:bg-blue-100 duration-200"
                        onClick={() => handleEditDelivery(delivery)}
                      >
                        Edit Delivery
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left font-bold text-red-500 hover:bg-red-100 duration-200"
                        onClick={() => {
                          setCancelModalOpen(true);
                          setSelectedCancelDeliveryId(delivery.delivery_id);
                          setSelectedCancelDeliveryStatus(delivery.status);
                          setSelectedCancelReturnStatus(delivery.return_status);
                        }}
                      >
                        Cancel Delivery
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-sm font-medium">No deliveries found.</div>
          )}
        </div>

        <div className="flex justify-center w-full space-x-2 my-7">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded disabled:opacity-50"
          >
            Previous
          </button>
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
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="font-bold px-3 py-1 bg-white hover:bg-blue-500 hover:text-white duration-200 shadow-md cursor-pointer rounded disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>

      {/* View Delivery Modal */}
      {showViewModal && (
        <ViewDeliveryModal
          deliveryId={selectedDeliveryId}
          onClose={() => setShowViewModal(false)}
        />
      )}
      
      {/* Edit Delivery Modal */}
      {editModalOpen && (
        <EditDeliveryModal
          deliveryId={selectedEditDeliveryId}
          deliveryManName={selectedDeliveryManName}
          status={selectedDeliveryStatus}
          returnStatus={selectedReturnStatus} // Pass Return Status
          onClose={() => {
            setEditModalOpen(false);
            setSelectedEditDeliveryId(null);
            setSelectedDeliveryManName("");
            setSelectedDeliveryStatus("");
            setSelectedReturnStatus("");
          }}
          onSave={fetchDeliveries}
        />
      )}

      {cancelModalOpen && (
        <CancelDeliveryModal
          deliveryId={selectedCancelDeliveryId}
          deliveryStatus={selectedCancelDeliveryStatus} // Pass delivery status
          returnStatus={selectedCancelReturnStatus} // Pass return status
          onClose={() => {
            setCancelModalOpen(false);
            setSelectedCancelDeliveryId(null);
            setSelectedCancelDeliveryStatus("");
            setSelectedCancelReturnStatus("");
          }}
          onCancelSuccess={fetchDeliveries} // Refresh deliveries on success
        />
      )}
    </div>
  );
}

export default Delivery;
