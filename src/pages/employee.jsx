import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import CreateEmployee from "./employee/modal/CreateEmployeeModal";
import EditEmployeeModal from "./employee/modal/EditEmployeeModal"; // Import the edit modal
import QuickButtons from "../components/quickButtons";
import { toast } from "react-toastify";

function Employee() {
  const url = import.meta.env.VITE_API_URL;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [userTypes, setUserTypes] = useState([]); // Store user types
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [newDeliveryMan, setNewDeliveryMan] = useState({
    usertype: "",
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    number: "",
  });

  const [editDeliveryMan, setEditDeliveryMan] = useState({
    id: "",
    usertype: "",
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    number: "",
  });

  const filteredDeliveryMen = Array.isArray(deliveryMen)
    ? deliveryMen.filter((man) =>
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
          params: { page: currentPage, per_page: 20 },
        });

        // console.log("Full API Response:", response.data);

        if (Array.isArray(response.data.data.data)) {
          const formattedData = response.data.data.data.map((user) => ({
            ...user,
            created_at: new Date(user.created_at).toLocaleDateString("en-us",{
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }),
          }));

          setDeliveryMen(formattedData);
          setTotalPages(response.data.data.last_page);
        } else {
          console.error("The API response does not contain an array for 'data'");
          setDeliveryMen([]);
        }
      } catch (error) {
        console.error("An error occurred while fetching employees:", error);
        setDeliveryMen([]);
      }
    };

    fetchDeliveryMen();
  }, [currentPage]);

  const openAddModal = () => {
    setAddModalOpen(true);
    setNewDeliveryMan({
      usertype: "",
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      number: "",
    });
  };

  const closeAddModal = () => setAddModalOpen(false);

  const openEditModal = (id) => {
    const deliveryMan = deliveryMen.find((man) => man.id === id); // Find by unique ID
    if (deliveryMan) {
      setEditModalOpen(true);
      setEditDeliveryMan({
        usertype: deliveryMan.usertype,
        id: deliveryMan.id,
        name: deliveryMan.name,
        username: deliveryMan.username,
        email: deliveryMan.email || "",
        number: deliveryMan.number || "",
      });
    } else {
      console.error(`No delivery man found with ID: ${id}`);
    }
  };
  

  const closeEditModal = () => setEditModalOpen(false);

  const handleAddDeliveryManChange = (e) => {
    const { name, value } = e.target;
    setNewDeliveryMan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditDeliveryManChange = (e) => {
    const { name, value } = e.target;
    setEditDeliveryMan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitAddModal = async () => {
    try {
      const response = await axios.post(`${url}/api/users/employee`, {
        name: newDeliveryMan.name,
        email: newDeliveryMan.email || null, // Optional field
        username: newDeliveryMan.username,
        password: newDeliveryMan.password,
        user_type_id: newDeliveryMan.usertype, // Matches the backend's field
        number: newDeliveryMan.number,
      });

      if (response.status === 201) {
        toast.success("User created successfully!");
        setDeliveryMen((prevDeliveryMen) => [...prevDeliveryMen, response.data.data]);
        closeAddModal();
      } else {
        toast.error("Failed to create user.");
      }
    } catch (error) {
      console.error("Error while creating user:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  const submitEditModal = async () => {
    try {
      const response = await axios.put(`${url}/api/user/${editDeliveryMan.id}/update`, {
        user_type_id: editDeliveryMan.usertype,
        name: editDeliveryMan.name,
        username: editDeliveryMan.username,
        email: editDeliveryMan.email || null, // Optional field
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
        toast.error("Failed to update user.");
      }
    } catch (error) {
      console.error("An error occurred while updating the user:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  // Pagination controls
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  console.log(deliveryMen);

  return (
    <div className="flex w-full bg-100">
      <Navbar />
      <QuickButtons />
      <div className="flex flex-col w-full bg-white">
        <div className="w-4/5 mx-auto p-6 m-3 rounded-lg mb-6 bg-white shadow-lg shadow-gray-400">
          <h2 className="font-bold text-1xl">MANAGEMENT SYSTEM EMPLOYEE</h2>
        </div>
        <div className="w-4/5 mx-auto bg-white p-3 m-3 rounded-lg shadow-lg shadow-gray-400">
          <div className="flex flex-row">
            <div className="flex flex-row items-center w-full px-2 py-2 mr-1 border border-gray-300 rounded-md shadow-md focus-within:border-blue-500 relative h-12">
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
              className="flex bg-blue-500 text-white w-[10rem] duration-200 justify-center rounded hover:bg-blue-700 items-center font-bold"
              onClick={openAddModal}
            >
              Add Employee
            </button>
          </div>
        </div>

        <div className="w-4/5 mx-auto p-5 m-3 rounded-lg bg-white shadow-lg shadow-gray-400">
          <div id="delivery-man-container" className="mt-4 space-y-1">
            <div className="grid grid-cols-8 gap-1 font-bold p-1">
              <div className="col-span-2">Name</div>
              <div className="col-span-2">Number</div>
              <div className="col-span-1">Created</div>
              <div className="col-span-1">User Type</div>
              <div className="col-span-2 text-center">Options</div>
            </div>

            {filteredDeliveryMen.map((deliveryMan, index) => (
              <div
                key={index}
                className="grid text-sm border gap-1 grid-cols-8 rounded hover:bg-blue-50 duration-300 bg-white shadow-md py-2 px-1"
              >
                <div className="col-span-2">{deliveryMan.name}</div>
                <div className="col-span-2">{deliveryMan.number}</div>
                <div className="col-span-1">{deliveryMan.created_at}</div>
                <div className="col-span-1">{deliveryMan.user_type?.user_type}</div>
                {/* <div className="col-span-1">{deliveryMan}</div> */}
                <div className="col-span-2 flex justify-center space-x-2">
                  <img
                    src="./src/assets/edit.png"
                    alt="Edit"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => openEditModal(deliveryMan.id)} // Pass ID instead of name
                  />
                  <img
                    src="./src/assets/delete.png"
                    alt="Delete"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => console.log("Delete", deliveryMan.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {addModalOpen && (
          <CreateEmployee
            newDeliveryMan={newDeliveryMan}
            handleAddDeliveryManChange={handleAddDeliveryManChange}
            submitAddModal={submitAddModal}
            closeAddModal={closeAddModal}
          />
        )}


        {editModalOpen && (
          <EditEmployeeModal
            editDeliveryMan={editDeliveryMan}
            handleEditDeliveryManChange={handleEditDeliveryManChange}
            submitEditModal={submitEditModal}
            closeEditModal={closeEditModal}
          />
        )}
      </div>
    </div>
  );
}

export default Employee;
