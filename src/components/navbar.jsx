import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Import Images
import companyImage from './../assets/Logo.png';
import dashboardImage from './../assets/dashboard.png';
import overviewImage from './../assets/overview.png';
import orderImage from './../assets/order.png';
import deliveryImage from './../assets/delivery.png';
import salesImage from './../assets/sales.png';
import inventoryImage from './../assets/inventory.png';
import employeeImage from './../assets/employee.png';
import settingsImage from './../assets/settings.png';
import logoutImage from './../assets/logout.png';

const Navbar = () => {
  const url = import.meta.env.VITE_API_URL; // Base API URL
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal State
  const [message, setMessage] = useState(''); // Notification Message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Success Message Visibility
  const [reorderCount, setReorderCount] = useState(
    localStorage.getItem('reorderCount') ? Number(localStorage.getItem('reorderCount')) : 0
  ); // Cached State for Reorder Count

  // Fetch Reorder Count
  const fetchReorderCount = async () => {
    try {
      const response = await axios.get(`${url}/api/view/reorder-level`);
      const products = response.data.data || [];
      const count = products.filter((product) => product.needs_reorder).length;

      localStorage.setItem('reorderCount', count); // Cache the count
      setReorderCount(count);
    } catch (error) {
      console.error('Error fetching reorder count:', error);
    }
  };

  // Fetch Reorder Count on Initial Load and Periodically
  useEffect(() => {
    fetchReorderCount();

    const intervalId = setInterval(() => {
      fetchReorderCount();
    }, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No active session found.');
        setShowSuccessMessage(true);
        return;
      }

      const response = await axios.post(
        `${url}/api/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMessage('Logout successfully');
        setShowSuccessMessage(true);
        localStorage.removeItem('token');
        localStorage.removeItem('reorderCount'); // Clear cache
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate('/');
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

  const confirmLogout = () => {
    handleLogout();
    closeModal();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isActive = (path) => location.pathname === path;


  return (
    <nav className="shadow-[20px] sticky top-0 left-0 w-72 h-screen bg-custom-blue p-4 flex flex-col justify-between items-center z-10">
      <div className="flex flex-col items-center md:items-start w-full">
        <div className="flex items-center mb-3 justify-center md:justify-start">
          <h1 className="text-white text-2xl md:text-3xl font-bold mr-3 text-center">
            FMV Management System
          </h1>
          <img 
            src={companyImage} 
            alt="Client's Company Image" 
            className="w-24 h-auto md:max-w-16" 
          />
        </div>
        <div className="mt-8 w-full">
          <h2 className="text-white text-xl md:text-2xl mb-5 md:ml-0 ml-2 flex items-center text-center md:text-left">
            <img
              src={dashboardImage}
              alt="Dashboard Icon"
              className={`w-6 h-6 mr-2 transition group-hover:invert-0 ${isActive('') ? 'invert-0' : 'invert'}`}
            />
              DASHBOARD
          </h2>
          <ul>
            <li className={`my-3 flex items-center transition pl-2 md:pl-5 group ${isActive('/overview') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <img
                src={overviewImage}
                alt="Overview Icon"
                className={`w-6 h-6 mr-2 transition group-hover:invert-0 ${isActive('/overview') ? 'invert-0' : 'invert'}`}
              />
              <Link to="/overview" className={`text-base md:text-xl ${isActive('/overview') ? 'text-black' : 'text-white group-hover:text-black'}`}>OVERVIEW</Link>
            </li>
              <div className="h-[0.5px] w-full bg-white"></div>
            <li className={`my-3 flex items-center transition pl-2 md:pl-5 group ${isActive('/order') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <img
                src={orderImage}
                alt="Order Icon"
                className={`w-6 h-6 mr-2 transition group-hover:invert-0 ${isActive('/order') ? 'invert-0' : 'invert'}`}
              />
                <Link to="/order" className={`text-base md:text-xl ${isActive('/order') ? 'text-black' : 'text-white group-hover:text-black'}`}>ORDER</Link>
            </li>
            <li className={`my-3 flex items-center transition pl-2 md:pl-5 group ${isActive('/delivery') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <img
                src={deliveryImage}
                alt="Delivery Icon"
                className={`w-6 h-6 mr-2 transition group-hover:invert-0 ${isActive('/delivery') ? 'invert-0' : 'invert'}`}
              />
              <Link to="/delivery" className={`text-base md:text-xl ${isActive('/delivery') ? 'text-black' : 'text-white group-hover:text-black'}`}>DELIVERY</Link>
            </li>
            <div className="h-[0.5px] w-full bg-white"></div>

            <li className={`my-3 flex items-center transition pl-2 md:pl-5 group ${isActive('/sales') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <img
                src={salesImage}
                alt="Sales Icon"
                className={`w-6 h-6 mr-2 transition group-hover:invert-0 ${isActive('/sales') ? 'invert-0' : 'invert'}`}
              />
              <Link to="/sales" className={`text-base md:text-xl ${isActive('/sales') ? 'text-black' : 'text-white group-hover:text-black'}`}>SALES</Link>
            </li>

            <li className={`my-3 flex items-center transition pl-2 md:pl-5 group ${isActive('/inventory') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
            <img
            src={inventoryImage}
            alt="Inventory Icon"
            className={`w-6 h-6 mr-2 transition group-hover:invert-0 ${isActive('/inventory') ? 'invert-0' : 'invert'}`}
            />
              <Link to="/inventory" className={`text-base md:text-xl ${isActive('/inventory') ? 'text-black' : 'text-white group-hover:text-black'}`}>INVENTORY</Link>
            </li>

            <li className={`my-3 flex items-center transition pl-2 md:pl-5 group ${isActive('/employee') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
            <img
            src={employeeImage}
            alt="Employee Icon"
            className={`w-6 h-6 mr-2 transition group-hover:invert-0 ${isActive('/employee') ? 'invert-0' : 'invert'}`}
            />
              <Link to="/employee" className={`text-base md:text-xl ${isActive('/employee') ? 'text-black' : 'text-white group-hover:text-black'}`}>EMPLOYEE</Link>
            </li>
            <div className="h-[0.5px] w-full bg-white"></div>

            <li className={`my-3 flex items-center transition pl-2 md:pl-5 group ${isActive('/configuration') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
              <img
                src={settingsImage}
                alt="Settings Icon"
                className={`w-6 h-6 mr-2 transition group-hover:invert-0 ${isActive('/configuration') ? 'invert-0' : 'invert'}`}
              />
              <Link to="/configuration" className={`text-base md:text-xl ${isActive('/configuration') ? 'text-black' : 'text-white group-hover:text-black'}`}>CONFIGURATION</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full">
          {/* Reorder Items */}
          <li className={`my-3 flex items-center pl-2 md:pl-5 group relative ${isActive('/inventory/reorder') ? 'bg-white text-black rounded' : 'hover:bg-white hover:text-black rounded'}`}>
            <Link to="/inventory/reorder" className={`text-base md:text-xl ${isActive('/inventory/reorder') ? 'text-black' : 'text-white group-hover:text-black'}`}>
              REORDER ITEMS
              {reorderCount > 0 && (
                <span className="absolute -top-2 right-6 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {reorderCount}
                </span>
              )}
            </Link>
          </li>
        <li className="my-3 flex items-center transition duration-300 group hover:bg-white hover:text-black rounded pl-2 md:pl-5">
        <img
            src={logoutImage}
            alt="Settings Icon"
            className={`w-6 h-6 mr-2 transition group-hover:invert-0 ${isActive('') ? 'invert-0' : 'invert'}`}
            />
          <button onClick={openModal} className="text-base md:text-xl text-white group-hover:text-black">LOGOUT</button>
        </li>
      </div>
      {isModalOpen && (
        <div
          id="logoutModal"
          className="fixed z-9999 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 w-11/12 md:w-1/3 rounded-lg shadow-lg"
        >
          <p id="modalText" className="text-lg font-semibold mb-4 ">
            Are you sure you want to logout?
          </p>
          <div className="flex justify-center">
            <button
              onClick={confirmLogout} // Fixed here
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
      {showSuccessMessage && (
        <div className="fixed z-9999 top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 w-full items-center text-center rounded-lg">
          {message}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
