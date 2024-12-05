import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar";
import PurchaseOrderEdit_Modal from "./PurchaseOrderEdit_Modal"; // Modal for adding products
import EditConfirmation from "./EditConfirmation"; // Modal for confirmation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PurchaseOrderEdit = () => {
  const { purchaseOrderId } = useParams();
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState({
    customer_name: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    zipcode: "",
  });
  const [productsListed, setProductsListed] = useState([]);
  const [productInputs, setProductInputs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState([]); // For confirmation modal
  const [removedProducts, setRemovedProducts] = useState([]); // Track removed product IDs

  
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const response = await axios.get(`${url}/api/PurchaseOrder/View/${purchaseOrderId}`);
        const data = response.data;

        setPurchaseOrderDetails({
          customer_name: data.customer_name,
          street: data.address.street,
          barangay: data.address.barangay,
          city: data.address.city,
          province: data.address.province,
          zipcode: data.address.zip_code,
        });

        const inputs = {};
        data.products.forEach((product) => {
          inputs[product.product_id] = {
            price: product.custom_price,
            quantity: product.total_quantity,
          };
        });
        setProductsListed(data.products);
        setProductInputs(inputs);
      } catch (error) {
        console.error("Error fetching purchase order details:", error);
        toast.error("Failed to fetch purchase order details.");
      }
    };

    fetchPurchaseOrder();
  }, [purchaseOrderId, url]);

  const handleDetailChange = (field, value) => {
    setPurchaseOrderDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleProductInputChange = (productId, field, value) => {
    setProductInputs((prevInputs) => ({
      ...prevInputs,
      [productId]: {
        ...prevInputs[productId],
        [field]: value,
      },
    }));
  };

  const removeProductFromList = useCallback((productId) => {
    setProductsListed((currentProducts) =>
      currentProducts.filter((p) => p.product_id !== productId)
    );
    setProductInputs((currentInputs) => {
      const newInputs = { ...currentInputs };
      delete newInputs[productId];
      return newInputs;
    });
  
    // Add the product ID to the removedProducts list
    setRemovedProducts((currentRemoved) => [...currentRemoved, productId]);
  }, []);
  
  const openConfirmationModal = () => {
    const hasMissingQuantity = productsListed.some((product) => {
      const quantity = productInputs[product.product_id]?.quantity;
      return !quantity || String(quantity).trim() === ""; // Check for missing quantity
    });
  
    if (hasMissingQuantity) {
      toast.error("Please ensure all products have a quantity before saving.");
      return; // Stop the process if there's an error
    }
  
    // Prepare confirmation data
    const processedData = productsListed.map((product) => ({
      product_id: product.product_id,
      product_name: product.product_name,
      category_name: product.category_name,
      quantity: productInputs[product.product_id]?.quantity || product.total_quantity,
      price: productInputs[product.product_id]?.price || product.original_price,
      isEditable: product.isEditable,
    }));
  
    setConfirmationData({
      customer: purchaseOrderDetails.customer_name,
      address: `${purchaseOrderDetails.street}, ${purchaseOrderDetails.barangay}, ${purchaseOrderDetails.city}, ${purchaseOrderDetails.province}, ${purchaseOrderDetails.zipcode}`,
      products: processedData,
      removedProducts, // Include removed products here
    });
  
    setIsConfirmationOpen(true);
  };
  
  
  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);
  
  
  return (
    <div className="flex w-full">
      <Navbar />
      <div className="flex flex-col items-center w-full">
        <div className="w-11/12 mx-auto bg-white p-6 m-3 rounded-lg drop-shadow-md mb-6 border">
          <h3 className="text-1xl text-center font-bold">EDIT PURCHASE ORDER</h3>
        </div>
        <div className="w-11/12 mx-auto bg-white p-6 m-3 rounded-lg drop-shadow-md mb-6 border">
          <h1 className="text-xl font-bold">Customer's Detail with <span className="text-red-500 underline font-bold ">Purchase Order ID#: {purchaseOrderId}</span></h1>
          <hr className="h-px my-8 bg-gray-500 border-0 shadow-md"></hr>
          <div className="grid grid-cols-2 gap-4">
          {Object.keys(purchaseOrderDetails).map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-bold">
                {field
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
                :
              </label>
              <input
                className="w-full p-2 text-sm rounded-lg border shadow-lg"
                type="text"
                value={purchaseOrderDetails[field]}
                onChange={(e) => {
                  const value = e.target.value;

                  // Validation for `customer_name`: allow only letters
                  if (field === "customer_name" && /[0-9]/.test(value)) {
                    return; // Prevent updating if numbers are detected
                  }

                  // Validation for `zipcode`: allow only numbers
                  if (field === "zipcode" && /[^\d]/.test(value)) {
                    return; // Prevent updating if non-numeric characters are detected
                  }

                  // Handle valid input
                  handleDetailChange(field, value);
                }}
              />
            </div>
          ))}
        </div>

          <hr className="h-px my-8 bg-gray-500 border-0 shadow-md"></hr>
          <h1 className="text-xl font-bold">Product Listed:</h1>
          {/* Product Table */}
          <div className="grid grid-cols-12 bg-gray-300 p-2 rounded">
            <span className="col-span-1 font-bold">ID</span>
            <span className="col-span-3 font-bold">Product Name</span>
            <span className="col-span-2 font-bold">Category</span>
            <span className="col-span-2 font-bold">Original Price</span>
            <span className="col-span-2 font-bold">Custom Price</span>
            <span className="col-span-1 font-bold">Quantity</span>
            <span className="col-span-1 font-bold text-red-500 text-center">Option</span>
          </div>
          {productsListed.map((product, index) => (
            <div key={index} className="grid grid-cols-12 items-center p-2 border-b">
              <span className="col-span-1">{product.product_id}</span>
              <span className="col-span-3">{product.product_name}</span>
              <span className="col-span-2">{product.category_name}</span>
              <span className="col-span-2">₱ {product.original_price}</span>
              <input
                type="text"
                value={productInputs[product.product_id]?.price || ""}
                onChange={(e) =>
                  product.isEditable && handleProductInputChange(product.product_id, "price", e.target.value)
                }
                disabled={!product.isEditable}
                className={`col-span-2 p-1 rounded text-center border m-1 ${
                  !product.isEditable ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
                }`}
              />
              <input
                type="text"
                value={productInputs[product.product_id]?.quantity || ""}
                onChange={(e) =>
                  product.isEditable && handleProductInputChange(product.product_id, "quantity", e.target.value)
                }
                disabled={!product.isEditable}
                className={`col-span-1 p-1 rounded text-center border ${
                  !product.isEditable ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
                }`}
              />
              <button
                onClick={() => product.isEditable && removeProductFromList(product.product_id)}
                disabled={!product.isEditable}
                className={`col-span-1 text-red-600 hover:text-red-400 ${
                  !product.isEditable ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex justify-end mt-5 items-end">
          <button
              className="mr-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
          <button
            className="mr-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
            onClick={toggleModal}
          >
            Add Product
          </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
              onClick={openConfirmationModal}
            >
              Save Changes
            </button>
          </div>
        </div>
        <PurchaseOrderEdit_Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          addProductToList={(newProducts) =>
            setProductsListed((prev) => [
              ...prev,
              ...newProducts.filter((newProduct) => !prev.some((existing) => existing.product_id === newProduct.product_id)),
            ])
          }
          existingProducts={productsListed}
        />
        <EditConfirmation
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          confirmationData={confirmationData}
          purchaseOrderId={purchaseOrderId} // Pass the purchase order ID
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default PurchaseOrderEdit;
