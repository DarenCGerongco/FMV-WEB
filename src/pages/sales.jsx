import { useState } from "react";
import Navbar from "../components/navbar";
import QuickButtons from "../components/quickButtons";

import MonthTab from "./sales/Tabs/Month";
import AnnualTab from "./sales/Tabs/Annual";

function Sales() {
  const [activeTab, setActiveTab] = useState("month"); // 'month' or 'annual'

  // Get current date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString("default", { month: "long" }); // Full month name
  const weekday = currentDate.toLocaleString("default", { weekday: "long" }); // Full weekday name

  return (
    <div className="flex w-full ">
      <Navbar />
      <QuickButtons />
      <div className="w-full bg-gray-50">
        {/* Header */}
        <div className="w-4/5 flex justify-between mx-auto p-6 mt-3 rounded-lg bg-white shadow-lg shadow-gray-400">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM SALES</h2>
          <h3 className="font-bold">
            {month}, {day} {weekday} {year}
          </h3>
        </div>

        {/* Tabs Navigation */}
        <div className="w-4/5 mx-auto mt-4 flex ">
          <button
            className={`p-3 w-1/2 text-center font-bold ${
              activeTab === "month"
                ? "bg-blue-500 text-white rounded-lg shadow-md border-blue-700"
                : "bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-white duration-200"
            }`}
            onClick={() => setActiveTab("month")}
          >
            Monthly
          </button>
          <button
            className={`p-3 w-1/2 text-center font-bold  ${
              activeTab === "annual"
                ? "bg-blue-500 text-white rounded-lg shadow-md border-blue-700"
                : "bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-white duration-200"
            }`}
            onClick={() => setActiveTab("annual")}
          >
            Annual
          </button>
        </div>

        {/* Tabs Content */}
        <div className="w-4/5 mx-auto ">
          {activeTab === "month" && <MonthTab />}
          {activeTab === "annual" && <AnnualTab />}
        </div>
      </div>
    </div>
  );
}

export default Sales;
