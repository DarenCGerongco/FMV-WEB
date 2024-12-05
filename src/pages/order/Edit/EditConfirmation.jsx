import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditConfirmation = ({ isOpen, onClose, confirmationData, purchaseOrderId }) => {
  
  const url = import.meta.env.VITE_API_URL;

  const { customer, address, products } = confirmationData;
  
  
  if (!isOpen) return null;
  const handleConfirm = async () => {
    try {
      const payload = {
        customer_name: customer,
        address: {
          street: address.split(", ")[0], // Extract street
          barangay: address.split(", ")[1], // Extract barangay
          city: address.split(", ")[2], // Extract city
          province: address.split(", ")[3], // Extract province
          zip_code: address.split(", ")[4], // Extract zip code
        },
        product_details: products.map((product) => ({
          product_id: product.product_id,
          price: product.price,
          quantity: product.quantity,
        })),
        removed_products: confirmationData.removedProducts || [], // Include removed products
        status: "P", // Example status; update based on your logic
      };
  
      // Make the API call
      const response = await axios.post(
        `${url}/api/PurchaseOrder/Edit/${purchaseOrderId}/Update`,
        payload
      );
  
      // Handle success
      toast.success("Purchase order updated successfully!");
      onClose(); // Close the modal
    } catch (error) {
      // Handle error
      console.error("Error updating purchase order:", error);
      toast.error("Failed to update purchase order.");
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-3/4 z-50 relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to the overlay
      >
        <h3 className="text-lg font-bold mb-4">Confirm Purchase Order Changes</h3>

        {/* Customer and Address */}
        <div className="mb-4">
          <p className="font-bold">Customer Name:</p>
          <p>{customer}</p>
          <p className="font-bold mt-2">Address:</p>
          <p>{address}</p>
        </div>

        {/* Product List */}
        <h4 className="font-bold">Products:</h4>
        <div className="grid grid-cols-12 bg-gray-300 p-2 rounded mt-2">
          <span className="col-span-1 font-bold">ID</span>
          <span className="col-span-4 font-bold">Product Name</span>
          <span className="col-span-2 font-bold">Category</span>
          <span className="col-span-2 font-bold">Price</span>
          <span className="col-span-2 font-bold">Quantity</span>
        </div>
        {products.map((product, index) => (
          <div key={index} className="grid grid-cols-12 items-center p-2 border-b">
            <span className="col-span-1">{product.product_id}</span>
            <span className="col-span-4">{product.product_name}</span>
            <span className="col-span-2">{product.category_name}</span>
            <span className="col-span-2">₱ {product.price}</span>
            <span className="col-span-2">{product.quantity}</span>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 mr-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditConfirmation;
