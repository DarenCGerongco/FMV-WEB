import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import { Parser } from "json2csv";

const ReportModal = ({ products, onClose }) => {
  if (!Array.isArray(products) || products.length === 0) return null; // Prevent errors

  // Function to export CSV
  const generateCSVReport = async () => {
    const { Parser } = await import("json2csv"); // Dynamic import
    
    try {
      const csvFields = ["Product ID", "Product Name", "Category", "Quantity", "Transaction Type"];
      const csvData = products.map(item => ({
        "Product ID": item.product_id,
        "Product Name": item.product_name,
        "Category": item.category_name,
        "Quantity": item.quantity,
        "Transaction Type": item.transaction_type || "N/A"
      }));

      const parser = new Parser();
      const csv = parser.parse(csvData);
      
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `all_products_report_${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (error) {
      console.error("Error generating CSV report:", error);
    }
  };

  // Function to export PDF
  const generatePDFReport = () => {
    if (!Array.isArray(products) || products.length === 0) {
      alert("No products available to export.");
      return;
    }
  
    console.log("Generating PDF..."); // Debugging Log
  
    const pdf = new jsPDF();
    pdf.text("All Products Report", 14, 10);
  
    const tableColumn = ["Product ID", "Product Name", "Category", "Quantity", "Transaction Type"];
    const tableRows = products.map(item => [
      item.product_id,
      item.product_name,
      item.category_name,
      item.quantity,
      item.transaction_type || "N/A"
    ]);
  
    pdf.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });
  
    pdf.save(`all_products_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    console.log("PDF generated successfully."); // Debugging Log
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <h2 className="text-lg font-bold mb-4">All Products Report</h2>
        
        {/* Products Table */}
        <div className="overflow-x-auto max-h-96">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Product ID</th>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Transaction Type</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{product.product_id}</td>
                    <td className="border p-2">{product.product_name}</td>
                    <td className="border p-2">{product.category_name}</td>
                    <td className="border p-2">{product.quantity}</td>
                    <td className="border p-2">{product.transaction_type || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-between mt-4">
          <div className="space-x-2">
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-md"
              onClick={generateCSVReport}
            >
              Export CSV
            </button>
            
            <button 
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
              onClick={generatePDFReport}
            >
              Export PDF
            </button>
          </div>

          {/* Close Button */}
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
