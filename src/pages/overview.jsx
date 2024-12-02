import { useState, useEffect, useContext } from 'react';
import Navbar from '../components/navbar';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { GlobalContext } from '../../GlobalContext';  // Import GlobalContext
import catLoadingGif from './../assets/overview/catJumping.gif'; // Import your GIF file
import Walkin from '../components/walkin';

ChartJS.register(ArcElement, Tooltip, Legend);

function Overview() {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { id, userName } = useContext(GlobalContext);

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
      setOrders(response.data);  // Set the fetched orders correctly
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };

  // Fetch inventory data
  const fetchInventoryData = async () => {
    try {
      const response = await axios.get(`${url}/api/products-overview`);
      console.log('Inventory API response:', response.data);

      // Check if data is in the expected format
      if (Array.isArray(response.data.data)) {
        setInventoryItems(response.data.data);
      } else {
        console.error('Expected an array for inventory items, received:', response.data.data);
        setInventoryItems([]); // Set to empty array if not in expected format
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setInventoryItems([]); // Ensure it's always an array even on error
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
    fetchOrderData();  // Fetch initial order data
    fetchSalesData(); // Fetch initial sales data

    setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 500); // Show spinner for 2 seconds
  }, []);

  const fetchUserNames = async () => {
    try {
      // Update the endpoint to fetch only the needed users
      const response = await axios.get(`${url}/api/users-limited`);
      const data = response.data;
  
      // Log the data to see what is being returned
      console.log("Fetched user data:", data);
  
      // Check if data.data is an array before calling map
      if (data.success && Array.isArray(data.data)) {
        const userNames = data.data.map(user => user.name);
        setUserNames(userNames);
      } else {
        console.error('Expected an array for user data, but got:', data.data);
        setUserNames([]); // Ensure it's always an array even on error or unexpected response
      }
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
    navigate('/employee'); // Redirect to deliveryman page
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
      <Walkin/>
      <div className="flex flex-col xl:w-4/5 bg-white">
        <div className="w-11/12 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6 border">
          <h2 className="text-1xl font-bold">
            Management System Overviews   {/* Handle empty userName case */}
          </h2>
          <h2>
            Welcome, {userName || "Unknown User"}
          </h2>
        </div>
        <div className="w-11/12 mx-auto flex space-x-4">
          {loading ? (
            <div className="flex items-center justify-center w-full h-[768px]">
              <img className='OverView-spinner ' src={catLoadingGif} alt="" />
            </div>
          ): (
            <>
          <div className="flex flex-col space-y-4 w-1/3">
            {/* Order Container */}   
            <div 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:shadow-gray-400 duration-200 cursor-pointer" 
              onClick={handleOrderClick}
            >
              <h3 className="text-lg font-bold mb-4">
                ORDER (WIP)
              </h3>
              {orders.summary && (
                <div className="flex flex-col w-full p-5 bg-white duration-100 shadow-md rounded-lg">
                  <span className="text-black text-center font-bold">
                    Purchase Order Total Value
                  </span>
                  <span className="text-black text-sm ">
                    Initial Revenue:
                  </span>
                  <h1 className="text-white bg-green-500 text-center text-3xl m-1 px-2 py-1 text-left shadow-md font-bold rounded-lg inline-block">
                    ₱{orders.summary.totalMoneyAccumulated}
                  </h1>
                  <span className="text-black mt-2 text-sm">
                    Total Purchase Order Created:
                  </span>
                  <h1 className="text-white bg-red-500 text-3xl text-center m-1 px-2 py-1 text-left shadow-md font-bold rounded-lg inline-block">
                    {orders.summary.totalPurchaseOrders}
                  </h1>
                </div>
              )}
              <div className="flex flex-col w-full p-5 mt-3 bg-white duration-100 shadow-md rounded-lg">
              <span>
                Pending Purchase Order
              </span>
                {Array.isArray(orders.orders) &&
                  
                  orders.orders.map((customerData, index) => (
                    <div
                      key={index}
                      className="p-1 w-full bg-white flex rounded-lg shadow-md my-2 group"
                    >
                      <div className='w-[15%] flex justify-center  '>
                        <span className='text-xs'>
                          # 
                        </span>
                        <span className='text-3xl font-bold items-center'>
                          {customerData.purchase_order_id}
                        </span>
                      </div>
                      <div className='w-[55%] flex flex-col justify-start'>
                        <span className="text-s font-bold text-sm duration-200">
                          {customerData.customer_name}
                        </span>
                        <span className="text-gray-700 text-xs duration-200">
                          {customerData.created_at}
                        </span>
                      </div>
                      <div className='w-[30%] flex justify-end items-center font-bold'>
                        <span className='bg-green-500 px-2 text-white rounded-2xl'>
                          + ₱{customerData.total_worth}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

            </div>

            {/* Delivery Container */}
            <div 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:shadow-gray-400 duration-200 cursor-pointer" 
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

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:shadow-gray-400 duration-200 cursor-pointer"
              onClick={handleDeliveryManClick}
            >
              <h3 className="text-lg font-bold mb-4">EMPLOYEE ACCOUNT</h3>
              {userNames.length > 0 ? (
                userNames.map((name, index) => (
                  <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md mt-4">
                    <p className="text-gray-700 text-sm whitespace-nowrap">{name}</p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No users available</div>
              )}
            </div>
          </div>

          {/* Right Column for Larger Containers */}
          <div className="flex flex-col space-y-4 w-2/3">
            {/* Sales Container */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:shadow-gray-400 duration-200 cursor-pointer"
            onClick={handleSalesClick}
            >
              <h3 className="text-lg font-bold mb-4">SALES</h3>
              <div className="flex justify-center items-center h-80">
                <div className="w-full h-full max-w-xs">
                  <Pie data={data} options={options} />
                </div>
              </div>
              <div className="text-sm mt-10 flex border-b">
                <p className="w-1/3 font-bold ">Item Name</p>
                <p className="w-1/3 font-bold text-center">Item Sold</p>
                <p className="w-1/3 font-bold text-center">Item Remaining</p>
              </div>
              {salesData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 rounded-lg shadow-md mt-4 bg-gray-200 border-b">
                  <p className="text-gray-700 w-1/3">{item.itemName}</p>
                  <p className="text-gray-700 w-1/3 text-center">{item.itemSold}</p>
                  <p className="text-gray-700 w-1/3 text-center">{item.itemRemaining}</p>
                </div>
              ))}
            </div>

            {/* Inventory Container */}   
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:shadow-gray-400 duration-200 cursor-pointer"
              onClick={handleInventoryClick}
          > 
            <h3 className="text-lg font-bold">INVENTORY</h3>
            <div className="bg-white text-sm flex border-b">
            </div>
            {inventoryItems.length > 0 ? (
              inventoryItems.map((item, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md mt-4 flex justify-between items-center border-b">
                  <div className="flex-1">{item.product_name}</div>
                  <div className="flex-1 text-center">{item.category_name}</div>
                  <div className="flex-1 text-right">{item.quantity}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-1">
                All products are above 100+ quantity
              </div>
            )}
          </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Overview;