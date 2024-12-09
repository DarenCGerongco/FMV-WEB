import React, { useState, useEffect, useRef, useContext } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';
import { GlobalContext } from '../../GlobalContext';
import { useNavigate } from 'react-router-dom';

import CreateDeliveryModal from './order/modals/createdeliverymodal';
import ViewDeliveriesModal from './order/modals/viewdeliveriesmodal';
import ItemsOrderedModal from './order/modals/viewitemsorderedmodal';
import QuickButtons from '../components/quickButtons';

import DeliveriesTab from './order/components/deliveriesTab';
import WalkinTab from './order/components/WalkinTab';


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


  const [deliveriesData, setDeliveriesData] = useState([]);
  const [deliveriesPagination, setDeliveriesPagination] = useState({});
  const [walkinsData, setWalkinsData] = useState([]);
  const [walkinsPagination, setWalkinsPagination] = useState({});
  const [walkinsSearchInput, setWalkinsSearchInput] = useState('');
  const [walkinsSearchResults, setWalkinsSearchResults] = useState([]);
  
  // Tabs
  const [activeTab, setActiveTab] = useState('Deliveries');

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
// Fetch Deliveries
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
    setDeliveriesData(combinedData);
    setSearchResults(combinedData); // Deliveries-specific search
    setDeliveriesPagination(data.pagination);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    setLoading(false);
  }
};

// Fetch Walk-ins
const fetchWalkins = async (page = 1) => {
  setLoading(true);
  try {
    const response = await axios.get(`${url}/api/purchase-orders/walk-in?page=${page}`);
    const data = response.data;
    console.log(data);
    const combinedData = data.data.map(order => ({
      purchase_order_id: order.id,
      customer_name: order.customer_name,
      status: order.status === 'P' ? 'Pending' : order.status === 'F' ? 'Failed' : 'Success',
      street: order.street,
      city: order.city,
      barangay: order.barangay,
      province: order.province,
      created_at: order.created_at,
    }));
    setWalkinsData(combinedData);
    setWalkinsSearchResults(combinedData); // Walk-in-specific search
    setWalkinsPagination({
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

    
    // Add a pagination handler for Walk-in
    const handleWalkinPageChange = (page) => {
      fetchWalkins(page);
    };
    

    fetchWalkins();
    fetchOrders();
  }, [url, currentPage]);
// Deliveries Pagination
const handleDeliveriesPageChange = (page) => {
  setCurrentPage(page); // For Deliveries
  fetchOrders(page);
};

// Walk-ins Pagination
const handleWalkinsPageChange = (page) => {
  fetchWalkins(page); // For Walk-ins
};

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

// Search for Deliveries
const handleSearchChange = (event) => {
  const input = event.target.value;
  setSearchInput(input);

  if (input.trim() === "") {
    setSearchResults(deliveriesData);
  } else {
    const filteredResults = deliveriesData.filter((order) =>
      order.customer_name.toLowerCase().includes(input.toLowerCase())
    );
    setSearchResults(filteredResults);
  }
};

// Search for Walk-ins
const handleWalkinsSearchChange = (event) => {
  const input = event.target.value;
  setWalkinsSearchInput(input);

  if (input.trim() === "") {
    setWalkinsSearchResults(walkinsData);
  } else {
    const filteredResults = walkinsData.filter((order) =>
      order.customer_name.toLowerCase().includes(input.toLowerCase())
    );
    setWalkinsSearchResults(filteredResults);
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
        <div className="w-4/5 mx-auto p-6 m-3 rounded-lg mb-6 bg-white shadow-lg shadow-gray-400">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM ORDER</h2>
        </div>
        {/* Tabs */}
        <div className="w-4/5 mx-auto flex justify-center border-b">
          <button
            className={`p-2 font-bold ${
              activeTab === 'Deliveries' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('Deliveries')}
          >
            Deliveries
          </button>
          <button
            className={`p-2 font-bold ${
              activeTab === 'Walk-in' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('Walk-in')}
          >
            Walk-in
          </button>
        </div>
        {/* Tabs */}
          <div className="mt-6">
          {activeTab === 'Deliveries' && (
            <DeliveriesTab
              loading={loading}
              searchInput={searchInput}
              handleSearchChange={handleSearchChange}
              searchResults={searchResults}
              paginationInfo={deliveriesPagination}
              handlePageChange={handleDeliveriesPageChange}
              // Other props...
            />
          )}
          {activeTab === 'Walk-in' && (
            <WalkinTab
              loading={loading}
              searchInput={walkinsSearchInput}
              handleSearchChange={handleWalkinsSearchChange}
              searchResults={walkinsSearchResults}
              paginationInfo={walkinsPagination}
              handlePageChange={handleWalkinsPageChange}
              // Other props...
            />
          )}
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
