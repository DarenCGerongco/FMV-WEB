import { useState, useEffect, useContext } from 'react';
import Navbar from '../components/navbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { GlobalContext } from '../../GlobalContext';  // Import GlobalContext
import catLoadingGif from './../assets/overview/catJumping.gif'; // Import your GIF file
import { Bar } from 'react-chartjs-2'; // Import Bar from react-chartjs-2
import QuickButtons from '../components/quickButtons';

import { MdArrowDropDownCircle } from "react-icons/md";
import { CiMapPin } from "react-icons/ci";
import { SlPin } from "react-icons/sl";



ChartJS.register(ArcElement, Tooltip, Legend);

function Overview() {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [userNames, setUserNames] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { id, userName } = useContext(GlobalContext);
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [deliveriesCounts, setDeliveriesCounts] = useState({
    success: 0,
    on_delivery: 0,
    pending: 0,
    failed: 0
  });

  const [reorder, setReorder] = useState([]);
  const [countSortedData, setCountSortedData] = useState('');
  
  const monthlyRecordsUrl = `${import.meta.env.VITE_API_URL}/api/Insights/Monthly-Records`;

  // sales fetching
  useEffect(() => {
    fetchMonthlyRecords(); // Fetch monthly data on page load
  }, [year]); // Trigger on year change

  const fetchMonthlyRecords = async () => {
    try {
      const currentYear = new Date().getFullYear();
  
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Insights/View/Annual-Data/Chart`, {
        params: { year: currentYear },
      });
  
      const data = response.data.monthlyData || [];
  
      // Define all the months
      const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
      // Initialize salesData and damagesData with 0 for all months
      const salesData = Array(12).fill(0); 
      const damagesData = Array(12).fill(0);
  
      // Map the response data to the correct month
      data.forEach(item => {
        let month = item.month;
  
        // Ensure month is a string
        if (typeof month !== 'string') {
          month = String(month);  // Convert month to string if it's not
        }
  
        const monthIndex = allMonths.indexOf(allMonths[month - 1]); // Adjust for zero-based index
  
        if (monthIndex >= 0) {
          // Update the sales and damages data for the corresponding month
          salesData[monthIndex] = parseFloat(item.monthlyTotalSales?.replace(/,/g, "") || 0);
          damagesData[monthIndex] = parseFloat(item.monthlyTotalDamageCost?.replace(/,/g, "") || 0);
        }
      });
  
      // Update the chart data
      setChartData({
        labels: allMonths,  // Labels for all months
        datasets: [
          {
            label: "Total Revenue (Php)",
            backgroundColor: "rgb(147, 250, 165, 1)",
            borderRadius: 10,
            data: salesData, // Sales data for all months
          },
          {
            label: "Total Damages (Php)",
            backgroundColor: "rgba(246, 71, 71, 1)",
            borderRadius: 10,
            data: damagesData, // Damages data for all months
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch monthly records:", error);
    }
  };


  
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

  // Fetch deliveries count
  const fetchDeliveryCounts = async () => {
    try {
      const response = await axios.get(`${url}/api/deliveries/overview`);
      setDeliveriesCounts(response.data);
    } catch (error) {
      console.error('Error fetching delivery counts:', error);
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



  const fetchUserNames = async () => {
    try {
      // Update the endpoint to fetch only the needed users
      const response = await axios.get(`${url}/api/users-limited`);
      const data = response.data;
  
      console.log("Fetched user data:", data);
  
      // Check if the response contains 'data' and it's an array
      if (data.success && Array.isArray(data.data)) {
        // Map both name and created_at to the state
        const userNamesWithCreatedAt = data.data.map(user => ({
          name: user.name,
          created_at: user.created_at // Use the correct field for 'created_at'
        }));
  
        setUserNames(userNamesWithCreatedAt); // Set both name and created_at
      } else {
        console.error('Expected an array for user data, but got:', data.data);
        setUserNames([]); // Ensure it's always an array even on error or unexpected response
      }
    } catch (error) {
      console.error('Error fetching user names:', error);
    }
  };

  // Fetch reorder data with pagination
  const fetchReorder = async () => {
    setLoading(true);
    try {
      // Fetch the reorder level data without pagination (no page or limit params)
      const response = await axios.get(`${url}/api/view/reorder-level`, {
        params: {}, // No pagination
      });
  
      // Sort the fetched data by current_quantity in ascending order (lowest first)
      const sortedData = response.data.data.sort((a, b) => a.current_quantity - b.current_quantity);
  
      setCountSortedData(sortedData.length);
      // console.log(sortedData.length);
      // console.log(sortedData);
      // Set the sorted data
      setReorder(sortedData);
    } catch (error) {
      console.error("Failed to fetch reorder data:", error);
    } finally {
      setLoading(false);
    }
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

  const handleReorderClick = () => {
    navigate('/inventory/reorder')
  }

  const handleSalesClick = () => {
    navigate('/sales'); // Redirect to sales page
  };

  useEffect(() => {
    fetchUserNames(); // Fetch initial user names
    fetchInventoryData(); // Fetch initial inventory data
    fetchOrderData();  // Fetch initial order data
    fetchDeliveryCounts(); // Ensure to fetch delivery counts
    fetchReorder(); // Fetch Reorder
    setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 500); // Show spinner for 2 seconds
  }, []); // This will run once when the component mounts


  const [isShadowActive, setIsShadowActive] = useState(false);

  useEffect(() => {
    if (countSortedData === 0) return;

    const interval = setInterval(() => {
      setIsShadowActive(prev => !prev);  // Toggle shadow state
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <QuickButtons/>
      <div className="flex flex-col xl:w-4/5 bg-white">
        <div className="w-11/12 mx-auto bg-white p-5 my-2 rounded-3xl shadow-lg shadow-gray-400 mb-6">
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
              className="bg-white p-5 rounded-3xl shadow-lg shadow-gray-400 hover:shadow-2xl hover:shadow-gray-400 duration-200 cursor-pointer" 
              onClick={handleOrderClick}
            >
              <h3 className="text-lg font-bold mb-4">
                ORDER
              </h3>
              {orders.summary && (
                <div className="flex flex-col w-full bg-white duration-100 rounded-lg">
                  <span className="text-black text-center font-bold">
                    Purchase Order Total Value
                  </span>

                  {/* Initial Revenue */}
                  <span className="text-black text-sm">Initial Sales:</span>
                  <h1 className="text-black text-xl m-1 px-2 py-1 bg-green-300 shadow-md shadow-gray-400 rounded-2xl inline-block">
                    ₱{parseFloat(orders.summary.totalMoneyAccumulated).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h1>

                  {/* Total Purchase Order Created */}
                  <span className="text-black mt-2 text-sm">Total Purchase Order Created:</span>
                  <h1 className="text-black text-xl m-1 px-2 py-1 bg-green-300 shadow-md shadow-gray-400 rounded-2xl inline-block">
                    {orders.summary.totalPurchaseOrders}
                  </h1>
                </div>
              )}

              <div className="flex mt-2 flex-col w-full bg-white duration-100 rounded-lg">
                <div className="flex">
                  <span className='mr-1 text-sm'>Pending Purchase Order</span>
                  <span className='italic text-red-700'>(Descend from Date)</span>
                </div>
                {Array.isArray(orders.orders) &&
                  orders.orders.map((customerData, index) => (
                    <div
                      key={index}
                      className="p-1 w-full flex rounded-lg bg-white shadow-md border shadow-gray-400 my-1 group"
                    >
                      {/* Purchase Order ID */} 
                      <div className="w-[20%] flex justify-center items-center"> 
                        <span className=" font-bold ">
                          {customerData.purchase_order_id}
                        </span>
                      </div>

                      {/* Customer Name and Created At */}
                      <div className="w-[50%] flex flex-col justify-start">
                        <span className="text-s font-bold text-sm duration-200">
                          {customerData.customer_name.split(" ").slice(0, 2).join(" ")} {/* Show only the first 2 words */}
                        </span>
                        <span className="text-gray-700 text-xs duration-200">
                          {customerData.created_at}
                        </span>
                      </div>

                      {/* Total Worth */}
                      <div className="w-[30%] flex justify-end items-center font-bold">
                        <span className="bg-green-500 text-xs px-2 text-white rounded-2xl">
                          + ₱{parseFloat(customerData.total_worth).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {/* Delivery Container */}
            <div 
              className="bg-white p-5 rounded-3xl shadow-lg shadow-gray-400 hover:shadow-2xl hover:shadow-gray-400 duration-200 cursor-pointer" 
              onClick={handleDeliveryClick}
            >
              <h3 className="text-lg font-bold ">
                DELIVERIES
              </h3>
              <div className="bg-green-300 shadow-lg shadow-gray-400 p-2 rounded-lg mt-4 flex justify-between items-center">
                <span className="text-gray-700 font-bold text-sm">Delivered:</span>
                <span className="text-gray-700 font-bold text-sm">{deliveriesCounts.success}</span>
              </div>
              <div className="bg-pink-300 shadow-lg shadow-gray-400 p-2 rounded-lg mt-4 flex justify-between items-center">
                <span className="text-gray-700 font-bold text-sm">On-Delivery:</span>
                <span className="text-gray-700 font-bold text-sm">{deliveriesCounts.on_delivery}</span>
              </div>
              <div className="bg-red-300 shadow-lg shadow-gray-400 p-2 rounded-lg mt-4 flex justify-between items-center">
                <span className="text-gray-700 font-bold text-sm">Failed:</span>
                <span className="text-gray-700 font-bold text-sm">{deliveriesCounts.failed}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-lg shadow-gray-400 hover:shadow-2xl hover:shadow-gray-400 duration-200 cursor-pointer "
              onClick={handleDeliveryManClick}
            >
              <h3 className="text-lg font-bold ">LATEST EMPLOYEE ACCOUNT</h3>
              {userNames.length > 0 ? (
                userNames.map((user, index) => (
                  <div 
                    key={index} 
                    className="bg-white shadow-lg shadow-gray-400 flex items-center justify-between py-2 px-2 rounded-lg mt-3"
                  >
                    <p className="text-gray-700 text-sm font-bold">{user.name}</p> {/* Display user name */}
                    <p className="text-gray-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</p> {/* Display user creation date */}
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
            <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-400 hover:shadow-2xl hover:shadow-gray-400 duration-200 cursor-pointer">
              <h3 className="text-lg font-bold mb-4">SALES</h3>
              {chartData && chartData.labels.length > 0 && chartData.datasets[0].data.length > 0 ? (
                <div
                  className='w-full'
                  style={{ height: '300px', maxWidth: '100%' }}  // Set fixed height and keep width 100%
                  onClick={handleSalesClick}
                >
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        title: {
                          display: true,
                          text: `Revenue and Damages (Php) for ${year}`,
                        },
                      },
                      maintainAspectRatio: false,  // Ensures that height changes without affecting the width
                    }}
                  />
                </div>
              ) : (
                <div className="text-center text-gray-500">No chart data available</div>
              )}
            </div>
          
            <div className="flex w-full gap-2">
              {/* Inventory Container */}   
              <div
                className="bg-white w-[65%] p-5 rounded-3xl shadow-lg shadow-gray-400 hover:shadow-2xl hover:shadow-gray-400 duration-200 cursor-pointer"
                onClick={handleInventoryClick}
              >
                <h3 className="text-lg font-bold">INVENTORY (Descend by Quantity)</h3>

                {/* Labels Row */}
                <div className="grid grid-cols-5 mt-2 mb-2">
                  <div className="text-md font-medium">Product ID</div>
                  <div className="text-md font-medium col-span-2">Product Name</div> {/* Spans across 2 columns */}
                  <div className="text-md font-medium">Price</div>
                  <div className="text-md font-medium">Quantity</div>
                </div>

                {/* Item Rows */}
                {inventoryItems.length > 0 ? (
                  inventoryItems.map((item, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-5 mt-2 px-2 rounded-lg shadow ${index % 2 === 0 ? 'bg-blue-200' : 'bg-white'}`}
                    >
                      {/* Item Details */}
                      <div className="text-md">{item.id}</div>
                      <div className="text-md col-span-2">{item.product_name}</div> {/* Spans across 2 columns */}
                      <div className="text-md">₱{item.original_price}</div>
                      <div className="text-md">{item.quantity}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-1">
                    All products are above 100+ quantity
                  </div>
                )}
              </div>
                <div className="w-[35%] flex flex-col ">
                  <div
                    onClick={() => handleReorderClick()}
                    className={`rounded-2xl bg-white group border p-4 ${isShadowActive ? 'shadow-red-400 border-red-200 shadow-xl duration-300' : 'shadow-md'} hover:shadow-orange-700 hover:bg-red-200 hover:scale-110 duration-300 hover:shadow-2xl cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <h1 className='text-lg font-bold text-gray-700'>
                        REORDER LEVEL
                      </h1>
                      <SlPin
                        className='ml-1 text-red-600 duration-100 border-l-white rounded-full group-hover:bg-red-600 group-hover:text-white w-6 h-6 p-1 group-hover:scale-125'
                      />
                    </div>
                    <div className="w-full">
                      <div className="grid grid-cols-6 mt-1 px-1">
                        <h1 className="col-span-3 text-xs">Name</h1>
                        <h1 className="col-span-1 text-right text-xs">Quantity</h1>
                        <h1 className="col-span-2 text-right text-xs">Safe Stock</h1>
                      </div>
                      {reorder.length > 0 ? (
                        reorder.map((data, index) => (
                          <div key={index} className="grid grid-cols-6 font-bold px-1 bg-red-600 text-white border rounded">
                            {/* Apply truncation to the product name */}
                            <h1 className="col-span-3 text-xs truncate">{data.product_name}</h1>
                            <h1 className="col-span-1 text-xs">{data.current_quantity}</h1>
                            <h1 className="col-span-2 text-right text-xs">{data.reorder_level}</h1>
                          </div>
                        ))
                      ) : (
                        <div className="">
                          <h1>No Products on Reorder Level.</h1>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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