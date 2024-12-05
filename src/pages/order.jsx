import React, { useState, useEffect, useRef, useContext } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';
import { GlobalContext } from '../../GlobalContext';
import { useNavigate } from 'react-router-dom';

import CreateDeliveryModal from './order/modals/createdeliverymodal';
import ViewDeliveriesModal from './order/modals/viewdeliveriesmodal';
import ItemsOrderedModal from './order/modals/viewitemsorderedmodal';
import QuickButtons from '../components/quickButtons';

function Order() {
  const navigate = useNavigate(); // Initialize navigate
  const url = import.meta.env.VITE_API_URL;
  const { id: userID, setID } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true); // Initialize loading state

  const [itemsOrderedModalOpen, setItemsOrderedModalOpen] = useState(false);
  const [createDeliveryModalOpen, setCreateDeliveryModalOpen] = useState(false);
  const [newDeliveryModalOpen, setNewDeliveryModalOpen] = useState(false);
  const [viewDeliveriesModalOpen, setViewDeliveriesModalOpen] = useState(false);
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = useState(null);
  const [openDropDowns, setOpenDropDowns] = useState({});
  const [selectedItemsOrderId, setSelectedItemsOrderId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [statusFilter, setStatusFilter] = useState("");

  const [confirmEditModalOpen, setConfirmEditModalOpen] = useState(false);
  const [purchaseOrderToEdit, setPurchaseOrderToEdit] = useState(null);
  

  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState({
    customer_name: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipcode: ''
  });

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    if (status === "") {
      setSearchResults(purchaseOrderData);
    } else {
      setSearchResults(purchaseOrderData.filter((order) => order.status === status));
    }
  };

  // Ensure userID is set
  useEffect(() => {
    if (!userID) {
      const storedID = localStorage.getItem('userID');
      if (storedID) {
        setID(storedID);
      }
    } else {
      localStorage.setItem('userID', userID);
    }
  }, [userID, setID]);

  const createDeliveryPage = () => {
    navigate('/order/create-delivery');
  };

  // Fetch purchase orders with a delay
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/purchase-orders-delivery?page=${currentPage}`);
        const data = response.data;
        const combinedData = data.orders.map(order => ({
          purchase_order_id: order.purchase_order_id,
          customer_name: order.customer_name,
          status: order.status === 'P' ? 'Pending' : order.status === 'F' ? 'Failed' : 'Success',
          street: order.address.street,
          city: order.address.city,
          barangay: order.address.barangay,
          province: order.address.province,
          created_at: order.created_at,
        }));
        setPurchaseOrderData(combinedData);
        setSearchResults(combinedData);
        setPaginationInfo(data.pagination);

        setTimeout(() => setLoading(false), 20); // Delay display for a smoother transition
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [url, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    const input = event.target.value;
    setSearchInput(input);

    if (input.trim() === "") {
      setSearchResults(purchaseOrderData);
      setPaginationInfo((prev) => ({
        ...prev,
        lastPage: Math.ceil(purchaseOrderData.length / prev.perPage),
      }));
    } else {
      const filteredResults = purchaseOrderData.filter((order) =>
        order.customer_name.toLowerCase().includes(input.toLowerCase())
      );
      setSearchResults(filteredResults);
      setPaginationInfo((prev) => ({
        ...prev,
        lastPage: Math.ceil(filteredResults.length / prev.perPage),
      }));
    }
  };

  const openItemsOrderedModal = (purchaseOrderId) => {
    setSelectedItemsOrderId(purchaseOrderId);
    setItemsOrderedModalOpen(true);
  };

  const closeItemsOrderedModal = () => {
    setItemsOrderedModalOpen(false);
  };

  const openCreateDeliveryModal = (purchaseOrderId) => {
    setSelectedPurchaseOrderId(purchaseOrderId);
    setCreateDeliveryModalOpen(true);
  };

  const closeCreateDeliveryModal = () => {
    setCreateDeliveryModalOpen(false);
  };

  const openViewDeliveriesModal = (purchaseOrderId) => {
    setSelectedPurchaseOrderId(purchaseOrderId);
    setViewDeliveriesModalOpen(true);
  };

  const closeViewDeliveriesModal = () => setViewDeliveriesModalOpen(false);

  const dropDownRef = useRef(null);

  const toggleDropDown = (id) => {
    setOpenDropDowns((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setOpenDropDowns({});
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full bg-white">
      <Navbar/>
      <QuickButtons/>
      <div className="flex flex-col w-full bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg drop-shadow-md mb-6 border">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM ORDER</h2>
        </div>
        <div className="w-4/5 mx-auto bg-white p-3 rounded-lg drop-shadow-md">
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
              className="w-[15%] shadow-md font-bold px-4 py-2 bg-blue-500 hover:bg-white hover:text-blue-500 duration-300 text-white rounded-md focus:outline-none"
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
          <div className="bg-white rounded-lg shadow-xl">
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
              searchResults.map((customerData, index) => (
                <div
                  key={index}
                  className="grid grid-cols-11 px-2 py-2 items-center bg-white text-sm border-b border-gray-200 hover:bg-blue-50 duration-300"
                >
                  <p className="col-span-1 font-bold text-left">{customerData.purchase_order_id}</p>
                  <p className="col-span-2 font-bold text-left">{customerData.customer_name}</p>
                  <p
                    className={`col-span-1 font-bold text-left ${
                      customerData.status === 'Failed' ? 'text-red-500 ' :
                      customerData.status === 'Success' ? 'text-green-500' :
                      customerData.status === 'Pending' ? 'text-yellow-500' :
                      'text-gray-900'
                    }`}
                  >
                    {customerData.status}
                  </p>             
                  <div className="col-span-3 text-left font-bold text-xs px-1">
                    <p>{`${customerData.street}, ${customerData.barangay}, ${customerData.province}, ${customerData.city}`}</p>
                  </div>
                  <p className="col-span-2 text-left text-sm text-gray-700">{customerData.created_at}</p>
                  <div className="col-span-2 flex space-x-2 justify-center">
                    <button
                      className="bg-blue-500 p-1 hover:bg-white hover:text-blue-500 font-bold duration-300 text-white rounded-md w-[150px]"
                      onClick={() => openCreateDeliveryModal(customerData.purchase_order_id)}
                    >
                      Create Deliveries
                    </button>
                    <button
                      className="bg-blue-500 p-1 hover:bg-white hover:text-blue-500 font-bold duration-300 text-white rounded-md w-[75px]"
                      onClick={() => toggleDropDown(customerData.purchase_order_id)}
                    >
                      More
                    </button>

                    {openDropDowns[customerData.purchase_order_id] && (
                      <div
                        ref={dropDownRef}
                        className="absolute mt-0 w-1/8 bg-white border border-gray-300 right-[10px] rounded shadow-lg z-50"
                        >
                        <ul className="py-1">
                          <li
                            className="px-4 p-1 hover:bg-blue-500 hover:text-white font-bold duration-300 cursor-pointer"
                            onClick={() => {
                              openItemsOrderedModal(customerData.purchase_order_id);
                              setOpenDropDowns({ ...openDropDowns, [customerData.purchase_order_id]: false });
                            }}
                          >
                            View Items Ordered
                          </li>
                          <li
                            className="px-4 p-1 hover:bg-blue-500 hover:text-white font-bold duration-300 cursor-pointer"
                            onClick={() => {
                              openViewDeliveriesModal(customerData.purchase_order_id);
                              setOpenDropDowns({ ...openDropDowns, [customerData.purchase_order_id]: false });
                            }}
                          >
                            View Deliveries
                          </li>
                          <li
                            className="px-4 p-1 bg-white text-red-500 font-bold hover:bg-red-500 hover:text-white duration-300 cursor-pointer"
                            onClick={() => {
                              setPurchaseOrderToEdit(customerData.purchase_order_id);
                              setConfirmEditModalOpen(true);
                              setOpenDropDowns({ ...openDropDowns, [customerData.purchase_order_id]: false });
                            }}
                          >
                            Edit
                          </li>

                          <li
                            className="px-4 p-1 bg-white text-red-500 font-bold hover:bg-red-500 hover:text-white duration-300 cursor-pointer"
                            onClick={() => {
                              openViewDeliveriesModal(customerData.purchase_order_id);
                              setOpenDropDowns({ ...openDropDowns, [customerData.purchase_order_id]: false });
                            }}
                          >
                            Cancel Order
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {confirmEditModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
                <div className="flex flex-row">
                <h3 className="text-lg font-bold mb-4 mr-1">Confirm Edit </h3>
                <h3 className="text-lg font-bold mb-4 text-red-500">!!Warning!!</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Are you sure you want to edit purchase order ID: {purchaseOrderToEdit}? Products that have a record of delivery or has been deducted because of deliveries cannot be edited anymore.
                </p>
                <p className="text-red-700 mb-4 font-bold ">
                  Note: Please double check the Purchase Order Issued by the Customer before proceeding!
                </p>

                <div className="flex justify-end space-x-4">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-md font-bold hover:bg-white hover:text-black border shadow-md duration-200"
                    onClick={() => setConfirmEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500  text-white rounded-md hover:bg-white hover:text-red-500 shadow-md border font-bold duration-200"
                    onClick={() => {
                      setConfirmEditModalOpen(false);
                      navigate(`/order/edit/${purchaseOrderToEdit}`);
                    }}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          )}
        {/* Pagination Controls */}
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
              className={`font-bold px-3 py-1 rounded cursor-pointer duration-100 shadow-md ${paginationInfo.currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-500 shadow-md hover:text-white'}`}
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

      {/* View Items Ordered Modal */}
      {itemsOrderedModalOpen && (
        <ItemsOrderedModal
          itemsOrderedModalOpen={itemsOrderedModalOpen}
          onClose={closeItemsOrderedModal}
          purchaseOrderID={selectedItemsOrderId}
        />
      )}

      {/* Create Delivery Modal */}
      {createDeliveryModalOpen && (
        <CreateDeliveryModal
          createDeliveryModalOpen={createDeliveryModalOpen}
          closeCreateDeliveryModal={closeCreateDeliveryModal}
          setNewDeliveryModalOpen={setNewDeliveryModalOpen}
          purchaseOrderId={selectedPurchaseOrderId}
        />
      )}

      {/* View Deliveries Modal */}
      <ViewDeliveriesModal
        onClose={closeViewDeliveriesModal}
        viewDeliveriesModalOpen={viewDeliveriesModalOpen}
        purchaseOrderId={selectedPurchaseOrderId}
      />
    </div>
  );
}

export default Order;
