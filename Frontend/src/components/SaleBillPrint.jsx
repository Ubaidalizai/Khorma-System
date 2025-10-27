import React, { useRef, useEffect, useCallback } from 'react';
import SaleBill from './SaleBill';
import { PrinterIcon } from '@heroicons/react/24/outline';

const SaleBillPrint = ({ sale, customer, customerAccount, onClose, autoPrint = false }) => {
  const componentRef = useRef();

  const handlePrint = useCallback(() => {
    if (!componentRef.current) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups to print');
      return;
    }
    
    // Get the HTML content
    const printContent = componentRef.current.innerHTML;
    
    // Write the print content to the new window with complete styling
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${sale?.billNumber || ''}</title>
          <style>
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              direction: rtl;
            }
            .bg-white { background-color: white; }
            .p-4 { padding: 1rem; }
            .w-\\[80mm\\], .w-\\[297mm\\] { width: 100%; max-width: 297mm; }
            .text-center { text-align: center; }
            .border-b-2 { border-bottom: 2px solid #1f2937; }
            .pb-2 { padding-bottom: 0.5rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .text-lg { font-size: 1.125rem; }
            .text-3xl { font-size: 1.875rem; }
            .text-xs { font-size: 0.75rem; }
            .text-sm { font-size: 0.875rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .text-gray-900 { color: #111827; }
            .text-gray-600 { color: #4b5563; }
            .text-blue-900 { color: #1e3a8a; }
            .text-blue-800 { color: #1e40af; }
            .text-green-600 { color: #16a34a; }
            .text-red-600 { color: #dc2626; }
            .text-gray-800 { color: #1f2937; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .justify-center { justify-content: center; }
            .items-center { align-items: center; }
            .border-t-2 { border-top: 2px solid #1f2937; }
            .border-t { border-top: 1px solid #d1d5db; }
            .border { border: 1px solid #d1d5db; }
            .border-gray-300 { border-color: #d1d5db; }
            .border-gray-800 { border-color: #1f2937; }
            .border-blue-200 { border-color: #bfdbfe; }
            .rounded { border-radius: 0.25rem; }
            .bg-blue-50 { background-color: #eff6ff; }
            .mb-1 { margin-bottom: 0.25rem; }
            .pt-2 { padding-top: 0.5rem; }
            .mt-2 { margin-top: 0.5rem; }
            .mt-4 { margin-top: 1rem; }
            .w-full { width: 100%; }
            table { border-collapse: collapse; width: 100%; }
            th, td { padding: 0.25rem 0.5rem; }
            th { background-color: #f9fafb; font-weight: 600; }
            tr.border-b { border-bottom: 1px solid #d1d5db; }
            .text-right { text-align: right; }
            .text-left { text-align: left; }
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

  const isSmallBill = sale.invoiceType === 'small';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className={`bg-white rounded-lg shadow-xl ${isSmallBill ? 'max-w-4xl' : 'max-w-full'} w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">چاپ فاکتور</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PrinterIcon className="h-5 w-5" />
              چاپ
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              بستن
            </button>
          </div>
        </div>

        {/* Bill Preview */}
        <div className={`p-6 flex justify-center overflow-x-auto ${isSmallBill ? '' : 'scale-75'}`}>
          <div className="border-2 border-gray-300 shadow-lg print:border-0 print:shadow-none">
            <SaleBill
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

