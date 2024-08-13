import { useState, useEffect } from 'react';
import Navbar from '../components/navbar'; 
import axios from 'axios';



function Inventory() {
  const url = import.meta.env.VITE_API_URL;
  
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [categories, setCategories] = useState([]); // State for categories

  // Fetch categories when the component mounts
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  fetchCategories();
}, [url]);

// Fetch products when the component mounts
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${url}/api/products`);
      setItems(response.data);
      
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  fetchProducts();
}, [url]);

  

  // Handlers for opening and closing modals
  const openAddItemModal = () => setAddItemModalOpen(true);
  const closeAddItemModal = () => setAddItemModalOpen(false);
  const openRestockModal = () => setRestockModalOpen(true);
  const closeRestockModal = () => setRestockModalOpen(false);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'newitemname':
        setNewItemName(value);
        break;
      case 'newitemcategory':
        setNewItemCategory(value);
        break;
      case 'newitemprice':
        setNewItemPrice(value);
        break;
      case 'newitemamount':
        setNewItemAmount(value);
        break;
      default:
        break;
    }
  };


  // Function to add a new item
  const addItem = async () => {
    const newItem = {
      product_name: newItemName,
      category_id: newItemCategory,
      original_price: parseFloat(newItemPrice),
      quantity: parseInt(newItemAmount),
    };
  
    try {
      const response = await axios.post(`${url}/api/products`, newItem);
      if (response.status === 201) {
        setItems([...items, response.data]);
        closeAddItemModal();
        // Clear input fields after adding item
        setNewItemName('');
        setNewItemCategory('');
        setNewItemPrice('');
        setNewItemAmount('');
      } else {
        console.error('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error.response ? error.response.data : error.message);
    }
  };


  // Function to restock an item
  const restockItem = () => {
    const itemName = document.getElementById('itemname').value;
    const itemAmount = parseInt(document.getElementById('itemamount').value);

    const updatedItems = items.map(item => {
      if (item.name === itemName) {
        return {
          ...item,
          amount: parseInt(item.amount) + itemAmount
        };
      }
      return item;
    });

    setItems(updatedItems);
    closeRestockModal();
  };

  // Function to open edit modal
  const openEditModal = (itemName) => {
    // Implement your edit modal logic here
    console.log(`Editing item: ${itemName}`);
  };


  return (
    <div className="flex w-full bg-white">
      <Navbar />

      {/* Main Content */}
      <div className="w-full ml-80 bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6">
          <h2 className="text-1xl font-bold">Management System Inventory</h2>
        </div>

        {/* Searchbar and Restock Button */}
        <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg shadow-xl">
          <div className="relative mt-4 flex items-center space-x-4">
            <div className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md shadow-xl focus-within:border-blue-500 relative h-12">
              <span className="text-black-500 whitespace-nowrap">Inventory</span>
              <div className="border-l border-gray-300 h-10 mx-2"></div>
              <input
                type="text"
                className="flex-grow focus:outline-none px-4 py-2 rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
                placeholder="Search for items"
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md focus:outline-none"
              >
                Search
              </button>
            </div>
            <button
              className="text-white px-4 py-2 rounded-md shadow-md focus:outline-none bg-blue-600"
              onClick={openRestockModal}
            >
              Restock
            </button>

            {/* Start Add Item Button */}
              <div className="flex justify-center">
                <button
                  className="text-white px-4 py-2 rounded-md shadow-md focus:outline-none bg-blue-600"
                  onClick={openAddItemModal}
                >
                  <span>
                    Register
                  </span>
                </button>
              </div>
            {/* End Add Item Button */}
            
          </div>

          {/* Labels */}
          <h3 className="text-sm mt-6 ml-8 text-gray-400 flex justify-between">
            <span className="w-1/5">Item Name</span> 
            <span className="text-sm text-gray-400 w-1/5">Item Category</span> 
            <span className="text-sm text-gray-400 w-1/5">Item Price</span>
            <span className="text-sm text-gray-400 w-1/5">Item Amount</span>
            <span className="text-sm text-gray-400 w-1/12">Edit</span> 
          </h3>

          {/* Item List */}
          <div className="mt-4 space-y-4 mb-10">
            {console.log(items)}  {/* Log the items array here */}
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white-200 p-4 rounded-lg shadow-lg relative">
                <div className="w-1/15">{item.product_name}</div>
                <div className="ml-20 w-1/5">{item.category_name}</div>
                <div className="w-1/5">{item.original_price ? item.original_price : 'N/A'}</div>
                <div className="w-1/5">{item.quantity}</div>
                <img
                  src="./src/assets/edit.png"
                  alt="Edit"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => openEditModal(item.product_name)}
                />
              </div>
            ))}
          </div>
        </div>


        {/* Add Item Modal */}
        {addItemModalOpen && (
          <div className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col items-center relative">
              <h2 className="text-lg font-semibold mb-6 text-center">Add New Item</h2>
              <input
                type="text"
                id="newitemname"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                placeholder="Item Name"
                value={newItemName}
                onChange={handleInputChange}
              />
              <select
                id="newitemcategory"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                value={newItemCategory}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                id="newitemprice"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                placeholder="Item Price"
                value={newItemPrice}
                onChange={handleInputChange}
              />
              <input
                type="number"
                id="newitemamount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                placeholder="Item Amount"
                value={newItemAmount}
                onChange={handleInputChange}
              />
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md"
                  onClick={closeAddItemModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
                  onClick={addItem}
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restock Modal */}
        {restockModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-12 rounded-lg shadow-lg w-112 flex flex-col items-center relative">
              <h2 className="text-lg font-semibold mb-10 text-center">Restock Items</h2>
              <div className="relative mb-8">
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm mb-16">
                  <div className="h-full border-r border-gray-300 px-3 py-2">
                    <div className="text-gray-400">|</div>
                  </div>
                  <input
                    type="text"
                    id="itemname"
                    className="flex-1 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter Item Name"
                  />
                  <div className="h-full border-r border-gray-300 px-3 py-2">
                    <div className="text-gray-400">|</div>
                  </div>
                  <input
                    type="number"
                    id="itemamount"
                    className="w-28 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Amount"
                    min="0"
                  />
                  <button
                    className="bg-blue-600 text-white px-4 py-2 ml-2 rounded-md shadow-md focus:outline-none"
                    onClick={restockItem}
                  >
                    Restock
                  </button>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-md focus:outline-none mr-2"
                  onClick={closeRestockModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;
