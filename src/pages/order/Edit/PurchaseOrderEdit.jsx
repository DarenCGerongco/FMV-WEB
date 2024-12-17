import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/navbar";
import PurchaseOrderEdit_Modal from "./PurchaseOrderEdit_Modal"; // Modal for adding products
import EditConfirmation from "./EditConfirmation"; // Modal for confirmation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PurchaseOrderEdit = () => {
  const url = import.meta.env.VITE_API_URL;
  const location = useLocation(); // To access passed state

  const { purchaseOrderId } = useParams();

  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState({
    customer_name: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    region: "",
    zipcode: "",
  });
  
  const [productsListed, setProductsListed] = useState([]);
  const [productInputs, setProductInputs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState([]); // For confirmation modal
  const [removedProducts, setRemovedProducts] = useState([]); // Track removed product IDs

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  
  const [selectedRegionCode, setSelectedRegionCode] = useState("");
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedCityCode, setSelectedCityCode] = useState("");

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const response = await axios.get(`${url}/api/PurchaseOrder/View/${purchaseOrderId}`);
        const data = response.data;
        console.log(response.data);
        
        // Set purchase order details, including region
        setPurchaseOrderDetails({
          customer_name: data.customer_name,
          street: data.address.street,
          barangay: data.address.barangay,
          city: data.address.city,
          province: data.address.province,
          zipcode: data.address.zip_code,
          region: data.address.region,
        });
  
        // Set region and fetch provinces
        const regionCode = data.address.region;  // Get region code from API response
        setSelectedRegionCode(regionCode);  // Set the selected region
        fetchProvinces(regionCode, data.address.province, data.address.city, data.address.barangay);  // Fetch provinces based on the region
  
        // Handle products
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
  
  useEffect(() => {
    // Fetch regions data once when component is mounted
    fetch("/ph-json/regions.json")
      .then((res) => res.json())
      .then((regionsData) => {
        console.log("Fetched regions data:", regionsData);  // Log fetched regions data
        setRegions(regionsData);
      })
      .catch((error) => {
        console.error("Error fetching regions:", error);  // Log any error
      });
  }, []); // Empty dependency array ensures it only runs once

  useEffect(() => {
    const passedData = location.state || {};
  
    if (passedData) {
      const [street, barangay, city, province] = passedData.address.split(", ").map(s => s.trim());
  
      // Pre-fill customer details
      setPurchaseOrderDetails({
        customer_name: passedData.customer || "",
        street,
        barangay,
        city,
        province,
        zipcode: passedData.zip_code || "", // Use passed zip code if available
      });
  
      // Get the region from passed data
      const regionCode = passedData.region; // This is like "10"
      console.log("Passed region code:", regionCode);  // Log the region code from passed data
  
      if (regionCode) {
        // Slice the first 2 digits of the region code to match the passed region code
        const region = regions.find(r => r.region_code === regionCode);
        if (region) {
          console.log("Found region:", region);  // Log the matched region
          setSelectedRegionCode(region.region_code); // Set region from passed data
          fetchProvinces(region.region_code, province, city, barangay); // Fetch related provinces
        } else {
          console.log("Region not found in regions list");  // Log if region is not found
        }
      } else {
        console.log("Region code is missing, fetching based on province...");
  
        // Fallback logic to match region by province if no region code is passed
        fetch("/ph-json/regions.json")
          .then((res) => res.json())
          .then((regionsData) => {
            console.log("Fetched regions data:", regionsData);  // Log fetched regions data
  
            if (regionsData.length > 0 && regions.length === 0) {  // Prevent updating if already fetched
              setRegions(regionsData);
              const region = regionsData.find((r) => province.includes(r.region_name));
              if (region) {
                console.log("Found region based on province:", region);  // Log the matched region from province
                setSelectedRegionCode(region.region_code); // Set region based on province
                fetchProvinces(region.region_code, province, city, barangay);
              } else {
                console.log("No matching region found based on province.");  // Log if no region found based on province
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching regions:", error);  // Log any error
          });
      }
    }
  }, [location.state, regions]);  // Make sure to check dependency properly (avoid infinite loop)
  
  
  
  const handleRegionChange = (e) => {
    const regionCode = e.target.value; // Get the selected region code
    setSelectedRegionCode(regionCode);

    // Reset dependent dropdowns
    setProvinces([]);
    setCities([]);
    setBarangays([]);
    setSelectedProvinceCode("");
    setSelectedCityCode("");
    setPurchaseOrderDetails((prev) => ({ ...prev, barangay: "" }));

    // Fetch provinces for the selected region
    fetch("/ph-json/province.json")
      .then((res) => res.json())
      .then((data) => {
        const filteredProvinces = data.filter((p) => p.region_code === regionCode);
        setProvinces(filteredProvinces);
      })
      .catch((error) => console.error("Error fetching provinces:", error));
  };

  const fetchProvinces = (regionCode, targetProvince, targetCity, targetBarangay) => {
    fetch("/ph-json/province.json")
      .then((res) => res.json())
      .then((provincesData) => {
        const filteredProvinces = provincesData.filter((p) => p.region_code === regionCode);
        setProvinces(filteredProvinces);

        // Pre-select the province based on passed data
        const province = filteredProvinces.find((p) => p.province_name.trim() === targetProvince);
        if (province) {
          setSelectedProvinceCode(province.province_code);

          // Fetch Cities for the selected province
          fetchCities(province.province_code, targetCity, targetBarangay);
        }
      })
      .catch((error) => console.error("Error fetching provinces:", error));
  };

  const fetchCities = (provinceCode, targetCity, targetBarangay) => {
    fetch("/ph-json/city.json")
      .then((res) => res.json())
      .then((citiesData) => {
        const filteredCities = citiesData.filter(c => c.province_code === provinceCode);
        setCities(filteredCities);

        // Pre-select the city based on passed data
        const city = filteredCities.find(c => c.city_name.trim() === targetCity);
        if (city) {
          setSelectedCityCode(city.city_code);

          // Fetch Barangays for the selected city
          fetchBarangays(city.city_code, targetBarangay);
        }
      })
      .catch((error) => console.error("Error fetching cities:", error));
  };

  const fetchBarangays = (cityCode, targetBarangay) => {
    fetch("/ph-json/barangay.json")
      .then((res) => res.json())
      .then((barangaysData) => {
        const filteredBarangays = barangaysData.filter(b => b.city_code === cityCode);
        setBarangays(filteredBarangays);

        // Pre-select the barangay based on passed data
        const barangay = filteredBarangays.find(b => targetBarangay.includes(b.brgy_name));
        if (barangay) {
          setPurchaseOrderDetails(prev => ({ ...prev, barangay: barangay.brgy_name }));
        }
      })
      .catch((error) => console.error("Error fetching barangays:", error));
  };
  
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value; // Get the selected province code
    setSelectedProvinceCode(provinceCode);
    setCities([]); // Clear cities and barangays
    setBarangays([]);
  
    // Fetch cities for the selected province
    fetch('/ph-json/city.json')
      .then((res) => res.json())
      .then((data) => {
        const filteredCities = data.filter((c) => c.province_code === provinceCode);
        setCities(filteredCities); // Set the cities based on selected province
      })
      .catch((error) => console.error("Error fetching cities:", error));
  };

  const handleCityChange = (e) => {
    const cityCode = e.target.value; // Get the selected city code
    setSelectedCityCode(cityCode); // Update the selected city code
  
    // Clear barangays state before fetching new ones
    setBarangays([]);
  
    // Fetch barangays for the selected city
    fetch('/ph-json/barangay.json')
      .then((res) => res.json())
      .then((data) => {
        const filteredBarangays = data.filter((b) => b.city_code === cityCode);
        setBarangays(filteredBarangays); // Set barangays based on selected city
      })
      .catch((error) => console.error("Error fetching barangays:", error));
  };
  


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
  
    // Separate region from the address
    const newConfirmationData = {
      customer: purchaseOrderDetails.customer_name,
      address: `${purchaseOrderDetails.street}, ${purchaseOrderDetails.barangay}, ${purchaseOrderDetails.city}, ${purchaseOrderDetails.province}, Region ${purchaseOrderDetails.region}, ${purchaseOrderDetails.zipcode}`,
      region: purchaseOrderDetails.region,  // Make sure region is passed correctly
      products: processedData,
      removedProducts,  // Include removed products here
    };
    
  
    console.log("Confirmation Data being set:", newConfirmationData); // Log the data before setting
    setConfirmationData(newConfirmationData); // Set the state
  
    // Open the confirmation modal
    setIsConfirmationOpen(true);
  };
  

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);
  

  console.log("Confirmation", confirmationData);

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
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-bold">Customer Name:</label>
              <input
                className="w-full p-2 rounded-lg border shadow-lg"
                type="text"
                value={purchaseOrderDetails.customer_name}
                onChange={(e) => handleDetailChange('customer_name', e.target.value)}
              />
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-bold">Street:</label>
              <input
                className="w-full p-2 rounded-lg border shadow-lg"
                type="text"
                value={purchaseOrderDetails.street}
                onChange={(e) => handleDetailChange('street', e.target.value)}
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
                value={purchaseOrderDetails.barangay || ""}
                onChange={(e) => handleDetailChange("barangay", e.target.value)}
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
                className="w-full p-2 rounded-lg border shadow-lg"
                type="text"
                value={purchaseOrderDetails.zipcode}
                onChange={(e) => handleDetailChange('zipcode', e.target.value)}
                placeholder="Enter Zip Code"
              />
            </div>
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

          <div className="flex justify-end mt-5 items-end gap-x-3">
            <button
              className="mr-4 text-blue-500 px-4 py-2 hover:text-red-700 underline"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              className="w-32 r-4 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white px-4 py-2 border border-blue-500 hover:border-transparent rounded-lg"
              onClick={toggleModal}
            >
              Add Product
            </button>
            <button
              className="bg-blue-500 px-4 py-2 hover:bg-blue-700 rounded-lg text-white"
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
          purchaseOrderId={purchaseOrderId}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default PurchaseOrderEdit;
