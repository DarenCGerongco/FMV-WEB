import React, { useState, useEffect, useRef, useContext } from 'react';
import Navbar from '../components/navbar';
import { GlobalContext } from '../../GlobalContext';
import { useNavigate } from 'react-router-dom';

import CreateDeliveryModal from './order/modals/createdeliverymodal';
import ViewDeliveriesModal from './order/modals/viewdeliveriesmodal';
import ItemsOrderedModal from './order/modals/viewitemsorderedmodal';
import QuickButtons from '../components/quickButtons';

import DeliveriesTab from './order/components/deliveriesTab';
import WalkinTab from './order/components/WalkinTab';

function Order() {
  const { id: userID, setID } = useContext(GlobalContext);
  const [itemsOrderedModalOpen, setItemsOrderedModalOpen] = useState(false);
  const [createDeliveryModalOpen, setCreateDeliveryModalOpen] = useState(false);
  const [viewDeliveriesModalOpen, setViewDeliveriesModalOpen] = useState(false);
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] = useState(null);
  const [selectedItemsOrderId, setSelectedItemsOrderId] = useState(null);
  
  const [activeTab, setActiveTab] = useState('Deliveries');

  useEffect(() => {
    if (!userID) {
      const storedID = localStorage.getItem('userID');
      if (storedID) {
        setID(storedID);
      }
    } else {
      localStorage.setItem('userID', userID);
    }
  }, [userID, setID]);

  const openItemsOrderedModal = (purchaseOrderId) => {
    setSelectedItemsOrderId(purchaseOrderId);
    setItemsOrderedModalOpen(true);
  };

  const closeItemsOrderedModal = () => {
    setItemsOrderedModalOpen(false);
  };

  const openCreateDeliveryModal = (purchaseOrderId) => {
    setSelectedPurchaseOrderId(purchaseOrderId);
    setCreateDeliveryModalOpen(true);
  };

  const closeCreateDeliveryModal = () => {
    setCreateDeliveryModalOpen(false);
  };

  const openViewDeliveriesModal = (purchaseOrderId) => {
    setSelectedPurchaseOrderId(purchaseOrderId);
    setViewDeliveriesModalOpen(true);
  };

  const closeViewDeliveriesModal = () => setViewDeliveriesModalOpen(false);

  return (
    <div className="flex w-full bg-white">
      <Navbar/>
      <QuickButtons/>
      <div className="flex flex-col w-full bg-white">
        <div className="w-4/5 mx-auto p-6 m-3 rounded-lg mb-6 bg-white shadow-lg shadow-gray-400">
          <h2 className="text-1xl font-bold">MANAGEMENT SYSTEM ORDER</h2>
        </div>
        {/* Tabs */}
        <div className="w-4/5 mx-auto flex justify-center border-b">
          <button
            className={`p-2 font-bold ${activeTab === 'Deliveries' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
            onClick={() => setActiveTab('Deliveries')}
          >
            Deliveries
          </button>
          <button
            className={`p-2 font-bold ${activeTab === 'Walk-in' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
            onClick={() => setActiveTab('Walk-in')}
          >
            Walk-in
          </button>
        </div>
        {/* Tab content */}
        <div className="mt-6">
          {activeTab === 'Deliveries' && <DeliveriesTab />}
          {activeTab === 'Walk-in' && <WalkinTab />}
        </div>
      </div>

      {/* Modals */}
      {itemsOrderedModalOpen && (
        <ItemsOrderedModal
          itemsOrderedModalOpen={itemsOrderedModalOpen}
          onClose={closeItemsOrderedModal}
          purchaseOrderID={selectedItemsOrderId}
        />
      )}


      <ViewDeliveriesModal
        viewDeliveriesModalOpen={viewDeliveriesModalOpen}
        onClose={closeViewDeliveriesModal}
        purchaseOrderId={selectedPurchaseOrderId}
      />
    </div>
  );
}

export default Order;
