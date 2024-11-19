import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePurchaseOrderModal = ({ isOpen, onClose, addProductToList }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async (page) => {
      setIsLoading(true); // Start the loading state
      try {
        const response = await axios.get(`${url}/api/products?page=${page}`);
        setTimeout(() => {  // Simulate a loading delay
          setProducts(response.data.products);
          setTotalPages(response.data.pagination.lastPage);
          setIsLoading(false); // End the loading state
        }, 500); // Delay for 2 seconds
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);  // Ensure loading is false on error
      }
    };
  
    if (isOpen) {
      fetchProducts(currentPage);
    }
  }, [isOpen, currentPage, url]);  // React on changes to isOpen and currentPage

  const handleSelectProduct = (event, product) => {
    event.stopPropagation();
    const newSelection = { ...selectedProducts };
    if (newSelection[product.product_id]) {
      delete newSelection[product.product_id];
    } else {
      newSelection[product.product_id] = product;
    }
    setSelectedProducts(newSelection);
    addProductToList(Object.values(newSelection));
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button 
          key={i} 
          className={`px-3 py-1 mx-1 rounded ${i === currentPage ? 'bg-blue-500 font-bold text-white' : 'bg-white hover:bg-blue-500 hover:text-white border duration-200'}`}
          onClick={() => setCurrentPage(i)}
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={`${isOpen ? 'fixed inset-0 z-40 flex items-center justify-center' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden transform transition-all min-h-[54.5rem] w-[70%]">
        <h3 className="text-lg font-bold mb-4">
            Select a Product
        </h3>
            <div className="grid grid-cols-8 bg-gray-300 px-2 rounded">
              <h1 className='col-span-1 font-bold'>Check</h1>
              <h1 className='col-span-1 font-bold'>ID#</h1>
              <h1 className='col-span-2 font-bold'>Product Name</h1>
              <h1 className='col-span-2 font-bold'>Category Name</h1>
              <h1 className='col-span-1 font-bold'>Original Price</h1>
              <h1 className='col-span-1 font-bold'>Available Quantity</h1>
            </div>
        {isLoading ? (
          <div className="flex justify-center h-[47rem] items-center">
            <div className="spinner">
                <span>Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto h-auto ">
              {products.map(product => (
                <div 
                  key={product.product_id} 
                  className="grid grid-cols-8 border-b hover:bg-gray-200 duration-100 cursor-pointer rounded p-1 px-2 bg-gray-100 mt-0.5"
                  onClick={(e) => handleSelectProduct(e, product)}
                >
                  <div className="col-span-1 flex items-center ">
                    <input
                      type="checkbox"
                      checked={!!selectedProducts[product.product_id]}
                      onChange={(e) => { e.stopPropagation(); handleSelectProduct(e, product); }}
                      className="accent-blue-500 h-5 w-5"
                    />
                  </div>
                  <div className='col-span-1'>{product.product_id}</div>
                  <div className='col-span-2'>{product.product_name}</div>
                  <div className='col-span-2'>{product.category_name}</div>
                  <div className='col-span-1'>₱ {product.original_price}</div>
                  <div className='col-span-1 font-bold text-red-600'>{product.quantity}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center mt-4">
              <button 
                className="px-2 cursor-pointer py-1 mx-1 rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button 
                className="px-2 py-1 mx-1 cursor-pointer rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {renderPageNumbers()}
              <button 
                className="px-2 py-1 mx-1 cursor-pointer rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button 
                className="px-2 py-1 mx-1 cursor-pointer rounded bg-white border font-bold hover:bg-blue-500 hover:text-white duration-100"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          </>
        )}
        <button className="absolute top-0 right-0 p-4" onClick={onClose}>
          <span className="text-2xl text-gray-600">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderModal;
