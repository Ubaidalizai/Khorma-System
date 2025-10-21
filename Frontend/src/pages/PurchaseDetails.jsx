import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { usePurchase, useSuppliers } from "../services/useApi";
import { formatCurrency } from "../utilies/helper";

const PurchaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: purchase, isLoading, error } = usePurchase(id);
  const { data: suppliers } = useSuppliers();

  const findSupplier = (supplierId) => {
    return suppliers?.data?.find(supp => supp._id === supplierId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border border-green-200";
      case "partial":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "pending":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !purchase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">خطا در بارگذاری اطلاعات خرید</p>
          <button
            onClick={() => navigate('/purchases')}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            بازگشت به لیست خریدها
          </button>
        </div>
      </div>
    );
  }

  const supplier = findSupplier(purchase.supplier);

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/purchases')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">جزئیات خرید</h1>
            <p className="text-gray-600 mt-1">فاکتور #{purchase._id?.slice(-8)}</p>
          </div>
        </div>
      </div>

      {/* Purchase Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">قیمت مجموعی</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(purchase.totalAmount?.toFixed(2))}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مبلغ پرداخت شده</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(purchase.paidAmount?.toFixed(2))}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مبلغ باقی مانده</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(purchase.dueAmount?.toFixed(2))}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">تعداد اجناس</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {purchase?.items?.length || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">اطلاعات خرید</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">نمبر فاکتور</h4>
            <p className="text-lg font-semibold text-gray-900">
              {purchase._id?.slice(-8)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">تاریخ خرید</h4>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(purchase.purchaseDate)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">تهیه کننده</h4>
            <p className="text-lg font-semibold text-gray-900">
              {supplier?.name || 'نامشخص'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">حالت پرداخت</h4>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
              purchase.dueAmount > 0 ? "partial" : "paid"
            )}`}>
              {purchase.dueAmount > 0 ? "نسبی پرداخت شده" : "تمام پرداخت شده"}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">طریقه پرداخت</h4>
            <p className="text-lg font-semibold text-gray-900">نقد</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">تاریخ ایجاد</h4>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(purchase.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">اجناس خریداری شده</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">محصول</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">واحد</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تعداد</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">قیمت یک دانه</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">قیمت مجموعی</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchase?.items?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    جنس یافت نشد
                  </td>
                </tr>
              ) : (
                purchase?.items?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.product?.name || 'نامشخص'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.unit?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.quantity || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(item.unitPrice?.toFixed(2))}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                      {formatCurrency(item.totalPrice?.toFixed(2))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Total Summary */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                مجموع کل: {formatCurrency(purchase.totalAmount?.toFixed(2))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;
