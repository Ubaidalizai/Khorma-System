import { BsFiletypePdf } from "react-icons/bs";
import React, { useRef, useEffect, useCallback } from "react";
import { useReactToPrint } from "react-to-print"; // Keep this import for potential future use
import { PrinterIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Invoice from "./Invoice";

const SaleBillPrint = ({
  sale,
  customer,
  customerAccount,
  onClose,
  autoPrint = false,
}) => {
  const componentRef = useRef();

  const handlePrint = useCallback(() => {
    if (!componentRef.current) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow popups to print");
      return;
    }

    // Get the HTML content
    const printContent = componentRef.current.innerHTML;

    // Write the print content to the new window with complete styling
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${sale?.billNumber || ""}</title>
          <style>
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            body { 
              font-family: Arial, sans-serif; 
              padding: 0; 
              direction: rtl;
            }
            .bg-white { background-color: white; }
            .w-full { width: 100%; }
            .text-center { text-align: center; }
            .text-sm { font-size: 0.875rem; }
            .text-xs { font-size: 0.75rem; }
            .text-2xl { font-size: 1.5rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .bg-blue-900 { background-color: #1e3a8a; }
            .text-white { color: white; }
            .border { border: 1px solid #d1d5db; }
            .border-b { border-bottom: 1px solid #d1d5db; }
            .border-gray-300 { border-color: #d1d5db; }
            .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
            .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
            .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .h-8 { height: 2rem; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .gap-2 { gap: 0.5rem; }
            .gap-4 { gap: 1rem; }
            .space-y-1 > * + * { margin-top: 0.25rem; }
            .flex { display: flex; }
            .justify-center { justify-content: center; }
            .text-gray-600 { color: #4b5563; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #d1d5db; }
            @media print {
              @page { 
                margin: 10mm; 
                size: auto;
              }
              body { 
                padding: 0; 
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 100);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();

    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }, [onClose, sale]);

  // Auto print on mount if autoPrint is true
  useEffect(() => {
    if (autoPrint && sale) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, sale, handlePrint]);

  // Don't render if no sale
  if (!sale) {
    return null;
  }

  return (
    <div className="bg-white w-full relative max-w-full max-h-[90vh] overflow-y-auto rounded-md p-4">
      {/* Header */}
      <div className="border-b border-gray-200 flex justify-between items-center sticky -top-4 bg-white z-10">
        <h2 className="text-xl font-bold px-4 py-2">چاپ فاکتور</h2>
        <div className="flex gap-2 px-4 py-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-sm hover:bg-gray-50"
          >
            <PrinterIcon className="h-5 w-5" />
            پرینت
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-sm hover:bg-gray-50"
          >
            <XMarkIcon className="h-5 w-5" />
            بستن
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-sm hover:bg-gray-50">
            <span>PDF</span>
            <BsFiletypePdf />
          </button>
        </div>
      </div>

      {/* PRINT AREA — must wrap Invoice inside a DOM node */}
      <div className="flex justify-center overflow-x-auto p-4">
        <div className="border border-gray-300">
          <div>
            <Invoice
              ref={componentRef}
              sale={sale}
              customer={customer}
              customerAccount={customerAccount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleBillPrint;
