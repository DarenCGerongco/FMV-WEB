import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';
// import { json } from 'react-router-dom';
// import { stringify } from 'postcss';

function Order() {
  const url = import.meta.env.VITE_API_URL;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [itemsOrderedModalOpen, setItemsOrderedModalOpen] = useState(false);
  const [itemsOrdered, setItemsOrdered] = useState([]); // State for items ordered
  const [createDeliveryModalOpen, setCreateDeliveryModalOpen] = useState(false);
  const [newDeliveryModalOpen, setNewDeliveryModalOpen] = useState(false);
  const [createItemsOrderedModalOpen, setCreateItemsOrderedModalOpen] = useState(false);

  const [customerName, setCustomerName] = useState([]);

  // New state variables for Item Name, Price, and Amount
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  // State for the added items, keeping track of grouped items
  const [addedItems, setAddedItems] = useState([]);

  const [newOrder, setNewOrder] = useState({
    deliveredTo: '',
    street: '',
    city: '',
    barangay: '',
    zipcode: '',
    date: '',
    items: [],
  });

  const openAddModal = () => {
    setAddModalOpen(true);
    setNewOrder({
      deliveredTo: '',
      street: '',
      city: '',
      barangay: '',
      zipcode: '',
      date: '',
      items: [],
    });
  };

  const closeAddModal = () => setAddModalOpen(false);
  const closeViewModal = () => setViewModalOpen(false);

  const closeItemsOrderedModal = () => {
    setItemsOrdered([]); // Clear items ordered when closing the modal
    setItemsOrderedModalOpen(false);
  };

  const handleAddOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${url}/api/purchase-orders-delivery`);
        const data = await response.json();
        const names = data.map(name => name.customer_name);

        setCustomerName(names); // Update the state with customer names
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    // Fetch orders initially
    fetchOrders();

    // Set up a recurring interval to fetch the orders periodically
    const intervalId = setInterval(fetchOrders, 5000); // 10000ms = 10 seconds

    // Cleanup interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [url]); // Dependency array ensures the effect runs only when the URL changes


  const submitAddModal = async () => {
    try {
      const response = await axios.post(`${url}/api/orders`, newOrder);
      if (response.status === 201) {
        setOrders([...orders, response.data.data]);
        closeAddModal();
      } else {
        console.error('Error creating order');
      }
    } catch (error) {
      console.error('An error occurred while creating an order:', error.response.data.error);
    }
  };

  const openCreateItemsOrderedModal = () => {
    setCreateItemsOrderedModalOpen(true);
    setNewItemName(''); // Reset the input field
    setNewItemPrice(''); // Reset price
    setNewItemAmount(''); // Reset amount
  };

  const closeCreateItemsOrderedModal = () => {
    setCreateItemsOrderedModalOpen(false);
  };

  const handleItemNameChange = (e) => {
    setNewItemName(e.target.value);
  };

  const handleItemPriceChange = (e) => {
    setNewItemPrice(e.target.value);
  };

  const handleItemAmountChange = (e) => {
    setNewItemAmount(e.target.value);
  };

  const addItem = () => {
    if (newItemName && newItemPrice && newItemAmount) {
      const newItem = {
        name: newItemName,
        price: parseFloat(newItemPrice), // Ensure price is a number
        amount: parseInt(newItemAmount), // Ensure amount is a number
      };

      // Check for duplicates and update the existing item's amount
      setAddedItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(item => item.name === newItem.name);
        if (existingItemIndex !== -1) {
          // If item exists, update the amount
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].amount += newItem.amount;
          return updatedItems; // Return updated items
        } else {
          return [...prevItems, newItem]; // Add new item
        }
      });

      // Clear the input fields after adding
      setNewItemName('');
      setNewItemPrice('');
      setNewItemAmount('');
    } else {
      console.error('Please fill in all fields');
    }
  };

  const openViewModal = () => {
    setViewModalOpen(true);
  };

  const openItemsOrderedModal = () => setItemsOrderedModalOpen(true);

  const openCreateDeliveryModal = () => {
    setCreateDeliveryModalOpen(true);
  };

  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState('');

  // List of delivery men
  const deliveryMen = ['Greggy', 'Justwin', 'Arlene', 'MufFy'];

  const closeCreateDeliveryModal = () => {
    setCreateDeliveryModalOpen(false);
  };
  
  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <div className="flex flex-col w-full ml-72 bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-2xl mb-6 border">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM ORDER</h2>
        </div>
        <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg shadow-2xl">
          <div className="relative mt-4 flex items-center space-x-4">
            <div className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md shadow-2xl focus-within:border-blue-500 relative h-12">
              <span className="text-black-500 whitespace-nowrap">ORDER</span>
              <div className="border-l border-gray-300 h-10 mx-2"></div>
              <input
                type="text"
                className="flex-grow focus:outline-none px-4 py-2 rounded-md shadow-2xl sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
                placeholder="Search for Ongoing Order"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl focus:outline-none">
                Search
              </button>
            </div>
            <button
              className="bg-blue-500 text-black px-4 py-2 bg-blue-500 text-white rounded-md shadow-2xl focus:outline-none"
              onClick={openAddModal}
            >
              +
            </button>
          </div>
          <div id="order-container" className="mt-4 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between bg-white-200 p-4 rounded-lg shadow-2xl relative"
              >
                <div className="information flex">
                  <div className="font-bold">{order.deliveredTo}</div>
                  <div className="font-bold ml-5">|</div>
                  <div className="font-bold ml-5">{order.address}</div>
                  <div className="font-bold ml-5">|</div>
                  <div className="font-bold ml-5">{order.date}</div>
                </div>
                <div className="settings">
                  <div className="flex space-x-2">
                    <img
                      src="./src/assets/edit.png"
                      alt="Edit"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => console.log('Edit')}
                    />
                    <img
                      src="./src/assets/delete.png"
                      alt="Delete"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => console.log('Delete')}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      
        
        {customerName.map((name, index) => (
        <div
          key={index}
          onClick={() => handleClick(name)} // Make the div clickable
          className="w-4/5 mx-auto bg-white p-6 m-6 rounded-lg shadow-2xl mb-1 border cursor-pointer hover:bg-gray-100 transition"
        >
          <h6 className="text-1xl font-bold">
            {name}
          </h6>
        </div>
      ))}

        {/* Add Modal */}
        {addModalOpen && (
          <div
            id="addModal"
            className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
          >
            <div className="bg-white p-6 rounded-lg shadow-2xl w-1/3">
              <h3 className="text-center text-lg font-bold mb-4">Create Purchase Order</h3>
              
              {/* Delivered To Field */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  id="deliveredTo"
                  name="deliveredTo"
                  placeholder="Delivered To"
                  className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.deliveredTo}
                  onChange={handleAddOrderChange}
                />
              </div>
              
              {/* Address Fields */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    placeholder="Street"
                    className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newOrder.street}
                    onChange={handleAddOrderChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="City"
                    className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newOrder.city}
                    onChange={handleAddOrderChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="barangay"
                    name="barangay"
                    placeholder="Barangay"
                    className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newOrder.barangay}
                    onChange={handleAddOrderChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    placeholder="Zipcode"
                    className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newOrder.zipcode}
                    onChange={handleAddOrderChange}
                  />
                </div>
              </div>
              
              {/* Deadline Date Field */}
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700">Deadline Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.date}
                  onChange={handleAddOrderChange}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end p-4">
                <div className="flex flex-col items-end space-y-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl w-32"
                    onClick={openViewModal}
                  >
                    View
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-white-500 text-black px-4 py-2 border border-gray-300 rounded-md shadow-2xl w-32"
                      onClick={closeAddModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl w-32"
                      onClick={submitAddModal}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

{/* View Modal */}
{viewModalOpen && (
  <div
    id="viewModal"
    className="modal fixed top-0 right-10 w-1/4 h-full flex justify-start items-center"
  >
    <div className="bg-white p-6 rounded-lg shadow-2xl w-full">
      <div className="bg-blue-500 text-white text-center py-2 mb-4 rounded-md">
        <h3 className="text-lg font-bold">View Options</h3>
      </div>
      <ul className="list-none pl-0">
      <li
                className="mb-4 cursor-pointer hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md text-center transition-all"
                onClick={openCreateItemsOrderedModal} // Open create items ordered modal
        >
                Create items ordered
              </li>
        <li
          className="mb-4 cursor-pointer hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md text-center transition-all"
          onClick={openItemsOrderedModal} // Open items ordered modal
        >
          View items ordered
        </li>
        <li className="mb-4">
          <button
            className="bg-blue-500 text-white w-full hover:bg-blue-700 px-4 py-2 rounded-md transition-all"
            onClick={openCreateDeliveryModal} // Function to open create delivery modal
          >
            Create deliveries
          </button>
        </li>

        <li className="mb-4 cursor-pointer hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md text-center transition-all">
          View Deliveries
        </li>
     
      </ul>
      <div className="flex justify-end p-4">
        <button
          className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md shadow-2xl w-32 transition-all"
          onClick={closeViewModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


{createItemsOrderedModalOpen && (
        <div className="modal fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-1/2">
            <h3 className="text-lg font-bold text-center mb-4">Create Items Ordered</h3>
            <div className="flex items-center justify-center space-x-2">
              {/* Price input */}
              <input
                type="text"
                value={newItemPrice}
                onChange={handleItemPriceChange}
                placeholder="Price"
                className="border border-gray-300 p-2 rounded-md w-1/6"
              />
              {/* Item Name input */}
              <input
                type="text"
                value={newItemName}
                onChange={handleItemNameChange}
                placeholder="Item Name"
                className="border border-gray-300 p-2 rounded-md w-1/2 text-center"
              />
              {/* Amount input */}
              <input
                type="text"
                value={newItemAmount}
                onChange={handleItemAmountChange}
                placeholder="Amount"
                className="border border-gray-300 p-2 rounded-md w-1/6"
              />
              {/* Add Item button */}
              <button
                className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md ml-2"
                onClick={addItem}
              >
                Add 
              </button>
            </div>

            {/* Container for added items */}
            <div className="mt-6">
              {addedItems.length > 0 && (
                <div className="border-t border-gray-300 pt-2">
                  {addedItems.map((item, index) => (
                    <div key={index} className="flex justify-between border-b border-gray-300 py-2">
                      <span>{item.price}</span>
                      <span>{item.name}</span>
                      <span>x{item.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              {/* Create button */}
              <button
                className="bg-blue-600 text-white hover:bg-green-700 px-4 py-2 rounded-md mr-2"
                onClick={() => {
                  // Move items to itemsOrdered
                  if (addedItems.length > 0) {
                    setItemsOrdered((prev) => [...prev, ...addedItems]); // Add addedItems to itemsOrdered
                    setAddedItems([]); // Clear addedItems after creating
                    closeCreateItemsOrderedModal(); // Close the modal
                    openItemsOrderedModal(); // Open Items Ordered Modal
                  }
                }}
              >
                Create
              </button>
              
              <button
                className="bg-gray-500 text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                onClick={closeCreateItemsOrderedModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

     {/* Items Ordered Modal */}
{itemsOrderedModalOpen && (
  <div
    id="itemsOrderedModal"
    className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
  >
    <div className="bg-white p-6 rounded-lg shadow-2xl w-1/3">
      <h3 className="text-center text-lg font-bold mb-5">Items Ordered</h3>
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        {itemsOrdered.length === 0 ? (
          <div className="text-center text-gray-500">No items ordered.</div>
        ) : (
          <div className="flex flex-col">
            {itemsOrdered.map((item, index) => (
              <div key={index} className="border-b border-gray-300 pb-2 mb-2 flex justify-between items-start">
                <div className="flex flex-col">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-gray-500">Amount: {item.amount}</p> {/* Amount below item name */}
                </div>
                <p className="ml-4">Price: {item.price}</p> {/* Price on the right */}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md"
          onClick={closeItemsOrderedModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}





 {/* Create Delivery Modal */}
    {createDeliveryModalOpen && (
      <div
        id="createDeliveryModal"
        className="modal fixed inset-0 flex justify-center items-center z-50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Optional: adds a semi-transparent background
      >
        <div className="bg-white p-6 rounded-lg shadow-2xl w-2/4"> {/* Modal width */}
          <div className="bg-blue-600 text-white text-center py-2 mb-4 rounded-md">
            <h3 className="text-lg font-bold">Create Delivery</h3>
          </div>
          <form>
            {/* Input fields for creating a delivery */}
            <div className="mb-4">
              <input
                type="text"
                id="deliveredTo"
                className="border border-gray-300 p-2 w-full rounded-md"
                placeholder="Delivered to"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  placeholder="Str."
                />
              </div>
              <div>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  placeholder="City"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  placeholder="Barangay"
                />
              </div>
              <div>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  placeholder="Zipcode"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="deliveryDate"></label>
              <input
                type="text"
                id="deliveryDate"
                className="border border-gray-300 p-2 w-full rounded-md"
                placeholder="Enter delivery date"
              />
            </div>

            {/* Delivery Man Section with scrollable fixed container */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold" htmlFor="deliveryMan">Delivery Man:</label>
              <div className="border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto"> {/* Fixed container */}
                <div className="flex flex-col space-y-2">
                  {deliveryMen.map((man) => (
                    <div
                      key={man}
                      className={`p-2 cursor-pointer rounded-md ${selectedDeliveryMan === man ? 'bg-blue-200' : ''}`}
                      onClick={() => setSelectedDeliveryMan(man)} // Click to select delivery man
                    >
                      {man}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Item Section */}
            <div className="mb-4 flex items-center">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
                placeholder="Add Item"
              />
              <button
                type="button"
                className="bg-blue-600 text-white hover:bg-blue-500 px-3 py-2 rounded-md ml-2"
                onClick={() => {}}
              >
                Add
              </button>

            </div>
            <div className="flex mt-20 justify-end space-x-2">
              <button
                className="bg-gray-500 text-white hover:bg-gray-700 px-3 py-1 rounded-md shadow-2xl transition-all"
                onClick={closeCreateDeliveryModal}  >
                Close
              </button>

              <button
                type="button"
                className="bg-blue-600 text-white hover:bg-blue-500 px-3 py-1 rounded-md shadow-2xl transition-all"
                onClick={() => {
                  closeCreateDeliveryModal(); // Close the current modal
                  setNewDeliveryModalOpen(true); // Open the new modal
                }}
              >
                Create Delivery
              </button>
            </div>
          </form>
    </div>
  </div>
)}


{/* New Delivery Modal */ }
{newDeliveryModalOpen && (
  <div
    id="newDeliveryModal"
    className="modal fixed inset-0 flex justify-center items-center z-50"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
  >
    <div className="bg-white p-6 rounded-lg shadow-2xl w-2/4">
      <div className="bg-blue-600 text-white text-center py-2 mb-4 rounded-md">
        <h3 className="text-lg font-bold">New Delivery Created</h3>
      </div>

      {/* Delivery Details */}
      <div className="mb-4">
        <p><strong>Delivered to:</strong> Barangay Lumbia</p>
      </div>
      <div className="mb-4">
        <p><strong>Address:</strong> Materson ave, Lumbia, Cagayan de Oro City, 9000</p>
      </div>
      <div className="mb-4">
        <p><strong>Date Delivered:</strong> 06/04/24</p>
      </div>
      <div className="mb-4">
        <p><strong>Delivery Man:</strong> Daren Rebote</p>
      </div>

      {/* Items Ordered Container */}
      <div className="mb-6 p-4 bg-gray-100 rounded-md shadow-md">
        <div className="flex justify-between">
          <span className="font-bold">₱ 1500</span>
          <span className="font-bold">Submersible Pump</span>
          <span className="font-bold">x5</span>
        </div>
      </div>

      {/* Cancel and Save Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          className="bg-gray-500 text-white hover:bg-gray-700 px-4 py-2 rounded-md shadow-2xl transition-all"
          onClick={() => setNewDeliveryModalOpen(false)} // Cancel button to close the modal
        >
          Cancel
        </button>

        <button
          className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-md shadow-2xl transition-all"
          onClick={() => {
            // Save logic here
            setNewDeliveryModalOpen(false); // You can also close the modal after saving if needed
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default Order;