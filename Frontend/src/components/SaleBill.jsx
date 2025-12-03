import React, { forwardRef } from 'react';
import { formatCurrency } from '../utilies/helper';

const SaleBill = forwardRef(({ sale, customer, customerAccount }, ref) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const isSmallBill = sale.invoiceType === 'small';

  return (
    <div ref={ref} className={`bg-white p-4 ${isSmallBill ? 'w-[80mm]' : 'w-[297mm]'} print:w-full print:mx-auto`}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-2 mb-3">
        <h1 className={`font-bold ${isSmallBill ? 'text-lg' : 'text-3xl'} text-gray-900`}>
          دیتس شاپ
        </h1>
        <p className={`text-gray-600 ${isSmallBill ? 'text-xs' : 'text-base'}`}>
          Dates Shop - Fresh Dates & Nuts
        </p>
      </div>

      {/* Bill Number and Date */}
      <div className={`flex justify-between mb-3 ${isSmallBill ? 'text-xs' : 'text-sm'}`}>
        <div>
          <span className="font-semibold">نمبر بیل:</span> {sale.billNumber}
        </div>
        <div>
          <span className="font-semibold">تاریخ:</span> {formatDate(sale.saleDate)}
        </div>
      </div>

      {/* Customer Info */}
      {customer && (
        <div className={`border-t border-gray-300 pt-2 mb-3 ${isSmallBill ? 'text-xs' : 'text-sm'}`}>
          <p><span className="font-semibold">مشتری:</span> {customer.name}</p>
          {customer.phone && <p><span className="font-semibold">تماس:</span> {customer.phone}</p>}
          {customer.address && <p><span className="font-semibold">آدرس:</span> {customer.address}</p>}
        </div>
      )}

      {/* Customer Account Balance */}
      {customerAccount && customerAccount.currentBalance !== 0 && (
        <div className={`${
          customerAccount.currentBalance > 0 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        } rounded p-2 mb-3 ${isSmallBill ? 'text-xs' : 'text-sm'}`}>
          <p className={`font-semibold ${
            customerAccount.currentBalance > 0 
              ? 'text-red-900' 
              : 'text-green-900'
          }`}>وضعیت حساب مشتری:</p>
          <p className={
            customerAccount.currentBalance > 0 
              ? 'text-red-800' 
              : 'text-green-800'
          }>
            {customerAccount.currentBalance > 0 
              ? `باقی مانده: ${formatCurrency(Math.abs(customerAccount.currentBalance))} افغانی`
              : `اعتبار: ${formatCurrency(Math.abs(customerAccount.currentBalance))} افغانی`
            }
          </p>
        </div>
      )}

      {/* Items Table */}
      <div className="border-t-2 border-gray-800 mb-3">
        <table className={`w-full ${isSmallBill ? 'text-xs' : 'text-sm'}`}>
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-right py-1">محصول</th>
              <th className="text-right py-1">تعداد</th>
              <th className="text-right py-1">قیمت</th>
              <th className="text-right py-1">مجموع</th>
            </tr>
          </thead>
          <tbody>
            {sale.items?.map((item, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-1">{item.product?.name || '-'}</td>
                <td className="py-1 text-center">{item.quantity}</td>
                <td className="py-1 text-left">{formatCurrency(item.unitPrice)}</td>
                <td className="py-1 text-left">{formatCurrency(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className={`border-t-2 border-gray-800 pt-2 ${isSmallBill ? 'text-xs' : 'text-sm'}`}>
        <div className="flex justify-between mb-1">
          <span className="font-semibold">قیمت مجموعی:</span>
          <span>{formatCurrency(sale.totalAmount)} AFN</span>
        </div>
        {sale.paidAmount > 0 && (
          <div className="flex justify-between mb-1 text-green-600">
            <span className="font-semibold">پرداخت شده:</span>
            <span>{formatCurrency(sale.paidAmount)} AFN</span>
          </div>
        )}
        {sale.dueAmount > 0 && (
          <div className="flex justify-between mb-1 text-red-600">
            <span className="font-semibold">باقی مانده:</span>
            <span>{formatCurrency(sale.dueAmount)} AFN</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold border-t-2 border-gray-800 pt-2 mt-2">
          <span>مجموع کل:</span>
          <span>{formatCurrency(sale.totalAmount)} AFN</span>
        </div>
      </div>

      {/* Footer */}
      <div className={`text-center mt-4 pt-2 border-t border-gray-300 ${isSmallBill ? 'text-xs' : 'text-sm'} text-gray-600`}>
        <p>تشکر از خرید شما!</p>
        <p>Thank you for your purchase!</p>
      </div>
    </div>
  );
});

SaleBill.displayName = 'SaleBill';

export default SaleBill;

