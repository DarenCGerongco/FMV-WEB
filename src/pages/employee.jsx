import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';


function Employee() {
  const url = import.meta.env.VITE_API_URL;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  

  const [newDeliveryMan, setNewDeliveryMan] = useState({
    usertype: '',
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    number: '',
  });

  const [editDeliveryMan, setEditDeliveryMan] = useState({
    id: '',
    usertype: '',
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    number: '', 
  });

  const filteredDeliveryMen = deliveryMen.filter(man =>
    man.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    man.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Fetching delivery men on component mount
  useEffect(() => {
    const fetchDeliveryMen = async () => {
      try {
        const response = await axios.get(`${url}/api/users`);
        setDeliveryMen(response.data.data);
      } catch (error) {
        console.error('An error occurred while fetching employee:', error);
      }
    };

    fetchDeliveryMen();
  }, []);

  const openAddModal = () => {
    setAddModalOpen(true);
    setNewDeliveryMan({
      usertype: '',
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
      email: '', // Reset email
      number: '', // Reset number
    });
  };

  const closeAddModal = () => setAddModalOpen(false);

  const openEditModal = (name) => {
    const deliveryMan = deliveryMen.find((man) => man.name === name);
    if (deliveryMan) {
      setEditModalOpen(true);
      setEditDeliveryMan({
        usertype: deliveryMan.usertype,
        id: deliveryMan.id,
        name: deliveryMan.name,
        username: deliveryMan.username,
        password: '',
        confirmPassword: '',
        email: deliveryMan.email || '',
        number: deliveryMan.number || '',
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

  //* Start Create account modal Pop-out
  const submitAddModal = async () => {
    if (newDeliveryMan.password.length < 8) {
      console.error('Password must be at least 8 characters long');
      alert('Password must be at least 8 characters long');
      return;
    }
    if (newDeliveryMan.password !== newDeliveryMan.confirmPassword) {
      console.error('Passwords do not match');
      alert('Passwords do not match');
      return;
    }
    if (!newDeliveryMan.number) {
      console.error('Phone number is required');
      alert('Phone number is required');
      return;
    }
    try {
      const response = await axios.post(`${url}/api/users`, {
        user_type_id: newDeliveryMan.usertype,
        name: newDeliveryMan.name,
        username: newDeliveryMan.username,
        password: newDeliveryMan.password,
        email: newDeliveryMan.email || 'null@gmail.com', // Use 'null@gmail.com' if email is null
        number: newDeliveryMan.number,
      });
  
      if (response.status === 201) {
        setDeliveryMen([...deliveryMen, response.data.data]);
        closeAddModal();
      } else {
        console.error('Error creating Employee');
      }
    } catch (error) {
      console.error('An error occurred while creating a Employee:', error.response.data.error);
      alert('An error occurred: ' + JSON.stringify(error.response.data.error));
    }
  };
  //* End Create Account modal Pop-out

  //* Start Edit Account modal Pop-out
  const submitEditModal = async () => {
    try {
      const response = await axios.put(`${url}/api/users/${editDeliveryMan.id}`, {
        name: editDeliveryMan.name,
        username: editDeliveryMan.username,
        password: editDeliveryMan.password,
        user_type_id: editDeliveryMan.usertype,
        email: editDeliveryMan.email || null,
        number: editDeliveryMan.number,
      });

      if (response.status === 200) {
        setDeliveryMen((prevDeliveryMen) =>
          prevDeliveryMen.map((man) =>
            man.id === editDeliveryMan.id ? response.data.data : man
          )
        );
        closeEditModal();
      } else {
        console.error('Error updating Employee');
      }
    } catch (error) {
      console.error('An error occurred while updating the Employee:', error.response.data.error);
    }
  };
  //* End Edit Account modal Pop-out

  //* Start delete account
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Employee?")) {
      try {
        const response = await axios.delete(`${url}/api/users/${id}`);
  
        if (response.status === 200) {
          setDeliveryMen(deliveryMen.filter((man) => man.id !== id));
          console.log('Employee deleted successfully');
        } else {
          console.error('Failed to delete the Employee');
        }
      } catch (error) {
        console.error('An error occurred while deleting the Employee:', error.response.data.error);
      }
    }
  };  
  //* End delete account

  return (
    <div className="flex w-full bg-100">
      <Navbar/>
      <div className="flex flex-col w-full bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6 border">
          <h2 className="font-bold text-1xl">EMPLOYEE</h2>
        </div>
        <div className="w-4/5 mx-auto bg-white p-3 rounded-lg shadow-md">
          <div className="relative mt-4 flex items-center space-x-4">
            <div className="flex flex-row items-center w-full px-4 py-3 mr-1 border border-gray-300 rounded-md shadow-md focus-within:border-blue-500 relative h-12">
              <span className="font-bold text-black-500 whitespace-nowrap">
                EMPLOYEE
              </span>
              <div className="border-l border-gray-300 h-10 mx-2"></div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for Employee"
                className="flex-grow focus:outline-none px-4 py-2 rounded-md sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
              />
            </div>
            <button
              className=" px-4 py-2 bg-blue-500 text-white rounded-md shadow-md focus:outline-none"
              onClick={openAddModal}
            >
              +
            </button>
          </div>
          </div>

          <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg shadow-md">
          <div id="delivery-man-container" className="mt-4 space-y-1">
            <div className="grid grid-cols-6 gap-1 font-bold p-1">
              <div className="col-span-2">Name</div>
              <div className="col-span-2">Number</div>
              <div className="col-span-2 text-right">Options</div>
            </div>

            {filteredDeliveryMen.map((deliveryMan, index) => (
              <div 
                key={index} 
                className="grid grid-cols-6 rounded-lg hover:bg-blue-50 duration-300 shadow-md text-left border-b border-gray-300 p-1"
                >
                <div className="col-span-2">{deliveryMan.name}</div>
                <div className="col-span-2">{deliveryMan.number}</div>
                <div className="col-span-2 flex justify-end items-center space-x-5">
                  <img
                    src="./src/assets/edit.png"
                    alt="Edit"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => openEditModal(deliveryMan.name)}
                  />
                  <img
                    src="./src/assets/delete.png"
                    alt="Delete"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => handleDelete(deliveryMan.id)}
                  />
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
            <div className="bg-white p-6 rounded-lg shadow-2xl w-1/4">
              <h3 className="text-lg font-bold mb-4">Add Employee</h3>
              <div className="mb-4">
                <label htmlFor="usertype" className="block text-gray-700">Usertype:</label>
                <select
                  id="usertype"
                  name="usertype"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDeliveryMan.usertype}
                  onChange={handleAddDeliveryManChange}
                >
                  <option value="">Select Usertype</option> {/* Default placeholder */}
                  <option value="1">Admin</option>
                  <option value="2">Employee</option>
                </select>
              </div>
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
                <label htmlFor="email" className="block text-gray-700">Email(optional):</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDeliveryMan.email}
                  onChange={handleAddDeliveryManChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="number" className="block text-gray-700">Number:</label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDeliveryMan.number}
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
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-2xl"
                  onClick={closeAddModal}
                >
                  Close
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl"
                  onClick={submitAddModal}
                >
                  Create
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
            <div className="bg-white p-6 rounded-lg shadow-2xl w-1/4">
              <h3 className="text-lg font-bold mb-4">Edit Employee</h3>
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
                <label htmlFor="editEmail" className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editDeliveryMan.email}
                  onChange={handleEditDeliveryManChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editNumber" className="block text-gray-700">Number:</label>
                <input
                  type="text"
                  id="editNumber"
                  name="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editDeliveryMan.number}
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
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-2xl"
                  onClick={closeEditModal}
                >
                  Close
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl"
                  onClick={submitEditModal}
                >
                  Save
                </button>
                {filteredDeliveryMen.length === 0 && (
              <p className="text-gray-500 text-center mt-4">No results found</p>
            )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Employee;