import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';
// import { GlobalContext } from '../../GlobalContext';  // Import GlobalContext

function Order() {
  const url = import.meta.env.VITE_API_URL;

  // const { id } = useContext(GlobalContext);  // Access the global id

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [itemsOrderedModalOpen, setItemsOrderedModalOpen] = useState(false);
  const [createDeliveryModalOpen, setCreateDeliveryModalOpen] = useState(false);
  const [newDeliveryModalOpen, setNewDeliveryModalOpen] = useState(false);
  const [productsListed, setProductsListed] = useState([]); // State for stored products
  //   product_id: product.product_ID,

  // ])
  // const [createItemsOrderedModalOpen, setCreateItemsOrderedModalOpen] = useState(false);
  const [viewDeliveriesModalOpen, setViewDeliveriesModalOpen] = useState(false);

  // Start - THIS IS THE DATA OF Purchase Order Record
    const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  // End - THIS IS THE DATA OF Purchase Order Record

  const [newOrder, setNewOrder] = useState({
    deliveredTo: '',
    street: '',
    city: '',
    barangay: '',
    zipcode: '',
    date: '',
    items: [],
  });

  const openAddModal = () => {
    setAddModalOpen(true);
    setNewOrder({
      deliveredTo: '',
      street: '',
      city: '',
      barangay: '',
      zipcode: '',
      date: '',
      items: [],
    });
  };

  //START -  THIS WILL CLOSE BOTH THE VIEW AREA AND THE CREATE PO 
    const closeAddModal = () => {
      setAddModalOpen(false);
      closeViewModal();
    }
  //END -  THIS WILL CLOSE BOTH THE VIEW AREA AND THE CREATE PO 

 

  const handleAddOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



        //! YAW SA HILABTI NI DIRE 
          useEffect(() => {
            const fetchOrders = async () => {
              try {
                const response = await fetch(`${url}/api/purchase-orders-delivery`);
                const data = await response.json();

                const combinedData = data.map(purchaseOrderData =>({
                  purchase_order_id: purchaseOrderData.purchase_order_id,
                  customer_name: purchaseOrderData.customer_name,
                  street: purchaseOrderData.address.street,
                  barangay: purchaseOrderData.address.barangay,
                  province: purchaseOrderData.address.province,
                  created_at: purchaseOrderData.created_at,
                }));

                setPurchaseOrderData(combinedData);

                console.log(combinedData);
                // const names = data.map(name => name.customer_name);
                // console.log(data);
                // const addresses = data.map(byAddress => byAddress.address)
                // addresses.forEach(byAddress => {
                //   console.log(byAddress.barangay)
                // })

                // setCustomerName(names); // Update the state with customer names

                
                // combinedData.forEach(order => {
                //   console.log('Order Date:', order.created_at); // Log the date in the console
                // });
          
                //! If you still want to log the customer names separately:
                // const names = data.map(name => name.customer_name);
                // setCustomerName(names); // Update the state with customer names
              } catch (error) {
                console.error('Error fetching orders:', error);
              }
            };
          
            // Fetch orders initially
            fetchOrders();
          
            // Set up a recurring interval to fetch the orders periodically
            const intervalId = setInterval(fetchOrders, 10000); // 10000ms = 10 seconds
          
            // Cleanup interval when the component is unmounted
            return () => clearInterval(intervalId);
          }, [url]); // Dependency array ensures the effect runs only when the URL changes
        //! YAW SA HILABTI NI DIRE 
          

  const handlePurchaseOrderClick = (purchaseOrderId) => {
    console.log(purchaseOrderId)
  }


  // const createOrder = async () => {
  //   const orderData = {
  //     user_id: userId, // Assuming you have this in your state
  //     customer_name: customerName, // From your state/input
  //     status: orderStatus, // From your state/input
  //     sale_type_id: saleTypeId, // From your state/input
  //     address: {
  //       street: address.street,
  //       barangay: address.barangay,
  //       zip_code: address.zip_code,
  //       province: address.province,
  //     },
  //     product_details: orderedItems.map(item => ({
  //       product_id: item.product_id,
  //       quantity: item.quantity,
  //       price: item.price,
  //     })),
  //   };
  
  //   try {
  //     const response = await axios.post(`${url}/api/purchase-orders-delivery`, orderData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  
  //     // Handle successful response
  //     console.log('Order created successfully:', response.data);
  //     // You can also perform further actions like closing the modal or resetting the state here.
  
  //   } catch (error) {
  //     // Handle error response
  //     if (error.response) {
  //       // Server responded with a status other than 200 range
  //       console.error('Error creating order:', error.response.data);
  //     } else {
  //       // Network error or other issues
  //       console.error('Error creating order:', error.message);
  //     }
  //   }
  // };
  
  


  // View Modal


  const openViewModal = () => {
  setViewModalOpen(true);
};
const closeViewModal = () => setViewModalOpen(false);


 // START Create Items Ordered AREA

  // START BY SHOWING IT IN MODAL


  const [createItemsOrderedModalOpen, setCreateItemsOrderedModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [quantity, setQuantity] = useState(1); // Default quantity to 1
  const [price, setPrice] = useState(''); // State for price
  const [selectedProduct, setSelectedProduct] = useState(null); // Temporarily hold selected product
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]); // Define state for products
  const [orderedItems, setOrderedItems] = useState([]); // State for products to order


    const openCreateItemsOrderedModal = () => {
      setCreateItemsOrderedModalOpen(true);
    };


  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.product_name);
    setShowDropdown(false);
  };

  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0 && price > 0) {
      const newProduct = {
        product_id: selectedProduct.product_id,
        product_name: selectedProduct.product_name,
        quantity: Number(quantity),
        price: Number(price),
      };

      setProductsListed([...productsListed, newProduct]); // Add new product to the list

      // Reset fields
      setSelectedProduct(null);
      setQuantity(1);
      setPrice(0); // Reset price
    }
  };
  
    
    // START FETCH DATA
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${url}/api/products`);
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      fetchProducts();
    }, []);
  
    // Function to save products
    const handleSave = () => {
      console.log('Products Listed:', productsListed);
      // Here you can add functionality to send productsListed to your API
    };

  // END BY SHOWING IT IN MODAL


// END Create Items Ordered AREA




const closeCreateItemsOrderedModal = () => {
  setCreateItemsOrderedModalOpen(false);
};

// Items Ordered Modal
const openItemsOrderedModal = () => setItemsOrderedModalOpen(true);
const closeItemsOrderedModal = () => {
  setItemsOrderedModalOpen(false);
};

// Create Delivery Modal
const openCreateDeliveryModal = () => {
  setCreateDeliveryModalOpen(true);
};
const closeCreateDeliveryModal = () => {
  setCreateDeliveryModalOpen(false);
};

// View Deliveries Modal
const openViewDeliveriesModal = () => setViewDeliveriesModalOpen(true);
const closeViewDeliveriesModal = () => setViewDeliveriesModalOpen(false);

return (
    <div className="flex w-full bg-white">
      <Navbar />
      <div className="flex flex-col w-full ml-72 bg-white">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-2xl mb-6 border">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM ORDER</h2>
        </div>
        <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg shadow-2xl">
          <div className="relative mt-4 flex items-center space-x-4">
            <div className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-md shadow-2xl focus-within:border-blue-500 relative h-12">
              <span className="text-black-500 whitespace-nowrap">ORDER</span>
              <div className="border-l border-gray-300 h-10 mx-2"></div>
              <input
                type="text"
                className="flex-grow focus:outline-none px-4 py-2 rounded-md shadow-2xl sm:text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full"
                placeholder="Search for Ongoing Order"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl focus:outline-none">
                Search
              </button>
            </div>
            <button
              className="bg-blue-500 text-black px-4 py-2 bg-blue-500 text-white rounded-md shadow-2xl focus:outline-none"
              onClick={openAddModal}
            >
              +
            </button>
          </div>
          <div id="order-container" className="mt-4 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between bg-white-200 p-4 rounded-lg shadow-2xl relative"
              >
                <div className="information flex">
                  <div className="font-bold">{order.deliveredTo}</div>
                  <div className="font-bold ml-5">|</div>
                  <div className="font-bold ml-5">{order.address}</div>
                  <div className="font-bold ml-5">|</div>
                  <div className="font-bold ml-5">{order.date}</div>
                </div>
                <div className="settings">
                  <div className="flex space-x-2">
                    <img
                      src="./src/assets/edit.png"
                      alt="Edit"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => console.log('Edit')}
                    />
                    <img
                      src="./src/assets/delete.png"
                      alt="Delete"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => console.log('Delete')}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* START SHOW PURCHASE ORDERS */}
          <div className="w-4/5 mx-auto mt-6">
            {/* Header */}
              <div>
                <h3 className="text-sm px-4 text-gray-400 flex justify-between">
                  <div className="relative left-[30px] flex-1 text-left">Delivered to</div>
                  <div className="relative left-[10px] flex-1 text-left">Address</div>
                  <div className="relative left-[-10px] flex-1 text-left">Date</div>
                </h3>
              </div>
            {/* Header */}

            {/* Customer's Data */}
              {purchaseOrderData.map((customerData, index) => (
                <div
                  key={index}
                  onClick={() => handlePurchaseOrderClick(customerData.purchase_order_id)}
                  className="bg-white p-6 m-6 rounded-lg shadow-2xl mb-1 border transition"
                >
                  <div className="flex justify-between">
                    {/* Delivered to */}
                    <p className="flex-1 text-1xl text-left">{index + 1}. {customerData.customer_name}</p>
                    
                    {/* Address */}
                    <p className="flex-1 text-sm text-gray-700 text-left">{customerData.street}, {customerData.barangay}, {customerData.province}</p>
                    
                    {/* Date */}
                    <p className="flex-1 text-sm text-gray-700 text-left">{customerData.created_at}</p>
                  </div>
                </div>
              ))}
            {/* Customer's Data */}
          </div>
        {/* END SHOW PURCHASE ORDERS */}



      {/* Add Modal */}
      {addModalOpen && (
        <div
          id="addModal"
          className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
        >
          <div className="bg-white p-6 rounded-lg shadow-2xl w-1/3">
            <h3 className="text-center text-lg font-bold mb-4">Create Purchase Order</h3>
            
            {/* Delivered To Field */}
            <div className="mb-4 relative">
              <input
                type="text"
                id="deliveredTo"
                name="deliveredTo"
                placeholder="Delivered To"
                className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newOrder.deliveredTo}
                onChange={handleAddOrderChange}
              />
            </div>
            
            {/* Address Fields */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  id="street"
                  name="street"
                  placeholder="Street"
                  className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.street}
                  onChange={handleAddOrderChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.city}
                  onChange={handleAddOrderChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="barangay"
                  name="barangay"
                  placeholder="Barangay"
                  className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.barangay}
                  onChange={handleAddOrderChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  placeholder="Zipcode"
                  className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newOrder.zipcode}
                  onChange={handleAddOrderChange}
                />
              </div>
            </div>
            
            {/* Deadline Date Field */}
            <div className="mb-4">
              <label htmlFor="date" className="block text-gray-700">Deadline Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                className="w-full p-4 rounded-lg shadow-2xl mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newOrder.date}
                onChange={handleAddOrderChange}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end p-4">
              <div className="flex flex-col items-end space-y-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl w-32"
                  onClick={openViewModal}
                >
                  View
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-white-500 text-black px-4 py-2 border border-gray-300 rounded-md shadow-2xl w-32"
                    onClick={closeAddModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-2xl w-32"
                    // onClick={submitAddModal}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && (
        <div
          id="viewModal"
          className="modal fixed top-0 right-10 w-1/4 h-full flex justify-start items-center"
        >
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full">
            <div className="bg-blue-500 text-white text-center py-2 mb-4 rounded-md">
              <h3 className="text-lg font-bold">View Options</h3>
            </div>
            <ul className="list-none pl-0">
            <li
                className="mb-4 cursor-pointer hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md text-center transition-all"
                onClick={openCreateItemsOrderedModal} // Open create items ordered modal
              >
                Create items ordered
            </li>
            <li
              className="mb-4 cursor-pointer hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md text-center transition-all"
              onClick={openItemsOrderedModal} // Open items ordered modal
            >
              View items ordered
            </li>
            <li className="mb-4">
              <button
                className="bg-blue-500 text-white w-full hover:bg-blue-700 px-4 py-2 rounded-md transition-all"
                onClick={openCreateDeliveryModal} // Function to open create delivery modal
              >
                Create deliveries
              </button>
            </li>

              <li
          className="mb-4 cursor-pointer hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md text-center transition-all"
          onClick={openViewDeliveriesModal} // Open view deliveries modal
        >
          View Deliveries
        </li>
          
            </ul>
            <div className="flex justify-end p-4">
              <button
                className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md shadow-2xl w-32 transition-all"
                onClick={closeViewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start listing of products */}
      {createItemsOrderedModalOpen && (
        <div className="modal fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-1/2">
            <h3 className="text-lg font-bold text-center mb-4">Create Items Ordered</h3>

            <div className="flex p-4 items-center space-between">
              <div className="relative w-100 flex">
                <input
                  type="number"
                  placeholder="Price"
                  className="border border-gray-300 p-2 rounded-md w-full mb-2"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                />
                <input
                  type="text"
                  placeholder="Search for a product"
                  className="border border-gray-300 p-2 rounded-md w-full mb-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setShowDropdown(false)}
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  className="border border-gray-300 p-2 rounded-md w-full mb-2"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />


                {showDropdown && (
                  <div className="absolute left-0 right-0 mt-11 border border-gray-300 rounded-md bg-white z-10 max-h-48 overflow-y-auto shadow-lg">
                    {products
                      .filter(product =>
                        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(product => (
                        <div
                          key={product.product_id}
                          className="flex p-3 justify-between border-b border-gray-300 py-2 cursor-pointer hover:bg-gray-100"
                          onMouseDown={() => handleProductSelect(product)}
                        >
                          <span>{product.product_id}. {product.product_name}</span>
                          <span>Available: {product.quantity}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className='flex items-center bg-custom-blue rounded-md p-2 ml-2'>
                <button className='md:text-white' onClick={handleAddProduct}>
                  Add
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h3>Products Listed:</h3>
              <div className="border-t border-gray-300">
                {productsListed.map((item, index) => (
                  <div key={index} className="flex justify-between border-b border-gray-300 py-2">
                    <span>₱ {item.price.toFixed(2)}</span>
                    <span>{item.product_name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                onClick={handleSave} // Call handleSave on click
              >
                Save
              </button>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white hover:bg-gray-700 px-4 py-2 rounded-md"
                onClick={() => setCreateItemsOrderedModalOpen(false)} // Closing the modal
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Start listing of products */}


      {itemsOrderedModalOpen && (
        <div
          id="itemsOrderedModal"
          className="modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center"
        >
          <div className="bg-white p-6 rounded-lg shadow-2xl w-1/3">
            <h3 className="text-center text-lg font-bold mb-5">Items Ordered</h3>
            
            {/* Static container for items */}
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
              <div className="flex flex-col">
                <div className="border-b border-gray-300 pb-2 mb-2 flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="font-semibold">Item 1</h4>
                    <p className="text-gray-500">Amount: 2</p> {/* Amount below item name */}
                  </div>
                  <p className="ml-4">Price: $100</p> {/* Price on the right */}
                </div>
                <div className="border-b border-gray-300 pb-2 mb-2 flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="font-semibold">Item 2</h4>
                    <p className="text-gray-500">Amount: 1</p> {/* Amount below item name */}
                  </div>
                  <p className="ml-4">Price: $200</p> {/* Price on the right */}
                </div>
                <div className="border-b border-gray-300 pb-2 mb-2 flex justify-between items-start">
                  <div className="flex flex-col">
                    <h4 className="font-semibold">Item 3</h4>
                    <p className="text-gray-500">Amount: 5</p> {/* Amount below item name */}
                  </div>
                  <p className="ml-4">Price: $50</p> {/* Price on the right */}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md"
                onClick={closeItemsOrderedModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}







 {/* Create Delivery Modal */}
{createDeliveryModalOpen && (
  <div
    id="createDeliveryModal"
    className="modal fixed inset-0 flex justify-center items-center z-50"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Optional: adds a semi-transparent background
  >
    <div className="bg-white p-6 rounded-lg shadow-2xl w-2/4"> {/* Modal width */}
      <div className="bg-blue-600 text-white text-center py-2 mb-4 rounded-md">
        <h3 className="text-lg font-bold">Create Delivery</h3>
      </div>
      <form>
        {/* Input fields for creating a delivery */}
        <div className="mb-4">
          <input
            type="text"
            id="deliveredTo"
            className="border border-gray-300 p-2 w-full rounded-md"
            placeholder="Delivered to"
          />
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md w-full"
              placeholder="Str."
            />
          </div>
          <div>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md w-full"
              placeholder="City"
            />
          </div>
          <div>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md w-full"
              placeholder="Barangay"
            />
          </div>
          <div>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md w-full"
              placeholder="Zipcode"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="deliveryDate"></label>
          <input
            type="text"
            id="deliveryDate"
            className="border border-gray-300 p-2 w-full rounded-md"
            placeholder="Enter delivery date"
          />
        </div>

        {/* Static Delivery Man Section */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold" htmlFor="deliveryMan">Delivery Man:</label>
          <div className="border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto"> {/* Fixed container */}
            <div className="flex flex-col space-y-2">
              <div className="p-2 rounded-md">MufFEy</div>
              <div className="p-2 rounded-md">Wat The dOg</div>
              <div className="p-2 rounded-md">GroGgy</div>
            </div>
          </div>
        </div>

        {/* Add Item Section */}
        <div className="mb-4 flex items-center">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md w-full"
            placeholder="Add Item"
          />
          <button
            type="button"
            className="bg-blue-600 text-white hover:bg-blue-500 px-3 py-2 rounded-md ml-2"
            onClick={() => {}}
          >
            Add
          </button>
        </div>
        <div className="flex mt-20 justify-end space-x-2">
          <button
            className="bg-gray-500 text-white hover:bg-gray-700 px-3 py-1 rounded-md shadow-2xl transition-all"
          >
            Save
          </button>
          <button
            className="bg-gray-500 text-white hover:bg-gray-700 px-3 py-1 rounded-md shadow-2xl transition-all"
            onClick={closeCreateDeliveryModal}
          >
            Close
          </button>

          <button
            type="button"
            className="bg-blue-600 text-white hover:bg-blue-500 px-3 py-1 rounded-md shadow-2xl transition-all"
            onClick={() => {
              closeCreateDeliveryModal(); // Close the current modal
              setNewDeliveryModalOpen(true); // Open the new modal
            }}
          >
            Create Delivery
          </button>
        </div>
      </form>
    </div>
  </div>
)}



{/* New Delivery Modal */ }
{newDeliveryModalOpen && (
  <div
    id="newDeliveryModal"
    className="modal fixed inset-0 flex justify-center items-center z-50"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
  >
    <div className="bg-white p-6 rounded-lg shadow-2xl w-2/4">
      <div className="bg-blue-600 text-white text-center py-2 mb-4 rounded-md">
        <h3 className="text-lg font-bold">New Delivery Created</h3>
      </div>

      {/* Delivery Details */}
      <div className="mb-4">
        <p><strong>Delivered to:</strong> Barangay Lumbia</p>
      </div>
      <div className="mb-4">
        <p><strong>Address:</strong> Materson ave, Lumbia, Cagayan de Oro City, 9000</p>
      </div>
      <div className="mb-4">
        <p><strong>Date Delivered:</strong> 06/04/24</p>
      </div>
      <div className="mb-4">
        <p><strong>Delivery Man:</strong> Daren Rebote</p>
      </div>

      {/* Items Ordered Container */}
      <div className="mb-6 p-4 bg-gray-100 rounded-md shadow-md">
        <div className="flex justify-between">
          <span className="font-bold">₱ 1500</span>
          <span className="font-bold">Submersible Pump</span>
          <span className="font-bold">x5</span>
        </div>
      </div>

      {/* Cancel and Save Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          className="bg-gray-500 text-white hover:bg-gray-700 px-4 py-2 rounded-md shadow-2xl transition-all"
          onClick={() => setNewDeliveryModalOpen(false)} // Cancel button to close the modal
        >
          Cancel
        </button>

        <button
          className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-md shadow-2xl transition-all"
          onClick={() => {
            // Save logic here
            setNewDeliveryModalOpen(false); // You can also close the modal after saving if needed
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

{/* View Deliveries Modal */}
{viewDeliveriesModalOpen && (
  <div
    id="viewDeliveriesModal"
    className="modal fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
  >
    <div className="bg-white p-6 rounded-lg shadow-2xl w-3/5 max-h-[90vh] overflow-y-auto">
      <div className="bg-blue-500 text-white text-center py-2 mb-4 rounded-md">
        <h3 className="text-lg font-bold">View Deliveries</h3>
      </div>

      {/* Delivery 1 */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h4 className="font-bold">Delivery 1</h4>
         
        </div>
        <p className="text-gray-500">Delivered to: <span className="font-bold">Barangay Lumbia</span></p>
        <p className="text-sm text-gray-500">Address: Masterson Ave, Lumbia, Cagayan de Oro City, 9000</p>
        <p className="text-sm text-gray-500">Date Delivered: 06/04/2024</p>
        <p className="text-sm text-gray-500">Delivery man: <span className="font-bold">Daren Rebote</span></p>
        
        {/* Separate Items for Delivery 1 */}
        <div className="mt-4">
          <div className="border border-gray-300 rounded-md p-4 mb-2">
            <div className="flex justify-between">
              <p>₱1,500</p>
              <p>Submersible Pump</p>
              <p>x5</p>
            </div>
          </div>
          <div className="border border-gray-300 rounded-md p-4 mb-2">
            <div className="flex justify-between">
              <p>₱500</p>
              <p>Submersible Motor</p>
              <p>x1</p>
            </div>
          </div>
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex justify-between">
              <p>₱50</p>
              <p>1 Inch Tube 1 Meter</p>
              <p>x25</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery 2 */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h4 className="font-bold">Delivery 2</h4>
        
        </div>
        <p className="text-gray-500">Delivered to: <span className="font-bold">Barangay Lumbia</span></p>
        <p className="text-sm text-gray-500">Address: Masterson Ave, Lumbia, Cagayan de Oro City, 9000</p>
        <p className="text-sm text-gray-500">Date Delivered: 06/09/2024</p>
        <p className="text-sm text-gray-500">Delivery man: <span className="font-bold">Owen Cabarribas</span></p>
        
        {/* Separate Items for Delivery 2 */}
        <div className="mt-4">
          <div className="border border-gray-300 rounded-md p-4 mb-2">
            <div className="flex justify-between">
              <p>₱1,500</p>
              <p>Submersible Pump</p>
              <p>x5</p>
            </div>
          </div>
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex justify-between">
              <p>₱50</p>
              <p>1 Inch Tube 1 Meter</p>
              <p>x15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Close button */}
      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md transition-all"
          onClick={closeViewDeliveriesModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default Order;