import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Overview() {
  const [salesData, setSalesData] = useState([]);

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

  // Options for the pie chart
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

  // Fetch sales data
  const fetchSalesData = () => {
    const salesdata = [
      { itemName: 'Arlene', itemSold: 'x15', itemRemaining: 'x10' },
      { itemName: 'Kirk Khien', itemSold: 'x10', itemRemaining: 'x5' },
      { itemName: 'Steven Ambatablow', itemSold: 'x20', itemRemaining: 'x15' },
      { itemName: 'Oiled Men', itemSold: 'x30', itemRemaining: 'x20' },
    ];
    setSalesData(salesdata); // Setting state with fetched data
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <div className="flex w-full bg-white">
      <Navbar />
      <div className="flex flex-col xl:w-4/5 ml-80 bg-white">
        <div className="w-11/12 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6">
          <h2 className="text-1xl font-bold">Management System Overview</h2>
        </div>

        <div className="w-11/12 mx-auto flex space-x-4">

          <div className="flex flex-col space-y-4 w-1/3">
            {/* Order Container */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">ORDER</h3>
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4 flex justify-between items-center">
                <span className="text-gray-700 text-sm">Barangay Lumbia</span>
                <span className="text-gray-700 text-sm">06/04/2024</span>
              </div>
            </div>

            {/* Delivery Container */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">DELIVERY</h3>
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4 flex justify-between items-center">
                <span className="text-gray-700 text-sm">Confirm Delivery:</span>
                <span className="text-gray-700 text-sm">2</span>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4 flex justify-between items-center">
                <span className="text-gray-700 text-sm">On Delivery:</span>
                <span className="text-gray-700 text-sm">2</span>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4 flex justify-between items-center">
                <span className="text-gray-700 text-sm">Delivered:</span>
                <span className="text-gray-700 text-sm">2</span>
              </div>
            </div>

            {/* Delivery Man Container */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">DELIVERY MAN ACCOUNT</h3>
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4">
                <p className="text-gray-700 text-sm whitespace-nowrap">Arlene Cabarrubias</p>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4">
                <p className="text-gray-700 text-sm whitespace-nowrap">Arlene Cabarrubias</p>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4">
                <p className="text-gray-700 text-sm whitespace-nowrap">Arlene Cabarrubias</p>
              </div>
            </div>
          </div>

          {/* Right Column for Larger Containers */}
          <div className="flex flex-col space-y-4 w-2/3">
            {/* Sales Container */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">SALES</h3>
              {/* Adjusted container for the pie chart */}
              <div className="flex justify-center items-center h-80">
                <div className="w-full h-full max-w-xs">
                  <Pie data={data} options={options} />
                </div>
              </div>
              {/* Box container for sales data */}
              <div className="bg-white text-sm mt-10 flex justify-between">
                <p className="text-gray-500 ml-3 w-1/3">Item Name</p>
                <p className="text-gray-500 w-1/3">Item Sold</p>
                <p className="text-gray-500 mr-3 w-1/10">Item Remaining</p>
              </div>
              {salesData.map((item, index) => (
                <div key={index} className="p-4 rounded-lg shadow-2xl mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 w-1/3">{item.itemName}</p>
                    <p className="text-gray-700 w-1/3">{item.itemSold}</p>
                    <p className="text-gray-700 w-1/10">{item.itemRemaining}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Inventory Container */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4">INVENTORY</h3>
              {/* First Item */}
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm">Submersible Pump</span>
                  <span className="text-gray-700 text-sm">Pump</span>
                  <span className="text-gray-700 text-sm">5</span>
                </div>
              </div>
              {/* Second Item */}
              <div className="bg-gray-200 p-4 rounded-lg shadow-sm mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm">Water Filter</span>
                  <span className="text-gray-700 text-sm">Filter</span>
                  <span className="text-gray-700 text-sm">10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
