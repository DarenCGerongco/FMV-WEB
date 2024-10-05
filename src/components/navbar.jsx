import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No active session found.'); // Handle case where token is not present
        return;
      }
      
      const response = await axios.post(`${url}/api/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setMessage('Logout successfully');
        setShowSuccessMessage(true);
        localStorage.removeItem('token'); // Remove token after successful logout
        
        setTimeout(() => {
          setShowSuccessMessage(false);
          setMessage('');
          navigate('/'); // Redirect to the home page
        }, 1000);
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

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="rounded-[20px] shadow-[20px] fixed top-0 left-0 w-72 h-screen bg-custom-blue p-4 flex flex-col justify-between items-center border-t-[5px] border-b-[5px] border-l-[5px] z-50">
      <div className="flex flex-col items-center md:items-start w-full">
        <div className="flex items-center mb-3 justify-center md:justify-start">
          
          <h1 className="text-white text-2xl md:text-3xl font-bold mr-3 text-center">
            FMV Management System
          </h1>
          <img
            src="./src/assets/Logo.png"
            alt="Client's Company Image"
            className="w-24 h-auto md:max-w-16"
          />
        </div>
        <div className="mt-8 w-full">
          <h2 className="text-white text-xl md:text-2xl mb-5 md:ml-0 ml-2 text-center md:text-left">DASHBOARD</h2>
          <ul>
            <li className={`mb-4 flex items-center transition pl-2 md:pl-5 group ${isActive('/overview') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <div className={`border w-4 h-4 md:w-5 md:h-5 mr-2 ${isActive('/overview') ? 'border-black' : 'border-white group-hover:border-black'}`}></div>
              <Link to="/overview" className={`text-base md:text-xl ${isActive('/overview') ? 'text-black' : 'text-white group-hover:text-black'}`}>OVERVIEW</Link>
            </li>
            <li className={`mb-4 flex items-center transition pl-2 md:pl-5 group ${isActive('/order') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <div className={`border w-4 h-4 md:w-5 md:h-5 mr-2 ${isActive('/order') ? 'border-black' : 'border-white group-hover:border-black'}`}></div>
              <Link to="/order" className={`text-base md:text-xl ${isActive('/order') ? 'text-black' : 'text-white group-hover:text-black'}`}>ORDER</Link>
            </li>
            <li className={`mb-4 flex items-center transition pl-2 md:pl-5 group ${isActive('/delivery') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <div className={`border w-4 h-4 md:w-5 md:h-5 mr-2 ${isActive('/delivery') ? 'border-black' : 'border-white group-hover:border-black'}`}></div>
              <Link to="/delivery" className={`text-base md:text-xl ${isActive('/delivery') ? 'text-black' : 'text-white group-hover:text-black'}`}>DELIVERY</Link>
            </li>
            <li className={`mb-4 flex items-center transition pl-2 md:pl-5 group ${isActive('/sales') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <div className={`border w-4 h-4 md:w-5 md:h-5 mr-2 ${isActive('/sales') ? 'border-black' : 'border-white group-hover:border-black'}`}></div>
              <Link to="/sales" className={`text-base md:text-xl ${isActive('/sales') ? 'text-black' : 'text-white group-hover:text-black'}`}>SALES</Link>
            </li>
            <li className={`mb-4 flex items-center transition pl-2 md:pl-5 group ${isActive('/inventory') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <div className={`border w-4 h-4 md:w-5 md:h-5 mr-2 ${isActive('/inventory') ? 'border-black' : 'border-white group-hover:border-black'}`}></div>
              <Link to="/inventory" className={`text-base md:text-xl ${isActive('/inventory') ? 'text-black' : 'text-white group-hover:text-black'}`}>INVENTORY</Link>
            </li>
            <li className={`mb-4 flex items-center transition pl-2 md:pl-5 group ${isActive('/deliveryman') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <div className={`border w-4 h-4 md:w-5 md:h-5 mr-2 ${isActive('/deliveryman') ? 'border-black' : 'border-white group-hover:border-black'}`}></div>
              <Link to="/deliveryman" className={`text-base md:text-xl ${isActive('/deliveryman') ? 'text-black' : 'text-white group-hover:text-black'}`}>DELIVERY MAN</Link>
            </li>
            <li className={`mb-4 flex items-center transition pl-2 md:pl-5 group ${isActive('/settings') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <div className={`border w-4 h-4 md:w-5 md:h-5 mr-2 ${isActive('/settings') ? 'border-black' : 'border-white group-hover:border-black'}`}></div>
              <Link to="/settings" className={`text-base md:text-xl ${isActive('/settings') ? 'text-black' : 'text-white group-hover:text-black'}`}>SETTINGS</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full">
        <li className="mb-4 flex items-center transition duration-300 group hover:bg-white hover:text-black rounded pl-2 md:pl-5">
          <div className="border border-white rounded w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:border-black"></div>
          <button onClick={openModal} className="text-base md:text-xl text-white group-hover:text-black">LOGOUT</button>
        </li>
      </div>
      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <div
          id="logoutModal"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 w-11/12 md:w-1/3 rounded-lg shadow-lg z-50"
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

      {/* Success Message after Logout */}
      {showSuccessMessage && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 w-full items-center text-center rounded-lg">
          {message}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
