import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://192.168.1.6:3000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setMessage('Logout failed');
        setIsModalOpen(true);
      }
    } catch (error) {
      setMessage('An error occurred during logout');
      setIsModalOpen(true);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = () => {
    handleLogout();
    closeModal();
  };

  return (
    <nav className="w-1/6 h-screen bg-custom-blue p-4 flex flex-col items-center">
  <div className="flex items-center mb-3">
    <h1 className="text-white text-1xl font-bold mr-3 text-center">FMV Management System</h1>
    <img src="./src/assets/Logo.png" alt="Client's Company Image" className="max-w-16 h-auto" />
  </div>
  <ul className="flex-grow mt-8">
    <li className="mb-4 flex items-center hover:bg-white hover:bg-opacity-25 hover:rounded transition duration-300">
      <div className="border border-white rounded w-5 h-5 mr-2"></div>
      <Link to="/overview" className="text-white text-lg">Dashboard</Link>
    </li>
    <li className="mb-4 flex items-center hover:bg-white hover:bg-opacity-25 hover:rounded transition duration-300">
      <div className="border border-white rounded w-5 h-5 mr-2"></div>
      <Link to="/order" className="text-white text-lg">Order</Link>
    </li>
    <li className="mb-4 flex items-center hover:bg-white hover:bg-opacity-25 hover:rounded transition duration-300">
      <div className="border border-white rounded w-5 h-5 mr-2"></div>
      <Link to="/delivery" className="text-white text-lg">Delivery</Link>
    </li>
    <li className="mb-4 flex items-center hover:bg-white hover:bg-opacity-25 hover:rounded transition duration-300">
      <div className="border border-white rounded w-5 h-5 mr-2"></div>
      <Link to="/sales" className="text-white text-lg">Sales</Link>
    </li>
    <li className="mb-4 flex items-center hover:bg-white hover:bg-opacity-25 hover:rounded transition duration-300">
      <div className="border border-white rounded w-5 h-5 mr-2"></div>
      <Link to="/inventory" className="text-white text-lg">Inventory</Link>
    </li>
    <li className="mb-4 flex items-center hover:bg-white hover:bg-opacity-25 hover:rounded transition duration-300">
      <div className="border border-white rounded w-5 h-5 mr-2"></div>
      <Link to="/deliveryman" className="text-red-400 text-lg">Delivery man</Link>
    </li>
    <li className="mt-auto mb-4 flex items-center hover:bg-white hover:bg-opacity-25 hover:rounded transition duration-300">
      <div className="border border-white rounded w-5 h-5 mr-2"></div>
      <Link to="/settings" className="text-white text-lg">Settings</Link>
    </li>
    <li className="mb-4 flex items-center hover:bg-white hover:bg-opacity-25 hover:rounded transition duration-300">
      <div className="border border-white rounded w-5 h-5 mr-2"></div>
      <button onClick={openModal} className="text-white text-lg">Logout</button>
    </li>
  </ul>
  {isModalOpen && (
    <div
      id="logoutModal"
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50"
    >
      <p id="modalText" className="text-lg font-semibold mb-4">
        Are you sure you want to logout?
      </p>
      <div className="flex justify-center">
        <button
          onClick={confirmLogout}
          className="mx-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          OK
        </button>
        <button
          onClick={closeModal}
          className="mx-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</nav>

  );
};

export default Navbar;
