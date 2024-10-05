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
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results

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
      case 'search': // Capture search input
        setSearchInput(value);
        break;
      default:
        break;
    }
  };

  // Function to handle search
  const handleSearch = () => {
    const filteredResults = items.filter(item => 
      item.product_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setSearchResults(filteredResults);
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
      if (item.product_name === itemName) { // Updated to match product_name
        return {
          ...item,
          quantity: parseInt(item.quantity) + itemAmount // Updated to match quantity
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

  // Function to highlight matching text
  const highlightText = (text, search) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      part.toLowerCase() === search.toLowerCase() 
        ? <span key={index} className="bg-yellow-300">{part}</span> 
        : part
    );
  };

  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <div className="flex flex-col w-full ml-72 bg-white"> {/* Adjust margin-left */}
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-2xl mb-6 border">
          <h2 className="text-1xl font-bold">INVENTORY</h2>
        </div>

        {/* Searchbar and Restock Button */}
        <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg shadow-2xl">
          <div className="relative mt-4 flex items-center space-x-4">
            <div className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md shadow-2xl focus-within:border-blue-500 relative h-12">
              <span className="text-black-500 whitespace-nowrap">INVENTORY</span>
              <div className="border-l border-gray-300 h-10 mx-2"></div>
              <input
                type="text"
                id="search" // Add id to search input
                className="flex-grow focus:outline-none px-4 py-2 rounded-md shadow-2xl sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
                placeholder="Search for items"
                value={searchInput} // Bind search input to state
                onChange={handleInputChange} // Update state on change
              />
              <button
                className="text-white px-4 py-2 rounded-md shadow-2xl focus:outline-none bg-blue-600"
                onClick={handleSearch} // Call search handler on click
              >
                Search
              </button>
            </div>
            <button
              className="text-white px-4 py-2 rounded-md shadow-2xl focus:outline-none bg-blue-600"
              onClick={openRestockModal}
            >
              Restock
            </button>
  
            {/* Add Item Button */}
            <button
              className="text-white px-4 py-2 rounded-md shadow-2xl focus:outline-none bg-blue-600"
              onClick={openAddItemModal}
            >
              Register
            </button>
          </div>

          {/* Labels */}
          <div>
            <h3 className="text-sm mt-6 px-4 text-gray-400 flex justify-between"> 
              <div className="w-1/5">Item Name</div>
              <div className="relative left-[10px] w-1/5">Item Category</div>
              <div className="w-1/5">Item Price</div>
              <div className="relative left-[-10px] w-1/5">Item Amount</div>
              <div className="relative left-[-15px] w-1/13">Edit</div>
            </h3>
          </div>

          <div className="mt-4 space-y-4 mb-10 px-4">
            {(searchResults.length > 0 ? searchResults : items).map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-2xl">
                <div className="w-1/5">{highlightText(item.product_name, searchInput)}</div>
                <div className="w-1/5">{item.category_name}</div>
                <div className="w-1/5">{item.original_price ? item.original_price : 'N/A'}</div>
                <div className="w-1/5">{item.quantity}</div>
                <div className="w-1/13">
                  <img
                    src="./src/assets/edit.png"
                    alt="Edit"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => openEditModal(item.product_name)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Item Modal */}
        {addItemModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Add Item</h2>
              <input
                type="text"
                id="newitemname"
                placeholder="Item Name"
                value={newItemName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              />
              <select
                id="newitemcategory"
                value={newItemCategory}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <input
                type="number"
                id="newitemprice"
                placeholder="Item Price"
                value={newItemPrice}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              />
              <input
                type="number"
                id="newitemamount"
                placeholder="Item Amount"
                value={newItemAmount}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              />
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={addItem}
                >
                  Add
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={closeAddItemModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restock Modal */}
        {restockModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Restock Item</h2>
              <input
                type="text"
                id="itemname"
                placeholder="Item Name"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              />
              <input
                type="number"
                id="itemamount"
                placeholder="Amount to Add"
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              />
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={restockItem}
                >
                  Restock
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
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
