import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';
import CreateEmployee from './employee/modal/CreateEmployeeModal';
import EditEmployeeModal from './employee/modal/EditEmployeeModal'; // Import the edit modal
import Walkin from '../components/walkin';

function Employee() {
  const url = import.meta.env.VITE_API_URL;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const filteredDeliveryMen = Array.isArray(deliveryMen)
    ? deliveryMen.filter(man =>
        man.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        man.number.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchDeliveryMen = async () => {
      try {
        const response = await axios.get(`${url}/api/users/employee`, {
          params: { page: currentPage, per_page: 20 }
        });

        console.log("Full API Response:", response.data);

        if (Array.isArray(response.data.data.data)) {
          setDeliveryMen(response.data.data.data);
          setTotalPages(response.data.data.last_page);
        } else {
          console.error("The API response does not contain an array for 'data'");
          setDeliveryMen([]);
        }
      } catch (error) {
        console.error('An error occurred while fetching employee:', error);
        setDeliveryMen([]);
      }
    };

    fetchDeliveryMen();
  }, [currentPage]);

  const openAddModal = () => {
    setAddModalOpen(true);
    setNewDeliveryMan({
      usertype: '',
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      number: '',
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

  const submitEditModal = async () => {
    try {
      const response = await axios.put(`${url}/api/users/${editDeliveryMan.id}`, {
        name: editDeliveryMan.name,
        username: editDeliveryMan.username,
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
      console.error('An error occurred while updating the Employee:', error);
    }
  };

  // Pagination controls
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex w-full bg-100">
      <Navbar/>
      <Walkin/>
      <div className="flex flex-col w-full bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6 border">
          <h2 className="font-bold text-1xl">MANAGEMENT SYSTEM EMPLOYEE</h2>
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md focus:outline-none"
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
                className="grid grid-cols-6 rounded-lg hover:bg-blue-50 duration-300 shadow-md border-b border-gray-300 p-3"
              >
                <div className="col-span-2">{deliveryMan.name}</div>
                <div className="col-span-2">{deliveryMan.number}</div>
                <div className="col-span-2 flex justify-end items-center space-x-2">
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

          {/* Pagination Controls */}
          <div className="flex justify-center w-full space-x-2 my-4">
            {/* Pagination buttons here */}
          </div>
        </div>

        {/* Add Modal with CreateEmployee Component */}
        {addModalOpen && (
          <div
            id="addModal"
            className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
          >
            <CreateEmployee
              newDeliveryMan={newDeliveryMan}
              handleAddDeliveryManChange={handleAddDeliveryManChange}
              submitAddModal={submitAddModal}
              closeAddModal={closeAddModal}
            />
          </div>
        )}

        {/* Edit Modal with EditEmployeeModal Component */}
        {editModalOpen && (
          <div
            id="editModal"
            className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
          >
            <EditEmployeeModal
              editDeliveryMan={editDeliveryMan}
              handleEditDeliveryManChange={handleEditDeliveryManChange}
              submitEditModal={submitEditModal}
              closeEditModal={closeEditModal}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Employee;
