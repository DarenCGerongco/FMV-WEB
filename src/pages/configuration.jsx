import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import QuickButtons from '../components/quickButtons';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CreateCategoriesModal from './settings/category/modal/CreateCategoriesModal';
import EditCategoriesModal from './settings/category/modal/EditCategoriesModal';
import CreateUsertypeModal from './settings/usertype/modal/CreateUsertypeModal';
import EditUsertypeModal from './settings/usertype/modal/EditUsertypeModal';
import CreateSaleTypeModal from './settings/saletype/modal/CreateSaleTypeModal';
import EditSaleTypeModal from './settings/saletype/modal/EditSaleTypeModal';

function Configuration() {
  const url = import.meta.env.VITE_API_URL;
  const usertypeApi = '/api/user-type';
  const categoriesApi = '/api/categories';
  const saletypesApi = '/api/sale-type';

  const [categories, setCategories] = useState([]);
  const [usertype, setUsertype] = useState([]);
  const [saleTypes, setSaleTypes] = useState([]);
  const [activeTab, setActiveTab] = useState('User Types');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCreateSaleTypeModalOpen, setIsCreateSaleTypeModalOpen] = useState(false);
  const [isUsertypeModalOpen, setIsUsertypeModalOpen] = useState(false);
  const [isEditCategoriesModalOpen, setIsEditCategoriesModalOpen] = useState(false);
  const [isEditSaleTypeModalOpen, setIsEditSaleTypeModalOpen] = useState(false);
  const [isEditUsertypeModalOpen, setIsEditUsertypeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSaleType, setSelectedSaleType] = useState(null);
  const [selectedUsertype, setSelectedUsertype] = useState(null);

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
    try {
      const response = await axios.get(`${url}${saletypesApi}`);
      setSaleTypes(response.data || []);
    } catch (error) {
      console.error('Error fetching sale types:', error);
    }
  };

  const handleSoftDelete = async (apiEndpoint, id, fetchFunction, entity) => {
    if (!window.confirm(`Are you sure you want to delete this ${entity}?`)) return;

    try {
        await axios.delete(`${url}${apiEndpoint}/${id}/delete`);
        toast.success(`${entity} deleted successfully!`);
        fetchFunction(); // Refresh the data
    } catch (error) {
        console.error(`Error deleting ${entity}:`, error);

        // Check for backend error message and show it
        if (error.response && error.response.data?.error) {
            toast.error(error.response.data.error);
        } else {
            toast.error(`Failed to delete ${entity}. Please try again.`);
        }
    }
};


  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsEditCategoriesModalOpen(true);
  };

  const handleEditSaleType = (saleType) => {
    setSelectedSaleType(saleType);
    setIsEditSaleTypeModalOpen(true);
  };

  const handleEditUsertype = (userType) => {
    setSelectedUsertype(userType);
    setIsEditUsertypeModalOpen(true);
  };

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
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM CONFIGURATION</h2>
        </div>

        {/* Tabs */}
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
          <button
            className={`p-2 font-bold ${
              activeTab === 'Sale Types' ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
            onClick={() => setActiveTab('Sale Types')}
          >
            Sale Types
          </button>
        </div>

        {/* Tabs Content */}
        <div className="w-4/5 mx-auto mt-6">
          {activeTab === 'User Types' && (
            <div className="p-4 shadow-md border rounded-xl bg-white">
              <h1 className="font-bold bg-gray-200 p-2 rounded-md text-center">User Types</h1>
              <div className="flex flex-col mt-4">
                {usertype.map((user, index) => (
                  <div key={index} className="mb-1 flex justify-between">
                    <span className="font-bold">
                      {index+1}. {user.user_type}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="w-20 p-1 bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-transparent rounded-lg"
                        onClick={() => handleEditUsertype(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-32 border  p-1 bg-red-500 text-white hover:bg-red-600 rounded-lg"
                        onClick={() => handleSoftDelete(usertypeApi, user.id, fetchUsertype, 'User Type')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="mt-4 font-bold border rounded p-2 bg-blue-500 text-white hover:bg-blue-600"
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
                  <div key={index} className="mb-1 flex justify-between">
                    <span className="font-bold">
                      {index+1}. {category.category_name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="w-20 p-1 bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-transparent rounded-lg"
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-32 border  p-1 bg-red-500 text-white hover:bg-red-600 rounded-lg"
                        onClick={() => handleSoftDelete(categoriesApi, category.id, fetchCategories, 'Category')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="mt-4 font-bold border rounded p-2 bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => setIsCategoryModalOpen(true)}
                >
                  Create Product Category
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Sale Types' && (
            <div className="p-4 shadow-md border rounded-xl bg-white">
              <h1 className="font-bold bg-gray-200 p-2 rounded-md text-center">Sale Types</h1>
              <div className="flex flex-col mt-4">
                {saleTypes.map((saleType, index) => (
                  <div key={index} className="mb-1 flex justify-between">
                    <span className="font-bold">
                      {index+1}. {saleType.sale_type_name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="w-20 p-1 bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-transparent rounded-lg"
                        onClick={() => handleEditSaleType(saleType)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-32 border  p-1 bg-red-500 text-white hover:bg-red-600 rounded-lg"
                        onClick={() => handleSoftDelete(saletypesApi, saleType.id, fetchSaleTypes, 'Sale Type')}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="mt-4 font-bold border rounded p-2 bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => setIsCreateSaleTypeModalOpen(true)}
                >
                  Create Sale Type
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateCategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={fetchCategories}
      />
      <EditCategoriesModal
        isOpen={isEditCategoriesModalOpen}
        onClose={() => setIsEditCategoriesModalOpen(false)}
        category={selectedCategory}
        onCategoryUpdated={fetchCategories}
      />
      <CreateUsertypeModal
        isOpen={isUsertypeModalOpen}
        onClose={() => setIsUsertypeModalOpen(false)}
        onUsertypeCreated={fetchUsertype}
      />
      <EditUsertypeModal
        isOpen={isEditUsertypeModalOpen}
        onClose={() => setIsEditUsertypeModalOpen(false)}
        userType={selectedUsertype}
        onUsertypeUpdated={fetchUsertype}
      />
      <EditSaleTypeModal
        isOpen={isEditSaleTypeModalOpen}
        onClose={() => setIsEditSaleTypeModalOpen(false)}
        saleType={selectedSaleType}
        onSaleTypeUpdated={fetchSaleTypes}
      />
      <CreateSaleTypeModal
        isOpen={isCreateSaleTypeModalOpen}
        onClose={() => setIsCreateSaleTypeModalOpen(false)}
        onSaleTypeCreated={fetchSaleTypes}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Configuration;
