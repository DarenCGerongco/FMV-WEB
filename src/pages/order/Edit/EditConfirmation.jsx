import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditConfirmation = ({ isOpen, onClose, confirmationData, purchaseOrderId }) => {
  const url = import.meta.env.VITE_API_URL;

  // Log confirmation data to ensure it is passed correctly
  console.log("Confirmation Data in Modal:", confirmationData); 
  
  const { customer, address, region, products } = confirmationData; // Destructure region from confirmationData
  
  const handleConfirm = async () => {
    try {
      // Split the address into parts
      const addressParts = address.split(", ");
      
      // Ensure the last part is the zip code, and the rest is the address
      const zipCode = addressParts[addressParts.length - 1]; // Last part as zip code
      const addressWithoutZip = addressParts.slice(0, addressParts.length - 1).join(", "); // Remove zip code from the address
  
      console.log("Region in payload:", region); // Log region to see if it's correctly passed

      const payload = {
        customer_name: customer,
        address: {
          street: addressWithoutZip.split(", ")[0], // Extract street
          barangay: addressWithoutZip.split(", ")[1], // Extract barangay
          city: addressWithoutZip.split(", ")[2], // Extract city
          province: addressWithoutZip.split(", ")[3], // Extract province
          region: region, // Use region from confirmationData
          zip_code: zipCode || "", // Send zip code as string
        },
        product_details: products.map((product) => ({
          product_id: product.product_id,
          price: product.price,
          quantity: product.quantity,
        })),
        removed_products: confirmationData.removedProducts || [],
        status: "P",
      };

      console.log("Payload being sent:", payload); // Log entire payload to verify data


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
  
  


  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40" onClick={onClose}></div>

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
          <p className="font-bold mt-2">Region:</p>
          <p>{region}</p> {/* Display the region */}
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
        <div className="mt-2 max-h-[200px] overflow-y-auto border rounded"> {/* Scrollable Container */}
          {products.map((product, index) => (
            <div key={index} className="grid grid-cols-12 items-center p-2 border-b">
              <span className="col-span-1 text-sm">{product.product_id}</span>
              <span className="col-span-4 text-sm">{product.product_name}</span>
              <span className="col-span-2 text-sm">{product.category_name}</span>
              <span className="col-span-2 text-sm">₱ {product.price}</span>
              <span className="col-span-2 text-sm">{product.quantity}</span>
            </div>
          ))}
        </div>

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
