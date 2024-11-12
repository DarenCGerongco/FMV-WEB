import { useState, useEffect, useContext } from 'react';
import Navbar from '../components/navbar';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { GlobalContext } from '../../GlobalContext';  // Import GlobalContext

ChartJS.register(ArcElement, Tooltip, Legend);

function Overview() {
  const [salesData, setSalesData] = useState([]);
  const url = import.meta.env.VITE_API_URL;
  const [userNames, setUserNames] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const { id, userName } = useContext(GlobalContext);  // Retrieve id and userName

  // Debugging - log the `id` and `userName` values
  useEffect(() => {
    console.log("Global Context ID:", id);
    console.log("Global Context userName:", userName);
  }, [id, userName]);

  // Fetch order data
  const fetchOrderData = async () => {
    try {
      const response = await axios.get(`${url}/api/purchase-orders-delivery-latest`);
      console.log('Fetched Orders:', response.data); // Log the entire response to see its structure
      setOrders(response.data.orders);  // Set the fetched orders correctly
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };



  // Fetch inventory data
  const fetchInventoryData = async () => {
    try {
      const response = await axios.get(`${url}/api/products`);
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  // console.log("This is from Overview: " + userName);

  // Fetch sales data
  const fetchSalesData = () => {
    const salesdata = [
      { itemName: 'Arlene', itemSold: 'x15', itemRemaining: 'x10' },
      { itemName: 'Kirk Khien', itemSold: 'x10', itemRemaining: 'x5' },
      { itemName: 'Steven Ambatablow', itemSold: 'x20', itemRemaining: 'x15' },
      { itemName: 'Oiled Men', itemSold: 'x30', itemRemaining: 'x20' },
    ];
    setSalesData(salesdata); 
  };

  useEffect(() => {
    fetchUserNames(); // Fetch initial user names
    fetchInventoryData(); // Fetch initial inventory data
    fetchOrderData();  // Fetch initial order data
    fetchSalesData(); // Fetch initial sales data
    
    const intervalId = setInterval(() => {
      fetchUserNames(); // Update user names
      fetchInventoryData(); // Update inventory items
      fetchOrderData(); // Update orders
      fetchSalesData(); // Update sales data
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  const fetchUserNames = async () => {
    try {
      const response = await fetch(`${url}/api/users`);
      const data = await response.json();
      const userNames = data.data.map(user => user.name);
      setUserNames(userNames);
    } catch (error) {
      console.error('Error fetching user names:', error);
    }
  };

  // Data for the pie chart
  const data = {
    labels: ['Arlene', 'Kirk Khien', 'Steven Ambatablow', 'Oiled Men'],
    datasets: [
      {
        label: 'Sales Data',
        data: [300, 50, 100, 150],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const handleInventoryClick = () => {
    navigate('/inventory'); // Redirect to inventory page
  };
  const handleDeliveryManClick = () => {
    navigate('/deliveryman'); // Redirect to deliveryman page
  };

  const handleOrderClick = () => {
    navigate('/order'); // Redirect to order page
  };

  const handleDeliveryClick = () => {
    navigate('/delivery'); // Redirect to delivery page
  };

  const handleSalesClick = () => {
    navigate('/sales'); // Redirect to sales page
  };

  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <div className="flex flex-col xl:w-4/5 ml-80 bg-white">
        <div className="w-11/12 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6 border">
          <h2 className="text-1xl font-bold">
            Management System Overviews   {/* Handle empty userName case */}
          </h2>
          <h2>
            Welcome, {userName || "Unknown User"}
          </h2>
        </div>

        <div className="w-11/12 mx-auto flex space-x-4">
          <div className="flex flex-col space-y-4 w-1/3">
            {/* Order Container */}   
            <div className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-200 duration-300 cursor-pointer" onClick={handleOrderClick}>
              <h3 className="text-lg font-bold mb-4">ORDER (Latest )</h3>
              {Array.isArray(orders) && orders.map((customerData, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg hover:bg-blue-500 duration-300 shadow-md mt-4 group"
                >
                  <div className="text-gray-700 group-hover:text-white text-sm font-bold duration-200">
                    {customerData.customer_name}
                  </div>
                  <div className="text-gray-700 group-hover:text-white text-xs mt-1 duration-200">
                    {customerData.created_at}
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Container */}
            <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
            onClick={handleDeliveryClick}
            >
              <h3 className="text-lg font-bold mb-4">DELIVERY</h3>
              <div className="p-4 rounded-lg shadow-md mt-4 flex justify-between items-center bg-[#8EF7A8]">
                <span className="text-gray-700 text-sm">Confirm Delivery:</span>
                <span className="text-gray-700 text-sm">2</span>
              </div>
              <div className="p-4 rounded-lg shadow-md mt-4 flex justify-between items-center bg-[#E6FCE6]">
                <span className="text-gray-700 text-sm">On Delivery:</span>
                <span className="text-gray-700 text-sm">2</span>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg shadow-md mt-4 flex justify-between items-center">
                <span className="text-gray-700 text-sm">Delivered:</span>
                <span className="text-gray-700 text-sm">2</span>
              </div>
            </div>

            {/* Delivery Man Container */}
            <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
              onClick={handleDeliveryManClick}
              // style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              <h3 className="text-lg font-bold mb-4">DELIVERY MAN ACCOUNT</h3>
              {userNames.map((name, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md mt-4">
                  <p className="text-gray-700 text-sm whitespace-nowrap">{name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column for Larger Containers */}
          <div className="flex flex-col space-y-4 w-2/3">
            {/* Sales Container */}
            <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
            onClick={handleSalesClick}
            >
              <h3 className="text-lg font-bold mb-4">SALES</h3>
              <div className="flex justify-center items-center h-80">
                <div className="w-full h-full max-w-xs">
                  <Pie data={data} options={options} />
                </div>
              </div>
              <div className="bg-white text-sm mt-10 flex border-b">
                <p className="text-gray-500 w-1/3 font-bold ">Item Name</p>
                <p className="text-gray-500 w-1/3 font-bold text-center">Item Sold</p>
                <p className="text-gray-500 w-1/3 font-bold text-center">Item Remaining</p>
              </div>
              {salesData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 rounded-lg shadow-md mt-4 border-b">
                  <p className="text-gray-700 w-1/3">{item.itemName}</p>
                  <p className="text-gray-700 w-1/3 text-center">{item.itemSold}</p>
                  <p className="text-gray-700 w-1/3 text-center">{item.itemRemaining}</p>
                </div>
              ))}
            </div>

            {/* Inventory Container */}   
            <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                onClick={handleInventoryClick}
            > 
              <h3 className="text-lg font-bold mb-4">INVENTORY</h3>
              <div className="bg-white text-sm mt-10 flex border-b">
              </div>
              {inventoryItems.map((item, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md mt-4 flex justify-between items-center border-b">
                  <div className="flex-1">{item.product_name}</div>
                  <div className="flex-1 text-center">{item.category_name}</div>
                  <div className="flex-1 text-right">{item.quantity}</div>
                </div>
              ))}
              </div>           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;