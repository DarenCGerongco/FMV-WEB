import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
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

  // Function to determine if the current menu item is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-1/6 h-screen bg-custom-blue p-4 flex flex-col justify-between items-center">
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center mb-3">
          <h1 className="text-white text-1xl font-bold mr-3 text-center">FMV Management System</h1>
          <img src="./src/assets/Logo.png" alt="Client's Company Image" className="max-w-16 h-auto" />
        </div>
        <ul className="pl-6 flex-grow mt-8 w-full">
          <li className={`mb-4 flex items-center hover:bg-white hover:bg-opacity-40% hover:rounded transition duration-300 group ${isActive('/overview') ? 'bg-white text-black rounded' : ''}`}>
            <div className={`border w-5 h-5 mr-2 ${isActive('/overview') ? 'border-black' : 'border-white'}`}></div>
            <Link to="/overview" className={`text-lg ${isActive('/overview') ? 'text-black' : 'text-white'}`}>Dashboard</Link>
          </li>
          <li className={`mb-4 flex items-center hover:bg-white hover:bg-opacity-40% hover:rounded transition duration-300 group ${isActive('/order') ? 'bg-white text-black rounded' : ''}`}>
            <div className={`border w-5 h-5 mr-2 ${isActive('/order') ? 'border-black' : 'border-white'}`}></div>
            <Link to="/order" className={`text-lg ${isActive('/order') ? 'text-black' : 'text-white'}`}>Order</Link>
          </li>
          <li className={`mb-4 flex items-center hover:bg-white hover:bg-opacity-40% hover:rounded transition duration-300 group ${isActive('/delivery') ? 'bg-white text-black rounded' : ''}`}>
            <div className={`border w-5 h-5 mr-2 ${isActive('/delivery') ? 'border-black' : 'border-white'}`}></div>
            <Link to="/delivery" className={`text-lg ${isActive('/delivery') ? 'text-black' : 'text-white'}`}>Delivery</Link>
          </li>
          <li className={`mb-4 flex items-center hover:bg-white hover:bg-opacity-40% hover:rounded transition duration-300 group ${isActive('/sales') ? 'bg-white text-black rounded' : ''}`}>
            <div className={`border w-5 h-5 mr-2 ${isActive('/sales') ? 'border-black' : 'border-white'}`}></div>
            <Link to="/sales" className={`text-lg ${isActive('/sales') ? 'text-black' : 'text-white'}`}>Sales</Link>
          </li>
          <li className={`mb-4 flex items-center hover:bg-white hover:bg-opacity-40% hover:rounded transition duration-300 group ${isActive('/inventory') ? 'bg-white text-black rounded' : ''}`}>
            <div className={`border w-5 h-5 mr-2 ${isActive('/inventory') ? 'border-black' : 'border-white'}`}></div>
            <Link to="/inventory" className={`text-lg ${isActive('/inventory') ? 'text-black' : 'text-white'}`}>Inventory</Link>
          </li>
          <li className={`mb-4 flex items-center hover:bg-white hover:bg-opacity-40% hover:rounded transition duration-300 group ${isActive('/deliveryman') ? 'bg-white text-black rounded' : ''}`}>
            <div className={`border w-5 h-5 mr-2 ${isActive('/deliveryman') ? 'border-black' : 'border-white'}`}></div>
            <Link to="/deliveryman" className={`text-lg ${isActive('/deliveryman') ? 'text-black' : 'text-white'}`}>Delivery man</Link>
          </li>
          <li className={`mb-4 flex items-center hover:bg-white hover:bg-opacity-40% hover:rounded transition duration-300 group ${isActive('/settings') ? 'bg-white text-black rounded' : ''}`}>
            <div className={`border w-5 h-5 mr-2 ${isActive('/settings') ? 'border-black' : 'border-white'}`}></div>
            <Link to="/settings" className={`text-lg ${isActive('/settings') ? 'text-black' : 'text-white'}`}>Settings</Link>
          </li>
        </ul>
      </div>
      <div className="pl-6 w-full">
        <li className="mb-4 flex items-center hover:bg-white hover:bg-opacity-40% hover:rounded transition duration-300 group">
          <div className="border border-white rounded w-5 h-5 mr-2 group-hover:border-black"></div>
          <button onClick={openModal} className="text-white text-lg group-hover:text-black">Logout</button>
        </li>
      </div>
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
