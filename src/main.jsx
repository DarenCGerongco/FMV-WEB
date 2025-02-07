import React from 'react';
import './index.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalProvider } from '../GlobalContext'; // Import GlobalProvider

import Index from './pages/index.jsx';
import Employee from './pages/employee.jsx';
import Product from './pages/products.jsx';
import ProductDetails from './pages/products/page/ProductProfile.jsx';
import Reorder from './pages/reorder.jsx';

import Sales from './pages/sales.jsx';
import Delivery from './pages/delivery.jsx';
import Overview from './pages/overview.jsx';
import Inventory from './pages/inventory.jsx';

import Order from './pages/order.jsx';
import CreatePurchaseOrder from './pages/order/pages/CreatePurchaseOrderDelivery.jsx';
import PurchaseOrderEdit from './pages/order/Edit/PurchaseOrderEdit.jsx'; // Import the component

import Configuration from './pages/configuration.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/reorder" element={<Reorder/>} />
          <Route path="/products/:productID/details" element={<ProductDetails />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/order" element={<Order />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/order/create-delivery" element={<CreatePurchaseOrder />} />
          <Route path="/order/edit/:purchaseOrderId" element={<PurchaseOrderEdit />} /> {/* Add the route */}
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  </React.StrictMode>
);
