import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';

function Order() {
  const url = import.meta.env.VITE_API_URL;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  const [newOrder, setNewOrder] = useState({
    deliveredTo: '',
    address: '',
    date: '',
    items: [],
  });

  const [editOrder, setEditOrder] = useState({
    id: '',
    deliveredTo: '',
    address: '',
    date: '',
    items: [],
  });

  // Fetching orders on component mount
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get(`${url}/api/orders`);
//         setOrders(response.data.data);
//       } catch (error) {
//         console.error('An error occurred while fetching orders:', error);
//       }
//     };

//     fetchOrders();
//   }, []);

  const openAddModal = () => {
    setAddModalOpen(true);
    setNewOrder({
      deliveredTo: '',
      address: '',
      date: '',
      items: [],
    });
  };

  const closeAddModal = () => setAddModalOpen(false);

  const openEditModal = (id) => {
    const order = orders.find((ord) => ord.id === id);
    if (order) {
      setEditModalOpen(true);
      setEditOrder({
        id: order.id,
        deliveredTo: order.deliveredTo,
        address: order.address,
        date: order.date,
        items: order.items,
      });
    }
  };

  const closeEditModal = () => setEditModalOpen(false);

  const handleAddOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditOrderChange = (e) => {
    const { name, value } = e.target;
    setEditOrder((prev) => ({
      ...prev,
      [name]: value
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

  const submitEditModal = async () => {
    try {
      const response = await axios.put(`${url}/api/orders/${editOrder.id}`, editOrder);
      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === editOrder.id ? response.data.data : order
          )
        );
        closeEditModal();
      } else {
        console.error('Error updating order');
      }
    } catch (error) {
      console.error('An error occurred while updating the order:', error.response.data.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await axios.delete(`${url}/api/orders/${id}`);
        if (response.status === 200) {
          setOrders(orders.filter((order) => order.id !== id));
        } else {
          console.error('Failed to delete the order');
        }
      } catch (error) {
        console.error('An error occurred while deleting the order:', error.response.data.error);
      }
    }
  };

  return (
    <div className="flex w-full bg-white">
      <Navbar/>
      <div className="flex flex-col w-full ml-72 bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM ORDER</h2>
        </div>
        <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg shadow-xl">
          <div className="relative mt-4 flex items-center space-x-4">
            <div className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md shadow-xl focus-within:border-blue-500 relative h-12">
              <span className="text-black-500 whitespace-nowrap">ORDER</span>
              <div className="border-l border-gray-300 h-10 mx-2"></div>
              <input
                type="text"
                className="flex-grow focus:outline-none px-4 py-2 rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
                placeholder="Search for Ongoing Order"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md focus:outline-none">
                Search
              </button>
            </div>
            <button
              className="bg-blue-500 text-black px-4 py-2 bg-blue-500 text-white rounded-md shadow-md focus:outline-none"
              onClick={openAddModal}
            >
              +
            </button>
          </div>
          <div id="order-container" className="mt-4 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between bg-white-200 p-4 rounded-lg shadow-lg relative"
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
                      onClick={() => openEditModal(order.id)}
                    />
                    <img
                      src="./src/assets/delete.png"
                      alt="Delete"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => handleDelete(order.id)}
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
            {/* <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
              <h3 className="text-center text-lg font-bold mb-4">Create Purchase Order</h3>
              <div className="mb-4">
                <label htmlFor="deliveredTo" className="block text-gray-700">Delivered To:</label>
                <input
                  type="text"
                  id="deliveredTo"
                  name="deliveredTo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newOrder.deliveredTo}
                  onChange={handleAddOrderChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newOrder.address}
                  onChange={handleAddOrderChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newOrder.date}
                  onChange={handleAddOrderChange}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md"
                  onClick={closeAddModal}
                >
                  Close
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
                  onClick={submitAddModal}
                >
                  Create
                </button>
              </div>
            </div> */}
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div
            id="editModal"
            className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
              <h3 className="text-lg font-bold mb-4">Edit Order</h3>
              <div className="mb-4">
                <label htmlFor="deliveredTo" className="block text-gray-700">Delivered To:</label>
                <input
                  type="text"
                  id="deliveredTo"
                  name="deliveredTo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editOrder.deliveredTo}
                  onChange={handleEditOrderChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editOrder.address}
                  onChange={handleEditOrderChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editOrder.date}
                  onChange={handleEditOrderChange}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md"
                  onClick={closeEditModal}
                >
                  Close
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
                  onClick={submitEditModal}
                >
                  Update
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
