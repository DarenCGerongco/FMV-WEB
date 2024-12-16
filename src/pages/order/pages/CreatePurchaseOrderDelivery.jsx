import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar';
import Modal from './CreatePurchaseOrderDelivery_Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState({
    customer_name: '',
    street: '',
    barangay: '',
    city: '',
    province: '',
    zipcode: '',
  });
  const [productsListed, setProductsListed] = useState([]);
  const [productInputs, setProductInputs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [globalDiscount, setGlobalDiscount] = useState(0);

  // Address Data
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  // Selected Codes
  const [selectedRegionCode, setSelectedRegionCode] = useState('');
  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [selectedCityCode, setSelectedCityCode] = useState('');

  const url = import.meta.env.VITE_API_URL;

  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);

  // Fetch Regions on Load
  useEffect(() => {
    fetch('/ph-json/regions.json')
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((error) => console.error('Error fetching regions:', error));
  }, []);

  const handleRegionChange = (e) => {
    const regionCode = e.target.value;
    setSelectedRegionCode(regionCode);
    setProvinces([]); setCities([]); setBarangays([]);
    setPurchaseOrderDetails({ ...purchaseOrderDetails, province: '', city: '', barangay: '' });

    fetch('/ph-json/province.json')
      .then((res) => res.json())
      .then((data) => setProvinces(data.filter((p) => p.region_code === regionCode)));
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const selectedProvince = provinces.find((p) => p.province_code === provinceCode);
  
    setSelectedProvinceCode(provinceCode);
    setCities([]); 
    setBarangays([]);
    setPurchaseOrderDetails((prev) => ({
      ...prev,
      province: selectedProvince ? selectedProvince.province_name : '',
      city: '',
      barangay: '',
    }));
  
    fetch('/ph-json/city.json')
      .then((res) => res.json())
      .then((data) => setCities(data.filter((c) => c.province_code === provinceCode)));
  };
  

  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    const selectedCity = cities.find((c) => c.city_code === cityCode);
  
    setSelectedCityCode(cityCode);
    setBarangays([]);
    setPurchaseOrderDetails((prev) => ({
      ...prev,
      city: selectedCity ? selectedCity.city_name : '',
      barangay: '',
    }));
  
    fetch('/ph-json/barangay.json')
      .then((res) => res.json())
      .then((data) => setBarangays(data.filter((b) => b.city_code === cityCode)));
  };
  

  

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Name Validation
    if (name === 'customer_name' && !/^[A-Za-z\s.\-]*$/.test(value)) {
      toast.error('Invalid input. Use letters, spaces, "-", or "." only.');
      return;
    }

    // Zip Code Validation
    if (name === 'zipcode' && value && !/^\d{0,4}$/.test(value)) {
      toast.error('Zip code must be 4 digits.');
      return;
    }

    setPurchaseOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProductToList = (selectedProducts) => {
    setProductsListed(selectedProducts);
    const inputs = {};
    selectedProducts.forEach((product) => {
      inputs[product.product_id] = {
        bidPrice: product.original_price || '',
        quantity: '',
        isManuallyUpdated: false, // Track if manually updated
      };
    });
    setProductInputs(inputs);
  };


  const handleSubmit = () => {
    // Merge dropdown-selected values into purchaseOrderDetails
    const updatedOrderDetails = {
      ...purchaseOrderDetails,
      region: selectedRegionCode,
      province: selectedProvinceCode,
      city: selectedCityCode,
      barangay: purchaseOrderDetails.barangay, // Assuming barangay is already managed correctly
    };
  
    // Validate required fields for customer details
    const requiredFields = ['customer_name', 'street', 'region', 'province', 'city', 'barangay', 'zipcode'];
    const emptyFields = requiredFields.filter((field) => !updatedOrderDetails[field]?.trim());
  
    if (emptyFields.length > 0) {
      toast.error('Please fill in all required customer details.');
      return;
    }
  
    // Validate required fields for products
    const incompleteProducts = productsListed.some((product) => {
      const productInput = productInputs[product.product_id];
      return !productInput || !productInput.quantity || !productInput.bidPrice;
    });
  
    if (incompleteProducts) {
      toast.error('Please ensure all products have quantity and price filled in.');
      return;
    }
  
    let cost = 0;
    productsListed.forEach((product) => {
      const price = parseFloat(productInputs[product.product_id]?.bidPrice || product.original_price);
      const quantity = parseInt(productInputs[product.product_id]?.quantity, 10) || 0;
      cost += price * quantity;
    });
  
    setTotalCost(cost);
    setIsConfirmModalOpen(true);
  };
  
  

  const confirmOrder = () => {
    setIsConfirmModalOpen(false);
    createOrder();
  };

  const cancelOrder = () => {
    setIsConfirmModalOpen(false);
  };

  const createOrder = async () => {
    const admin_id = localStorage.getItem('userID');
    if (!admin_id) {
      toast.error('User ID is missing.');
      return;
    }

    const formattedCustomerName = purchaseOrderDetails.customer_name
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const orderData = {
      user_id: admin_id,
      sale_type_id: 1,
      customer_name: formattedCustomerName,
      status: 'P',
      address: {
        street: purchaseOrderDetails.street,
        barangay: purchaseOrderDetails.barangay,
        city: purchaseOrderDetails.city,
        province: purchaseOrderDetails.province,
        zip_code: purchaseOrderDetails.zipcode,
      },
      product_details: productsListed.map((product) => ({
        product_id: product.product_id,
        price: productInputs[product.product_id]?.bidPrice || product.original_price,
        quantity: productInputs[product.product_id]?.quantity,
      })),
    };
    console.log("Payload to be sent:", JSON.stringify(orderData, null, 2));

    setIsSubmitting(true);
    try {
      await axios.post(`${url}/api/purchase-orders-delivery`, orderData);
      toast.success('Order created successfully!', {
        onClose: () => {
          setIsSubmitting(false);
          navigate('/order');
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Error creating order. Please check your inputs.';
      toast.error(errorMessage, {
        onClose: () => setIsSubmitting(false),
      });
      console.error('Error creating order:', errorMessage);
    }
  };


  const handleGlobalDiscountChange = (percentage) => {
    setGlobalDiscount(percentage);
    setProductInputs((prevInputs) => {
      const updatedInputs = { ...prevInputs };
      productsListed.forEach((product) => {
        if (!updatedInputs[product.product_id]?.isManuallyUpdated) {
          const discountedPrice =
            product.original_price - (product.original_price * percentage) / 100;
          updatedInputs[product.product_id].bidPrice = discountedPrice.toFixed(2);
        }
      });
      return updatedInputs;
    });
  };

  const handleInputChange = (productId, field, value, isManual = false) => {
    setProductInputs((prev) => {
      const updatedInputs = {
        ...prev,
        [productId]: {
          ...prev[productId],
          [field]: value,
          isManuallyUpdated: isManual, // Track manual update
        },
      };
      return updatedInputs;
    });
  };
  
  const removeProductFromList = (productId) => {
    setProductsListed((prevProducts) => prevProducts.filter((product) => product.product_id !== productId));
    setProductInputs((prevInputs) => {
      const updatedInputs = { ...prevInputs };
      delete updatedInputs[productId];
      return updatedInputs;
    });
  };
  
  return (
    <div className="flex w-full">
      <Navbar />
      <div className="flex flex-col items-center w-full">
        <div className="w-11/12 mx-auto bg-white p-6 m-3 rounded-lg drop-shadow-md mb-6 border">
          <h3 className="text-1xl font-bold">CREATE PURCHASE ORDER</h3>
        </div>

        <div className="w-11/12 mx-auto bg-white p-6 m-3 rounded-lg drop-shadow-md mb-6 border">
          <h1 className="text-xl font-bold">Customer's Details:</h1>
          <hr className="h-px my-2 bg-gray-500 border-0 shadow-md"></hr>

          <div className="grid grid-cols-2 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-bold">Customer Name:</label>
              <input
                className="w-full p-2 rounded-lg border shadow-lg"
                type="text"
                name="customer_name"
                value={purchaseOrderDetails.customer_name}
                onChange={handleChange}
                placeholder="Enter customer name"
              />
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-bold">Street:</label>
              <input
                className="w-full p-2 rounded-lg border shadow-lg"
                type="text"
                name="street"
                value={purchaseOrderDetails.street}
                onChange={handleChange}
                placeholder="Enter street address"
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-bold">Region:</label>
              <select
                value={selectedRegionCode}
                onChange={handleRegionChange}
                className="w-full p-2 rounded-lg border shadow-lg"
              >
                <option value="" disabled>Select Region</option>
                {regions.map((region) => (
                  <option key={region.psgc_code} value={region.region_code}>
                    {region.region_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div>
              <label className="block text-sm font-bold">Province:</label>
              <select
                value={selectedProvinceCode}
                onChange={handleProvinceChange}
                className="w-full p-2 rounded-lg border shadow-lg"
                disabled={!provinces.length}
              >
                <option value="" disabled>Select Province</option>
                {provinces.map((province) => (
                  <option key={province.psgc_code} value={province.province_code}>
                    {province.province_name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold">City:</label>
              <select
                value={selectedCityCode}
                onChange={handleCityChange}
                className="w-full p-2 rounded-lg border shadow-lg"
                disabled={!cities.length}
              >
                <option value="" disabled>Select City</option>
                {cities.map((city) => (
                  <option key={city.city_code} value={city.city_code}>
                    {city.city_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Barangay */}
            <div>
              <label className="block text-sm font-bold">Barangay:</label>
              <select
                value={purchaseOrderDetails.barangay}
                onChange={(e) =>
                  setPurchaseOrderDetails((prev) => ({
                    ...prev,
                    barangay: e.target.value,
                  }))
                }
                className="w-full p-2 rounded-lg border shadow-lg"
                disabled={!barangays.length}
              >
                <option value="" disabled>Select Barangay</option>
                {barangays.map((barangay) => (
                  <option key={barangay.brgy_code} value={barangay.brgy_name}>
                    {barangay.brgy_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-bold">Zip Code:</label>
              <input
                className={`w-full p-2 rounded-lg border shadow-lg ${
                  !/^\d{4}$/.test(purchaseOrderDetails.zipcode) &&
                  purchaseOrderDetails.zipcode &&
                  'border-red-500'
                }`}
                type="text"
                name="zipcode"
                value={purchaseOrderDetails.zipcode}
                onChange={handleChange}
                placeholder="Enter 4-digit zip code"
              />
              {!/^\d{4}$/.test(purchaseOrderDetails.zipcode) &&
                purchaseOrderDetails.zipcode && (
                  <span className="text-red-500 text-xs">
                    Invalid zip code. Must be 4 digits.
                  </span>
              )}
            </div>
          </div>

          {/* Apply Global Discount */}
          <hr className="h-px my-8 bg-gray-500 border-0 shadow-md"></hr>
          <h1 className="text-xl font-bold">Apply Global Discount:</h1>
          <select
            className="p-2 rounded border mb-4"
            value={globalDiscount}
            onChange={(e) => handleGlobalDiscountChange(parseFloat(e.target.value))}
          >
            <option value="0">No Discount</option>
            <option value="1">1% Discount</option>
            <option value="2">2% Discount</option>
            <option value="3">3% Discount</option>
            <option value="4">4% Discount</option>
            <option value="5">5% Discount</option>
            <option value="10">10% Discount</option>
          </select>


          {/* Product Listed */}
          <h1 className="text-xl font-bold">Product Listed:</h1>
          <div className="grid grid-cols-11 bg-gray-300 p-2 gap-2 rounded">
            <span className="col-span-1 font-bold">ID</span>
            <span className="col-span-2 font-bold">Product Name</span>
            <span className="col-span-2 font-bold">Category</span>
            <span className="col-span-1 font-bold">Original Price</span>
            <span className="col-span-1 font-bold">Avail. Qty</span>
            <span className="col-span-1 font-bold">Discount</span>
            <span className="col-span-1 font-bold text-center">Actual Price</span>
            <span className="col-span-1 font-bold text-center">Quantity</span>
            <span className="col-span-1 font-bold text-center">Option</span>
          </div>
          {productsListed.length > 0 ? (
            productsListed.map((product, index) => {
              const discount = product.original_price - (productInputs[product.product_id]?.bidPrice || product.original_price);
              return (
                <div key={index} className="grid grid-cols-11 gap-1 items-center p-2 border-b">
                  <span className="col-span-1">{product.product_id}</span>
                  <span className="col-span-2">{product.product_name}</span>
                  <span className="col-span-2">{product.category_name}</span>
                  <span className="col-span-1">₱ {product.original_price}</span>
                  <span className="col-span-1">{product.quantity}</span>
                  <span className="col-span-1 text-sm text-green-500 font-bold">
                    - ₱ {discount > 0 ? discount.toFixed(2) : '0.00'}
                  </span>
                  <input
                    type="number"
                    value={productInputs[product.product_id]?.bidPrice || ''}
                    onChange={(e) => handleInputChange(product.product_id, 'bidPrice', e.target.value)}
                    className="col-span-1 p-1 rounded text-center border"
                  />
                  <input
                    type="number"
                    value={productInputs[product.product_id]?.quantity || ''}
                    onChange={(e) => handleInputChange(product.product_id, 'quantity', e.target.value)}
                    className="col-span-1 p-1 rounded text-center border"
                  />
                  <button
                    onClick={() => removeProductFromList(product.product_id)}
                    className="col-span-1 text-red-600 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center mt-6">No products added yet.</p>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end mt-5 items-end">
            <button
              className="mr-4 text-blue-500 px-4 py-2 hover:text-red-700 underline"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <div className="flex gap-x-4">
              <button
                className="w-32 r-4 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white px-4 py-2 border border-blue-500 hover:border-transparent rounded-lg"
                onClick={toggleModal}
              >
                Select
              </button>
              <button
                className={`${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
                } w-32 px-4 py-2 rounded-lg`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Loading...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={toggleModal} addProductToList={addProductToList} />
      <ToastContainer />

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30%] max-h-[40vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Confirm Order</h3>
            <p>The total cost is: <span className="font-bold">₱{totalCost.toFixed(2)}</span></p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={cancelOrder}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePurchaseOrder;
