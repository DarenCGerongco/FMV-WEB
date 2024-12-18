// ReorderProducts.jsx
import React from "react";

const ReorderProducts = ({ reorderProducts, handleQuantityChange }) => {
  return (
    <div className="border p-2 rounded">
      <div className="grid grid-cols-6 gap-4 bg-red-500 text-white font-bold p-2">
        <div>Product ID</div>
        <div>Product Name</div>
        <div>Category</div>
        <div>Quantity</div>
        <div>Reorder Level</div>
        <div>Restock Quantity</div>
      </div>

      {reorderProducts.map((product) => (
        <div
          key={product.product_id}
          className="grid grid-cols-6 gap-4 rounded items-center border shadow-md my-3 duration-300 hover:bg-red-300 even:bg-gray-100 p-2"
        >
          <div>{product.product_id}</div>
          <div>{product.product_name}</div>
          <div>{product.category_name}</div>
          <div>{product.current_quantity}</div>
          <div>{product.reorder_level}</div>
          <div>
            <input
              type="number"
              min="1"
              className="border rounded p-1 w-full"
              placeholder="Enter quantity"
              onChange={(e) => handleQuantityChange(product.product_id, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReorderProducts;
