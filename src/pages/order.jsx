import React, { useState, useEffect, useRef, useContext } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';
import { GlobalContext } from '../../GlobalContext';
import { useNavigate } from 'react-router-dom';

import CreateDeliveryModal from './order/modals/createdeliverymodal';
import ViewDeliveriesModal from './order/modals/viewdeliveriesmodal';
import ItemsOrderedModal from './order/modals/itemsorderedmodal';

function Order() {
  const navigate = useNavigate(); // Initialize navigate
  const url = import.meta.env.VITE_API_URL;
  const { id: userID, setID } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true); // Initialize loading state


  const [orders, setOrders] = useState([]);
  const [itemsOrderedModalOpen, setItemsOrderedModalOpen] = useState(false);
  const [createDeliveryModalOpen, setCreateDeliveryModalOpen] = useState(false);
  const [newDeliveryModalOpen, setNewDeliveryModalOpen] = useState(false);
  const [productsListed, setProductsListed] = useState([]);
  const [viewDeliveriesModalOpen, setViewDeliveriesModalOpen] = useState(false);
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = useState(null);
  const [openDropDowns, setOpenDropDowns] = useState({});
  const [selectedItemsOrderId, setSelectedItemsOrderId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({});

  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState({
    customer_name: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipcode: ''
  });


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

  

  // Fetch purchase orders with a 5-second delay
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/api/purchase-orders-delivery?page=${currentPage}`);
        const data = response.data;
        const combinedData = data.orders.map(order => ({
          purchase_order_id: order.purchase_order_id,
          customer_name: order.customer_name,
          street: order.address.street,
          city: order.address.city,
          barangay: order.address.barangay,
          province: order.address.province,
          created_at: order.created_at,
        }));
        setPurchaseOrderData(combinedData);
        setSearchResults(combinedData);
        setPaginationInfo(data.pagination);

        setTimeout(() => setLoading(false), 1000); // Delay display for 5 seconds
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
  // Render pagination controls
  const renderPaginationControls = () => {
    const { currentPage, lastPage } = paginationInfo;
    const totalPages = Math.min(lastPage, Math.ceil(searchResults.length / paginationInfo.perPage));
  
    return (
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`font-bold px-3 py-1 rounded shadow-md ${
            currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-blue-500 hover:text-white"
          }`}
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`font-bold px-3 py-1 rounded shadow-md ${
            currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-blue-500 hover:text-white"
          }`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`font-bold px-3 py-1 rounded cursor-pointer duration-100 shadow-md ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white hover:bg-blue-500 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`font-bold px-3 py-1 rounded shadow-md ${
            currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-blue-500 hover:text-white"
          }`}
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`font-bold px-3 py-1 rounded shadow-md ${
            currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-blue-500 hover:text-white"
          }`}
        >
          Last
        </button>
      </div>
    );
  };

  //! YAW SA HILABTI NI DIRE 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${url}/api/purchase-orders-delivery?page=${currentPage}`);
        const data = await response.json();
  
        // Assuming the data is structured with `orders` and `pagination` keys after modifying the backend
        const combinedData = data.orders.map(order => ({
          purchase_order_id: order.purchase_order_id,
          customer_name: order.customer_name,
          street: order.address.street,
          city: order.address.city,
          barangay: order.address.barangay,
          province: order.address.province,
          created_at: order.created_at,
        }));
  
        setPurchaseOrderData(combinedData);
        setSearchResults(combinedData); // Initialize or update search results with the fetched data
        setPaginationInfo(data.pagination); // Store pagination details
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
  
    fetchOrders();
    const intervalId = setInterval(() => fetchOrders(), 10000); // Optionally update to only refetch if needed
    return () => clearInterval(intervalId);
  }, [url, currentPage]); // Depend on currentPage to refetch when it changes
  
  //! YAW SA HILABTI NI DIRE 
    // Function to delete a product
    const handleDeleteProduct = (product_id) => {
      const updatedProducts = productsListed.filter(
        (item) => item.product_id !== product_id
      );
      setProductsListed(updatedProducts); // Update the state without the deleted product
    };


  // Fetch available products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/api/products`);
        setProducts(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
  
    // Function to save products
    const handleSave = () => {
      // Update the purchaseOrderDetails state to include the listed products
      setPurchaseOrderDetails((prevDetails) => ({
        ...prevDetails,
        products: productsListed, // Add the products listed into purchase order details
      }));
      setCreateItemsOrderedModalOpen(false);   
    };
    

  // END BY SHOWING IT IN MODAL


// END Create Items Ordered AREA


// Items Ordered Modal
const openItemsOrderedModal = (purchaseOrderId) => {
  // console.log(purchaseOrderId);
  setSelectedItemsOrderId(purchaseOrderId); // Set the selected Purchase Order ID
  setItemsOrderedModalOpen(true); // Open the modal

};const closeItemsOrderedModal = () => {
  setItemsOrderedModalOpen(false);
};

// Create Delivery Modal
const openCreateDeliveryModal = (purchaseOrderId) => {
  setSelectedPurchaseOrderId(purchaseOrderId); // Set the selected ID
  setCreateDeliveryModalOpen(true);
};

const closeCreateDeliveryModal = () => {
  setCreateDeliveryModalOpen(false);
};

// View Deliveries Modal
const openViewDeliveriesModal = (purchaseOrderId) => {
  console.log("Setting selectedPurchaseOrderId:", purchaseOrderId); // Check if purchaseOrderId is correct
  setSelectedPurchaseOrderId(purchaseOrderId); // Set the selectedPurchaseOrderId
  setViewDeliveriesModalOpen(true); // Open the modal after setting the ID
};

const closeViewDeliveriesModal = () => setViewDeliveriesModalOpen(false);

// VIEW - 
  const dropDownRef = useRef(null);

  const toggleDropDown = (id) => {
    setOpenDropDowns((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // const toggleDropDown = () => {
  //   setViewDropDown(!viewDropDown);
  // };

      // Close dropdown when clicking outside
        useEffect(() => {
          const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
              setOpenDropDowns({}); // Close all dropdowns when clicked outside
            }
          };
          document.addEventListener('mousedown', handleClickOutside);

          return () => {
            document.removeEventListener('mousedown', handleClickOutside);
          };
        }, []);
// VIEW

const handleSearchChange = (event) => {
  const input = event.target.value;
  setSearchInput(input);

  if (input.trim() === "") {
    // Reset to full results if search input is empty
    setSearchResults(purchaseOrderData);
    setPaginationInfo((prev) => ({
      ...prev,
      lastPage: Math.ceil(purchaseOrderData.length / prev.perPage),
    }));
  } else {
    // Filter results based on search query
    const filteredResults = purchaseOrderData.filter((order) =>
      order.customer_name.toLowerCase().includes(input.toLowerCase())
    );
    setSearchResults(filteredResults);

    // Dynamically adjust pagination for search results
    setPaginationInfo((prev) => ({
      ...prev,
      lastPage: Math.ceil(filteredResults.length / prev.perPage),
    }));
  }
};


return (
    <div className="flex w-full bg-white">
      <Navbar />
      <div className="flex flex-col w-full bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg drop-shadow-md mb-6 border">
          <h2 
            className="text-1xl font-bold"
          >
          MANAGEMENT SYSTEM ORDER
          </h2>
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
                value={searchInput} // Bind search input to state
                onChange={handleSearchChange} // Trigger live search
              />
            </div>
            <button
              className="bg-blue-500 w-[15%] shadow-md font-bold text-black px-4 py-2 bg-blue-500 hover:bg-white hover:text-blue-500 duration-300 hover:text text-white rounded-md focus:outline-none"
              onClick={createDeliveryPage}
            >
              Create Order
            </button>
          </div>
          <div>
            <span>
              filter:
            </span>
          </div>
        </div>
  
      {/* START SHOW PURCHASE ORDERS */}
      <div className="w-4/5 mx-auto mt-6">
        {/* White background container */}
        <div className="bg-white p-2 rounded-lg shadow-xl">
          {/* Header */}
          <div 
          className="grid grid-cols-[0.5fr_1.5fr_2fr_1fr_1fr] font-bold px-4 py-2 text-sm "
          >
            <p>
              POID
            </p>
            <p>
              Customer's Name
            </p>
            <p>
              Address
            </p>
            <p>
              Date
            </p>
            <p>
              Actions
            </p>
          </div>
          {/* Header */}

          {loading ? (
            <div className='flex justify-center'>
                <h2>Loading...</h2>
              <div className="spinner">
                {/* Spinner animation */}              
              </div>  
            </div>
          ) : (
            searchResults.map((customerData, index) => (
              <div
                key={index}
                className="grid grid-cols-[0.5fr_1.5fr_2fr_1fr_1fr] items-center bg-white px-4 py-2 text-sm rounded-lg shadow-md mb-1 hover:bg-blue-100 duration-300 border-b"
              >
                <p className="text-1xl text-left">{customerData.purchase_order_id}</p>
                <p className="text-1xl text-left">{customerData.customer_name}</p>
                <div className="text-sm text-left px-2">
                  <p>{customerData.street} {customerData.barangay} {customerData.province} {customerData.city}</p>
                </div>
                <p className="text-sm text-gray-700 text-left">
                  {customerData.created_at}
                </p>
                <div className="flex space-x-2 justify-center">
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
                    View
                  </button>

                  {openDropDowns[customerData.purchase_order_id] && (
                    <div
                      ref={dropDownRef}
                      className="absolute mt-10 w-48 bg-white border border-gray-300 right-[60px] rounded shadow-lg z-50"
                    >
                      <ul className="py-1">
                        <li
                          className="px-4 p-1 hover:bg-gray-200 duration-300 cursor-pointer"
                          onClick={() => {
                            openItemsOrderedModal(customerData.purchase_order_id);
                            setOpenDropDowns({ ...openDropDowns, [customerData.purchase_order_id]: false });
                          }}
                        >
                          View Items Ordered
                        </li>
                        <li
                          className="px-4 p-1 hover:bg-gray-200 duration-300 cursor-pointer"
                          onClick={() => {
                            openViewDeliveriesModal(customerData.purchase_order_id);
                            setOpenDropDowns({ ...openDropDowns, [customerData.purchase_order_id]: false });
                          }}
                        >
                          View Deliveries
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

        {/* Pagination Controls */}
        <div className="flex justify-center w-full bg-red space-x-2 my-4">
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
      {/* END SHOW PURCHASE ORDERS */}

 
      
       {/*View Items ordered Modal*/}
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