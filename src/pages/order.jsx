import { useState } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';

function Order() {
  const url = import.meta.env.VITE_API_URL;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);

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

  const handleAddOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
                  onClick={() => console.log('View')}
                >
                View
                </button>               
                <div className="flex items-center space-x-2">
                  <button
                  className="bg-white-500 text-black px-4 py-2 rounded-md shadow-2xl w-32"
                  onClick={closeAddModal}
                >
                Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl w-32"
                  onClick={submitAddModal}
                >
                Create
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>       
        )}
      </div>
    </div>
  );
}
export default Order;