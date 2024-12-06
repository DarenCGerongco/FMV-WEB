import React, { useEffect, useState } from 'react';
import Navbar from './../components/navbar';
import QuickButtons from './../components/quickButtons';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateCategoriesModal from './settings/categories/modal/CreateCategoriesModal';
import CreateUsertypeModal from './settings/usertypes/modal/CreateUsertypeModal';

function Settings() {
  const url = import.meta.env.VITE_API_URL;
  const usertypeApi = '/api/user-type';
  const categoriesApi = '/api/categories';
  const saletypesApi = '/api/sale-types';

  const [categories, setCategories] = useState([]);
  const [usertype, setUsertype] = useState([]);
  const [activeTab, setActiveTab] = useState('User Types');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUsertypeModalOpen, setIsUsertypeModalOpen] = useState(false);

  const fetchUsertype = async () => {
    try {
      const response = await axios.get(`${url}${usertypeApi}`);
      setUsertype(response.data.data || []);
    } catch (error) {
      console.error('Error fetching user types:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}${categoriesApi}`);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const fetchSaleTypes = async () => {
    try{
      const response = await axios.get(`${url}${saletypesApi}`)
    }catch (error) {
      console.error('Error fetching Sale Type:', error);
    }

  }

  useEffect(() => {
    fetchUsertype();
    fetchCategories();
    fetchSaleTypes();
  }, []);

  return (
    <div className="flex w-full">
      <Navbar />
      <QuickButtons />
      <div className="w-full bg-white-100">
        <div className="w-4/5 mx-auto p-6 m-3 rounded-lg bg-white shadow-lg shadow-gray-400 mb-6">
          <h2 className="text-1xl font-bold">SETTINGS</h2>
        </div>

        <div className="w-4/5 mx-auto flex justify-center border-b">
          <button
            className={`p-2 font-bold ${
              activeTab === 'User Types' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('User Types')}
          >
            User Types
          </button>
          <button
            className={`p-2 font-bold ${
              activeTab === 'Product Categories' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('Product Categories')}
          >
            Product Categories
          </button>
        </div>

        <div className="w-4/5 mx-auto mt-6">
          {activeTab === 'User Types' && (
            <div className="p-4 shadow-md border rounded-xl bg-white">
              <h1 className="font-bold bg-gray-200 p-2 rounded-md text-center">User Types</h1>
              <div className="flex flex-col mt-4">
                {usertype.map((usertype, index) => (
                  <div key={index} className="mt-2">
                    <span className="font-bold">
                      {usertype.id}. {usertype.user_type}
                    </span>
                  </div>
                ))}
                <button
                  className="mt-4 border rounded p-2 bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => setIsUsertypeModalOpen(true)}
                >
                  Create User Type
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Product Categories' && (
            <div className="p-4 shadow-md border rounded-xl bg-white">
              <h1 className="font-bold bg-gray-200 p-2 rounded-md text-center">Product Categories</h1>
              <div className="flex flex-col mt-4">
                {categories.map((category, index) => (
                  <div key={index} className="mt-2">
                    <span className="font-bold">
                      {category.id}. {category.category_name}
                    </span>
                  </div>
                ))}
                <button
                  className="mt-4 border rounded p-2 bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => setIsCategoryModalOpen(true)}
                >
                  Create Product Category
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={fetchCategories}
      />
      <CreateUsertypeModal
        isOpen={isUsertypeModalOpen}
        onClose={() => setIsUsertypeModalOpen(false)}
        onUsertypeCreated={fetchUsertype}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Settings;
