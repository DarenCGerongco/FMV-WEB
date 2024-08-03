import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-1/6 bg-custom-blue p-4 flex items-center flex-col">
      <div className="flex items-center mb-3">
        <h1 className="text-white text-1xl font-bold mr-3 text-center">FMV Management System</h1>
        <img src="./src/assets/Logo.png" alt="Client's Company Image" className="max-w-16 h-auto" />
      </div>
      <ul className="mt-8">
        <li className="mb-4 hover:bg-white hover:bg-opacity-25 hover:rounded transition duration-300">
          <Link to="/" className="text-white text-base">DASHBOARD</Link>
        </li>
        <li className="mb-4 flex items-center hover:bg-white hover:bg-opacity-25 hover:rounded transition duration-300">
          <div className="border border-white rounded w-5 h-5 mr-2"></div>
          <Link to="/overview" className="text-white text-lg">Overview</Link>
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
          <Link to="/deliveryman" className="text-white text-lg">Delivery man</Link>
        </li>
        <li className="mb-4 flex items-center hover:bg-white hover:bg-opacity-25 hover:rounded transition duration-300 mt-40">
          <div className="border border-white rounded w-5 h-5 mr-2"></div>
          <Link to="/settings" className="text-white text-lg">Settings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
