import { useState, useEffect } from 'react';
import Navbar from '../components/navbar'; // Adjust the import based on your actual file structure
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components for ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

function Sales() {
  const [salesData, setSalesData] = useState([]);

  // Data for the pie chart
  const data = {
    labels: ['arlene', 'kirk khien', 'steven ambatablow', 'oiled men' ],
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

  //examples ranips
  const fetchSalesData = () => {
    // example respone ranips brazzerps, kani nga data mabutang dayun siya sa "box container" sa ubos
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
    <div className="flex">
      <Navbar />

     
      <div className="w-5/6 ml-auto bg-gray-100">
        <div className="w-4/5 mx-auto bg-white p-6 m-3 rounded-lg shadow-md mb-6">
          <h2 className="text-1xl font-bold">Management System Sales</h2>
        </div>


        <div className="w-4/5 mx-auto bg-white p-5 m-3 rounded-lg shadow-xl">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Monthly Sales</h2>
          </div>
          
          {/* Pie chart arlene bayot */}
          <div className="flex justify-center">
            <div className="w-1/2">
              <Pie data={data} />
            </div>
          </div>

          {/* item label*/}
          <div className="bg-white text-sm mt-10 flex justify-between">
            <p className="text-gray-500 ml-3 w-1/3">Item Name</p>
            <p className="text-gray-500 w-1/3">Item Sold</p>
            <p className="text-gray-500 mr-3 w-1/10">Item Remaining</p>
          </div>

          {/* Box container */}
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
      </div>
    </div>
  );
}

export default Sales;
