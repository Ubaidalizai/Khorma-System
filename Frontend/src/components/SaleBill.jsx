import React, { forwardRef } from 'react';
import { formatNumberWithPersianDigits, formatCurrency } from '../utilies/helper';
import DateObject from "react-date-object";
import persianCalendar from "react-date-object/calendars/persian";
import persianLocale from "react-date-object/locales/persian_fa";

const SaleBill = forwardRef(({ sale, customer, customerAccount }, ref) => {
  const formatPersianDate = (dateString) => {
    try {
      const date = new DateObject({
        date: new Date(dateString),
        calendar: persianCalendar,
        locale: persianLocale,
      });
      return date.format('YYYY/MM/DD');
    } catch {
      return new Date(dateString).toLocaleDateString('fa-IR');
    }
  };

  const formatPersianDateTime = (dateString) => {
    try {
      const date = new DateObject({
        date: new Date(dateString),
        calendar: persianCalendar,
        locale: persianLocale,
      });
      const dayName = date.format('dddd');
      const dateStr = date.format('YYYY/MM/DD');
      const time = new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      return { dayName, dateStr, time };
    } catch {
      const date = new Date(dateString);
      return {
        dayName: date.toLocaleDateString('fa-IR', { weekday: 'long' }),
        dateStr: date.toLocaleDateString('fa-IR'),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
      };
    }
  };

  // Calculate weight and carton from quantity and unit conversion
  const calculateWeightAndCarton = (item) => {
    const quantity = item.quantity || 0;
    const conversion = item.unit?.conversion_to_base || 1;
    const weight = quantity * conversion;
    
    // Assuming carton is calculated based on unit (you may need to adjust this logic)
    // If unit is carton, use quantity directly, otherwise calculate
    const unitName = item.unit?.name?.toLowerCase() || '';
    const isCarton = unitName.includes('کارتن') || unitName.includes('carton');
    const carton = isCarton ? quantity : 0; // Adjust based on your business logic
    
    return { weight, carton };
  };

  // Calculate totals
  const totalWeight = sale.items?.reduce((sum, item) => {
    const { weight } = calculateWeightAndCarton(item);
    return sum + weight;
  }, 0) || 0;

  const totalCarton = sale.items?.reduce((sum, item) => {
    const { carton } = calculateWeightAndCarton(item);
    return sum + carton;
  }, 0) || 0;

  const printDateTime = formatPersianDateTime(new Date());

  return (
    <div ref={ref} className="bg-white w-full print:w-full print:mx-auto" style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
      {/* Header - Company Banner */}
      <div className="bg-blue-900 text-white text-center py-2">
        <h1 className="text-2xl font-bold">شرکت تجارتی علاء الدین و شجاع الدین برادران</h1>
      </div>

      {/* Business Description */}
      <div className="text-center py-1 border-b border-gray-300">
        <p className="text-sm">فروشنده انواع و اقسام خرما از قبیل کلوته، مضافتی، زاهدی، پیارم و غیره</p>
      </div>

      {/* Address */}
      <div className="text-center py-1 border-b border-gray-300">
        <p className="text-sm">آدرس: نیمروز، زرنج، پشت کوچه قالین فروشی ها، روبروی کوچه نمایندگی سوپر کولا</p>
      </div>

      {/* Contact Information - Two Mobile Numbers */}
      <div className="text-center py-1 border-b border-gray-300">
        <div className="flex justify-center gap-4 text-sm">
          <span>00989136524382 ایران</span>
          <span>شجاع الدين 0796100157</span>
          <span>احسان 0797365500</span>
          <span>علاء الدين 0797661688</span>
          <span>0702301904</span>
        </div>
      </div>

      {/* Bill Details Section */}
      <div className="border-b border-gray-300 py-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-semibold">اسم مشتری:</span> {customer?.name || sale.customerName?.name || sale.customerName || '-'}
          </div>
          <div>
            <span className="font-semibold">تاریخ:</span> {formatPersianDate(sale.saleDate)}
          </div>
          <div>
            <span className="font-semibold">شماره فاکتور:</span> {sale.billNumber || '-'}
          </div>
          <div>
            <span className="font-semibold">تفصیل:</span> 
          </div>
          <div>
            <span className="font-semibold">گدام:</span> {sale.placedIn?.name || '-'}
          </div>
          <div>
            <span className="font-semibold">واحد پول:</span> افغانی
          </div>
        </div>
        {/* Customer Account Info */}
        {customerAccount && (
          <div className="mt-2 pt-2 border-t border-gray-300 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-semibold">حساب:</span> {customerAccount.name || '-'}
              </div>
              <div>
                <span className="font-semibold">موجودی حساب:</span> {customerAccount.currentBalance !== undefined ? formatCurrency(customerAccount.currentBalance) : '-'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Listing Table */}
      <div className="border-b border-gray-300">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border border-gray-300 py-1 px-2 text-center">شماره</th>
              <th className="border border-gray-300 py-1 px-2 text-center">نام محصول</th>
              <th className="border border-gray-300 py-1 px-2 text-center">تفصیل</th>
              <th className="border border-gray-300 py-1 px-2 text-center">وزن</th>
              <th className="border border-gray-300 py-1 px-2 text-center">کارتن</th>
              <th className="border border-gray-300 py-1 px-2 text-center">قیمت</th>
              <th className="border border-gray-300 py-1 px-2 text-center">جمع کل</th>
            </tr>
          </thead>
          <tbody>
            {sale.items?.map((item, index) => {
              const { weight, carton } = calculateWeightAndCarton(item);
              return (
                <tr key={index}>
                  <td className="border border-gray-300 py-1 px-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 py-1 px-2">{item.product?.name || '-'}</td>
                  <td className="border border-gray-300 py-1 px-2"></td>
                  <td className="border border-gray-300 py-1 px-2 text-center">{formatNumberWithPersianDigits(weight.toFixed(1))}</td>
                  <td className="border border-gray-300 py-1 px-2 text-center">{formatNumberWithPersianDigits(carton.toFixed(0))}</td>
                  <td className="border border-gray-300 py-1 px-2 text-center">{formatNumberWithPersianDigits(item.unitPrice)}</td>
                  <td className="border border-gray-300 py-1 px-2 text-center">{formatNumberWithPersianDigits(item.totalPrice)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="border-b border-gray-300 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="border border-gray-300 py-1 px-2 text-sm">
              <span className="font-semibold">مجموع فاکتور:</span> {formatNumberWithPersianDigits(sale.totalAmount)}
            </div>
            <div className="border border-gray-300 py-1 px-2 text-sm">
              <span className="font-semibold">مبلغ رسید:</span> {formatNumberWithPersianDigits(sale.paidAmount)}
            </div>
            <div className="border border-gray-300 py-1 px-2 text-sm">
              <span className="font-semibold">باقیمانده:</span> {formatNumberWithPersianDigits(sale.dueAmount)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="border border-gray-300 py-1 px-2 text-sm">
              <span className="font-semibold">جمله وزن:</span> {formatNumberWithPersianDigits(totalWeight.toFixed(1))}
            </div>
            <div className="border border-gray-300 py-1 px-2 text-sm">
              <span className="font-semibold">جمله کارتن:</span> {formatNumberWithPersianDigits(totalCarton.toFixed(0))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-2">
        <div className="text-center mb-2">
          <p className="text-sm">مهر و امضاء</p>
          <div className="h-8 border-b border-gray-300"></div>
        </div>
        <div className="text-center text-xs text-gray-600">
          <p>تاریخ پرینت: {printDateTime.dayName} - {printDateTime.dateStr}</p>
          <p>ساعت پرینت: {printDateTime.time}</p>
        </div>
      </div>
    </div>
  );
});

SaleBill.displayName = 'SaleBill';

export default SaleBill;
