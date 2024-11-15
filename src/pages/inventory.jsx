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

      const handleSearch = () => {
        if (searchInput === '') {
          // If the search input is empty, reset the search results to the full list of items
          setSearchResults(items);
        } else {
          // Otherwise, filter the items based on the search input
          const filteredResults = items.filter(item =>
            item.product_name.toLowerCase().includes(searchInput.toLowerCase())
          );
          setSearchResults(filteredResults);
        }
      };

 // Function to fetch the list of items (you can call this after adding a new item)
const fetchProducts = async () => {
  try {
    const response = await axios.get(`${url}/api/products`);
    setItems(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

    // Function to add a new item
    const addItem = async () => {
      const newItem = {
        product_name: newItemName,
        category_id: newItemCategory,
        original_price: parseFloat(newItemPrice) || 0, // Ensure price is valid
        quantity: parseInt(newItemAmount) || 0, // Ensure amount is valid
      };

      try {
        const response = await axios.post(`${url}/api/products`, newItem);
        if (response.status === 201) {
          // Refetch the products to get the latest data
          fetchProducts();
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

  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <div className="flex flex-col w-full ml-72 bg-white"> {/* Adjust margin-left */}
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg drop-shadow-md mb-6 border">
          <h2 className="text-1xl font-bold">INVENTORY</h2>
        </div>

        {/* Searchbar and Restock Button */}
        <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg drop-shadow-md">
          <div className="relative mt-4 flex items-center space-x-4">
            <div className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md focus-within:border-blue-500 relative h-12">
              <span className="text-black-500 whitespace-nowrap">INVENTORY</span>
              <div className="border-l border-gray-300 h-10 mx-2"></div>
              <input
                type="text"
                id="search" // Add id to search input
                className="flex-grow focus:outline-none px-4 py-2 rounded-md drop-shadow-md sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
                placeholder="Search for items"
                value={searchInput} // Bind search input to state
                onChange={(e) => {
                  handleInputChange(e); // Update state on change
                  if (e.target.value === '') {
                    // If the input is cleared, reset the search results to all items
                    setSearchResults(items);
                  }
                }}
              />
              <button
                className="text-white px-4 py-2 rounded-md drop-shadow-md focus:outline-none bg-blue-500"
                onClick={handleSearch} // Call search handler on click
              >
                Search
              </button>
            </div>
            <button
              className="text-white px-4 py-2 rounded-md drop-shadow-md focus:outline-none bg-blue-500"
              onClick={openRestockModal}
            >
              Restock
            </button>
  
            {/* Add Item Button */}
            <button
              className="text-white px-4 py-2 rounded-md drop-shadow-md focus:outline-none bg-blue-500"
              onClick={openAddItemModal}
            >
              Register
            </button>
          </div>

          {/* Labels */}
          <div className="mt-4 space-y-1">
            <div className="grid grid-cols-7 font-semibold">
              <h2 className="col-span-2">
                Product Name
              </h2>
              <h2 className="col-span-2">
                Product Category
              </h2>
              <h2 className="col-span-1">
                Product Price (PHP)
              </h2>
              <h2 className="col-span-1">
                Product Amount (PCS)
              </h2>
              <h2 className="col-span-1 flex justify-center items-center">
                Edit
              </h2>
            </div>

            {(searchResults.length > 0 ? searchResults : items).map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-7 rounded-lg hover:bg-gray-300 duration-300 text-left border-b border-gray-300 p-1"
              >
                <div className="col-span-2">{item.product_name}</div>
                <div className="col-span-2">{item.category_name}</div>
                <div className="col-span-1">P {item.original_price ? item.original_price : 'N/A'}</div>
                <div className="col-span-1">{item.quantity}</div>
                <div className="col-span-1 flex justify-center items-center">
                  <img
                    src="./src/assets/edit.png"
                    alt="Edit"
                    className="w-5 h-5 cursor-pointer align-items-center"
                    onClick={() => openEditModal(item.product_name)}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Add Item Modal */}
        {addItemModalOpen && (
          <div className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg drop-shadow-md p-6">
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
