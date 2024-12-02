import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/index.jsx';
import Employee from './pages/employee.jsx';
import Inventory from './pages/inventory.jsx';
import Sales from './pages/sales.jsx';
import Delivery from './pages/delivery.jsx';
import Overview from './pages/overview.jsx';
import Order from './pages/order.jsx';
import CreatePurchaseOrder from './pages/order/pages/CreatePurchaseOrderDelivery.jsx';
import WalkIn from './pages/order/pages/CreatePurchaseOrderWalkIn.jsx';
import { GlobalProvider } from '../GlobalContext'; // Import GlobalProvider

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GlobalProvider> {/* Wrap the app inside GlobalProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order/create-delivery" element={<CreatePurchaseOrder />} />
          <Route path="/order/create-walkin" element={<WalkIn />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  </React.StrictMode>
);
