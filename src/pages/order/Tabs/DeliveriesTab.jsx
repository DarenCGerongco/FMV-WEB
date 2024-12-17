import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateDeliveryModal from '../modals/createdeliverymodal';
import ViewDeliveriesModal from '../modals/viewdeliveriesmodal';
import ItemsOrderedModal from '../modals/viewitemsorderedmodal';

const DeliveriesTab = () => {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1 });
  const [deliveriesData, setDeliveriesData] = useState([]);
  const [createDeliveryModalOpen, setCreateDeliveryModalOpen] = useState(false);
  const [viewDeliveriesModalOpen, setViewDeliveriesModalOpen] = useState(false);
  const [itemsOrderedModalOpen, setItemsOrderedModalOpen] = useState(false);
  const [editConfirmationModalOpen, setEditConfirmationModalOpen] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);
  const [openDropDowns, setOpenDropDowns] = useState({});



  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/purchase-orders-delivery`, {
        params: {
          page,
          status: statusFilter || 'All',
          search: searchInput.trim() || null,
        },
      });
      const data = response.data;
      const combinedData = data.orders.map((order) => ({
        purchase_order_id: order.purchase_order_id,
        customer_name: order.customer_name,
        status: order.status === 'P' ? 'Pending' : order.status === 'F' ? 'Failed' : 'Success',
        street: order.address.street,
        city: order.address.city,
        barangay: order.address.barangay,
        province: order.address.province,
        region: order.address.region,
        created_at: order.created_at,
        products: order.products || [],
      }));
      setDeliveriesData(combinedData);
      setSearchResults(combinedData);
      setPaginationInfo({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.lastPage,
      });
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever these change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Fetch orders after 300ms of no typing
      fetchOrders(paginationInfo.currentPage);
    }, 300);
  
    return () => clearTimeout(delayDebounce);
  }, [searchInput, statusFilter, paginationInfo.currentPage]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (Object.keys(openDropDowns).length === 0) return;
      const clickedInsideDropdown =
        event.target.closest('.dropdown-container') || event.target.closest('.dropdown-toggle');
      if (!clickedInsideDropdown) {
        setOpenDropDowns({});
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropDowns]);

  // When user types in search, reset to page 1 immediately
  const handleSearchChange = (event) => {
    const input = event.target.value;
    setSearchInput(input);
    // Reset to page 1 only if not already on page 1
    setPaginationInfo((prev) => (prev.currentPage !== 1 ? { ...prev, currentPage: 1 } : prev));
  };

  // When user changes filter, also reset to page 1
  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setPaginationInfo((prev) => (prev.currentPage !== 1 ? { ...prev, currentPage: 1 } : prev));
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > paginationInfo.totalPages) return;
    setPaginationInfo((prev) => ({ ...prev, currentPage: page }));
  };

  const handleCreateDeliveryClick = (purchaseOrderId) => {
    setSelectedPurchaseOrderId(purchaseOrderId);
    setCreateDeliveryModalOpen(true);
  };

  const handleEditPurchaseOrderClick = (purchaseOrderId, customerData) => {
    setSelectedPurchaseOrderId(purchaseOrderId);
    setConfirmationData({
      customer: customerData.customer_name,
      address: `${customerData.street}, ${customerData.barangay}, ${customerData.city}, ${customerData.province}`,
      products: customerData.products,
    });
    setShowWarningModal(true);
    setOpenDropDowns({}); // Close dropdown
  };
  
  const proceedToEdit = () => {
    setShowWarningModal(false);
    navigate(`/order/edit/${selectedPurchaseOrderId}`, {
      state: confirmationData,
    });
  };
  

  const { currentPage, totalPages } = paginationInfo;

  // Compute dynamic page numbers to show with a sliding window
  const maxPageNumbersToShow = 15;
  let startPage = 1;
  let endPage = totalPages;
  if (totalPages > maxPageNumbersToShow) {
    if (currentPage <= 8) {
      startPage = 1;
      endPage = 15;
    } else if (currentPage > totalPages - 7) {
      startPage = totalPages - 14;
      endPage = totalPages;
    } else {
      startPage = currentPage - 7;
      endPage = currentPage + 7;
    }
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="w-full">
      <div className="w-4/5 mx-auto p-3 rounded-lg bg-white shadow-lg shadow-gray-400">
        <div className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md shadow-md relative h-12">
          <span className="font-bold text-black-500 whitespace-nowrap">ORDER</span>
          <div className="border-l border-gray-300 h-10 mx-2"></div>
          <input
            type="text"
            className="flex-grow focus:outline-none px-4 py-2 rounded-md sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
            placeholder="Search for Ongoing Order"
            value={searchInput}
            onChange={handleSearchChange}
          />
          <div className="border-l border-gray-300 h-10 mx-2"></div>
          <button
            className="px-4 py-2 bg-blue-500 text-white shadow-md rounded-md hover:bg-white hover:text-blue-500 duration-200 font-bold whitespace-nowrap"
            onClick={() => navigate('/order/create-delivery')}
          >
            Create Order
          </button>
        </div>
        <div className="flex mt-4 items-center">
          <span className="mx-1 font-bold py-1 px-3 text-blue-500 rounded">Order Status:</span>
          {['All', 'Pending', 'Failed', 'Success'].map((status) => (
            <button
              key={status}
              className={`mx-1 font-bold py-1 px-3 rounded shadow-md hover:bg-blue-500 hover:text-white duration-200 ${
                (statusFilter === '' && status === 'All') || statusFilter === status
                  ? 'bg-blue-500 text-white'
                  : ''
              }`}
              onClick={() => handleFilterChange(status === 'All' ? '' : status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div className="w-4/5 mx-auto mt-6">
        <div className="bg-white shadow-lg shadow-gray-400 rounded-lg">
          <div className="grid grid-cols-11 font-bold px-2 text-sm py-3 border-b border-gray-300">
            <p className="col-span-1 text-left">POID</p>
            <p className="col-span-2 text-left">Customer's Name</p>
            <p className="col-span-1 text-left">Status</p>
            <p className="col-span-3 px-1 text-left">Address</p>
            <p className="col-span-2 text-center">Date</p>
            <p className="col-span-2 text-center">Actions</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-5">
              <h2>Loading...</h2>
            </div>
          ) : (
            searchResults.map((customerData, index) => (
              <div
                key={index}
                className="grid grid-cols-11 px-2 py-2 items-center bg-white text-sm border-b border-gray-200 hover:bg-blue-50 duration-300"
              >
                <p className="col-span-1 font-bold text-left">{customerData.purchase_order_id || 'N/A'}</p>
                <p className="col-span-2 font-bold text-left">{customerData.customer_name || 'N/A'}</p>
                <p
                  className={`col-span-1 font-bold text-left ${
                    customerData.status === 'Failed'
                      ? 'text-red-500'
                      : customerData.status === 'Success'
                      ? 'text-green-500'
                      : 'text-yellow-500'
                  }`}
                >
                  {customerData.status || 'Unknown'}
                </p>
                <div className="col-span-3 text-left font-bold text-xs px-1">
                  <p>{`${customerData.street || ''}, ${customerData.barangay || ''}, ${
                    customerData.province || ''
                  }, ${customerData.city || ''}`}
                  </p>
                </div>
                <p className="col-span-2 text-center text-sm text-gray-700 ">{customerData.created_at || 'N/A'}</p>
                <div className="col-span-2 flex justify-center relative">
                  <button
                    className="bg-blue-500 px-3 py-1 duration-200 text-white hover:bg-white shadow-md hover:text-blue-500 rounded-lg font-bold mr-2"
                    onClick={() => handleCreateDeliveryClick(customerData.purchase_order_id)}
                  >
                    Create Deliveries
                  </button>
                  <div className="relative dropdown-container">
                    <button
                      className="bg-blue-500 text-white duration-200 px-3 py-1 rounded-lg font-bold shadow-md hover:bg-white hover:text-blue-500 dropdown-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropDowns((prevState) => ({
                          ...prevState,
                          [index]: !prevState[index],
                        }));
                      }}
                    >
                      More
                    </button>
                    {openDropDowns[index] && (
                      <div className="absolute left-14 top-0 w-44 bg-white border border-gray-300 rounded-lg shadow-lg z-10 dropdown-container">
                        <button
                          className="block w-full duration-200 text-left px-4 py-2 text-blue-500 font-bold hover:bg-gray-200"
                          onClick={() => {
                            setSelectedPurchaseOrderId(customerData.purchase_order_id);
                            setViewDeliveriesModalOpen(true);
                            setOpenDropDowns({});
                          }}
                        >
                          View Deliveries
                        </button>
                        <button
                          className="block w-full duration-200 text-left px-4 py-2 text-blue-500 font-bold hover:bg-gray-200"
                          onClick={() => {
                            setSelectedPurchaseOrderId(customerData.purchase_order_id);
                            setItemsOrderedModalOpen(true);
                            setOpenDropDowns({});
                          }}
                        >
                          View Ordered
                        </button>
                        <button
                          className="block w-full duration-200 text-left px-4 py-2 text-red-500 font-bold hover:bg-red-200"
                          onClick={() =>
                            handleEditPurchaseOrderClick(customerData.purchase_order_id, customerData)
                          }
                        >
                          Edit Purchase Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Confirm Edit</h3>
            <p>
              Are you sure you want to edit purchase order ID: {selectedPurchaseOrderId}? If a delivery has been made or
              deductions have been applied, you can no longer edit.
            </p>
            <p className="text-red-500 font-bold mt-4">Double-check the Purchase Order before proceeding.</p>
            <div className="flex justify-end mt-6">
              <button
                className=" bg-blue-500 text-white font-bold hover:bg-white hover:text-blue-500 duration-200 shadow-md px-4 py-2 rounded mr-2"
                onClick={() => setShowWarningModal(false)}
              >
                Cancel
              </button>
              <button className="bg-red-500 font-bold hover:bg-red-800 duration-200 text-white px-4 py-2 shadow-md rounded" onClick={proceedToEdit}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
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
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`font-bold px-3 py-1 rounded cursor-pointer duration-100 shadow-md ${
              currentPage === pageNum
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-blue-500 shadow-md hover:text-white'
            }`}
          >
            {pageNum}
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

      {/* Modals */}
      {createDeliveryModalOpen && (
        <CreateDeliveryModal
          createDeliveryModalOpen={createDeliveryModalOpen}
          closeCreateDeliveryModal={() => setCreateDeliveryModalOpen(false)}
          purchaseOrderId={selectedPurchaseOrderId}
        />
      )}
      {viewDeliveriesModalOpen && (
        <ViewDeliveriesModal
          viewDeliveriesModalOpen={viewDeliveriesModalOpen}
          onClose={() => setViewDeliveriesModalOpen(false)}
          purchaseOrderId={selectedPurchaseOrderId}
        />
      )}
      {itemsOrderedModalOpen && (
        <ItemsOrderedModal
          itemsOrderedModalOpen={itemsOrderedModalOpen}
          onClose={() => setItemsOrderedModalOpen(false)}
          purchaseOrderID={selectedPurchaseOrderId}
        />
      )}
      {editConfirmationModalOpen && (
        <EditConfirmation
          isOpen={editConfirmationModalOpen}
          onClose={() => setEditConfirmationModalOpen(false)}
          confirmationData={confirmationData}
          purchaseOrderId={selectedPurchaseOrderId}
        />
      )}
    </div>
  );
};

export default DeliveriesTab;