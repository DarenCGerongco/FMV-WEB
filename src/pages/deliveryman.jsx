import React, { useState } from 'react';
import Navbar from '../components/navbar';

function DeliveryMan() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [newDeliveryMan, setNewDeliveryMan] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [editDeliveryMan, setEditDeliveryMan] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const openAddModal = () => {
    setAddModalOpen(true);
    setNewDeliveryMan({
      name: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
  };

  const closeAddModal = () => setAddModalOpen(false);

  const openEditModal = (name) => {
    const deliveryMan = deliveryMen.find((man) => man.name === name);
    if (deliveryMan) {
      setEditModalOpen(true);
      setEditDeliveryMan({
        name: deliveryMan.name,
        username: deliveryMan.username,
        password: deliveryMan.password,
        confirmPassword: deliveryMan.confirmPassword
      });
    }
  };

  const closeEditModal = () => setEditModalOpen(false);

  const handleAddDeliveryManChange = (e) => {
    const { name, value } = e.target;
    setNewDeliveryMan((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditDeliveryManChange = (e) => {
    const { name, value } = e.target;
    setEditDeliveryMan((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submitAddModal = () => {
    setDeliveryMen([...deliveryMen, newDeliveryMan]);
    closeAddModal();
  };

  const submitEditModal = () => {
    setDeliveryMen((prevDeliveryMen) =>
      prevDeliveryMen.map((man) =>
        man.name === editDeliveryMan.name ? editDeliveryMan : {
          ...man,
          name: editDeliveryMan.name,
          username: editDeliveryMan.username,
          password: editDeliveryMan.password,
          confirmPassword: editDeliveryMan.confirmPassword
        }
      )
    );
    closeEditModal();
  };

  return (
    <div className="flex w-full bg-gray-100">
      <Navbar />
      <div className="flex flex-col w-full">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6">
          <h2 className="text-1xl font-bold">Management System Delivery Man</h2>
        </div>
        <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg shadow-xl">
          <div className="relative mt-4 flex items-center space-x-4">
            <div className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md shadow-xl focus-within:border-blue-500 relative h-12">
              <span className="text-black-500 whitespace-nowrap">DELIVERY MAN</span>
              <div className="border-l border-gray-300 h-10 mx-2"></div>
              <input
                type="text"
                className="flex-grow focus:outline-none px-4 py-2 rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
                placeholder="Search for Delivery man"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md focus:outline-none">
                Search
              </button>
            </div>
            <button
              className="bg-white text-black px-4 py-2 rounded-md shadow-md focus:outline-none"
              onClick={openAddModal}
            >
              +
            </button>
          </div>
          <div id="delivery-man-container" className="mt-4 space-y-4">
            {deliveryMen.map((deliveryMan, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white-200 p-4 rounded-lg shadow-lg relative"
              >
                <div>{deliveryMan.name}</div>
                <img
                  src="./src/assets/edit.png"
                  alt="Edit"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => openEditModal(deliveryMan.name)}
                />
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
              <h3 className="text-lg font-bold mb-4">Add Delivery Man</h3>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDeliveryMan.name}
                  onChange={handleAddDeliveryManChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDeliveryMan.username}
                  onChange={handleAddDeliveryManChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDeliveryMan.password}
                  onChange={handleAddDeliveryManChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDeliveryMan.confirmPassword}
                  onChange={handleAddDeliveryManChange}
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
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div
            id="editModal"
            className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
              <h3 className="text-lg font-bold mb-4">Edit Delivery Man</h3>
              <div className="mb-4">
                <label htmlFor="editName" className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  id="editName"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editDeliveryMan.name}
                  onChange={handleEditDeliveryManChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editUsername" className="block text-gray-700">Username:</label>
                <input
                  type="text"
                  id="editUsername"
                  name="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editDeliveryMan.username}
                  onChange={handleEditDeliveryManChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editPassword" className="block text-gray-700">Password:</label>
                <input
                  type="password"
                  id="editPassword"
                  name="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editDeliveryMan.password}
                  onChange={handleEditDeliveryManChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editConfirmPassword" className="block text-gray-700">Confirm Password:</label>
                <input
                  type="password"
                  id="editConfirmPassword"
                  name="confirmPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editDeliveryMan.confirmPassword}
                  onChange={handleEditDeliveryManChange}
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

export default DeliveryMan;
