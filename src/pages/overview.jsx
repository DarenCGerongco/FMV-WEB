import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

ChartJS.register(ArcElement, Tooltip, Legend);

function Overview() {
  const [salesData, setSalesData] = useState([]);
  const url = import.meta.env.VITE_API_URL;
  const [userNames, setUserNames] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch inventory data
  const fetchInventoryData = async () => {
    try {
      const response = await axios.get(`${url}/api/products`);
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

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
    fetchSalesData(); // Fetch initial sales data
    
    const intervalId = setInterval(() => {
      fetchUserNames(); // Update user names
      fetchInventoryData(); // Update inventory items
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
    navigate('/inventory'); // Redirect to Inventory page
  };
  const handleDeliveryManClick = () => {
    navigate('/deliveryman'); // Redirect to deliveryman page
  };

  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <div className="flex flex-col xl:w-4/5 ml-80 bg-white">
        <div className="w-11/12 mx-auto bg-white p-6 m-3 rounded-lg shadow-2xl mb-6 border">
          <h2 className="text-1xl font-bold">Management System Overview</h2>
        </div>

        <div className="w-11/12 mx-auto flex space-x-4">
          <div className="flex flex-col space-y-4 w-1/3">
            {/* Order Container */}
            <div className="bg-white p-6 rounded-lg shadow-2xl">
              <h3 className="text-lg font-bold mb-4">ORDER</h3>
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4 flex justify-between items-center">
                <span className="text-gray-700 text-sm">Barangay Lumbia</span>
                <span className="text-gray-700 text-sm">06/04/2024</span>
              </div>
            </div>

            {/* Delivery Container */}
            <div className="bg-white p-6 rounded-lg shadow-2xl">
              <h3 className="text-lg font-bold mb-4">DELIVERY</h3>
              <div className="p-4 rounded-lg shadow-sm mt-4 flex justify-between items-center bg-[#8ef7a8]">
                <span className="text-gray-700 text-sm">Confirm Delivery:</span>
                <span className="text-gray-700 text-sm">2</span>
              </div>
              <div className="p-4 rounded-lg shadow-sm mt-4 flex justify-between items-center bg-[#E6FCE6]">
                <span className="text-gray-700 text-sm">On Delivery:</span>
                <span className="text-gray-700 text-sm">2</span>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4 flex justify-between items-center">
                <span className="text-gray-700 text-sm">Delivered:</span>
                <span className="text-gray-700 text-sm">2</span>
              </div>
            </div>

            {/* Delivery Man Container */}
            <div className="bg-white p-6 rounded-lg shadow-2xl cursor-pointer"
            onClick={handleDeliveryManClick}
            // style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              <h3 className="text-lg font-bold mb-4">DELIVERY MAN ACCOUNT</h3>
              {userNames.map((name, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4">
                  <p className="text-gray-700 text-sm whitespace-nowrap">{name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column for Larger Containers */}
          <div className="flex flex-col space-y-4 w-2/3">
            {/* Sales Container */}
            <div className="bg-white p-6 rounded-lg shadow-2xl">
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
                <div key={index} className="flex justify-between items-center p-4 rounded-lg shadow-2xl mt-4 border-b">
                  <p className="text-gray-700 w-1/3">{item.itemName}</p>
                  <p className="text-gray-700 w-1/3 text-center">{item.itemSold}</p>
                  <p className="text-gray-700 w-1/3 text-center">{item.itemRemaining}</p>
                </div>
              ))}
            </div>

            {/* Inventory Container */}   
            <div className="bg-white p-6 rounded-lg shadow-2xl cursor-pointer"
                onClick={handleInventoryClick}
            > 
              <h3 className="text-lg font-bold mb-4">INVENTORY</h3>
              <div className="bg-white text-sm mt-10 flex border-b">
              </div>
              {inventoryItems.map((item, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4 flex justify-between items-center border-b">
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