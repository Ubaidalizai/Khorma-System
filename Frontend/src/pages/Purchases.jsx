import {
  BanknotesIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePurchases,
  useSuppliers,
} from "../services/useApi";
import { formatCurrency } from "../utilies/helper";
import PurchaseModal from "../components/PurchaseModal";

const Purchases = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const { data: suppliers } = useSuppliers();
  const { data: purchasesResp, isLoading } = usePurchases({ 
    search, 
    supplier: supplierFilter, 
    status: statusFilter, 
    page, 
    limit 
  });
  
  const purchases = purchasesResp?.purchases || purchasesResp?.data || [];
  const total = purchasesResp?.total || purchases.length || 0;
  const totalPages = purchasesResp?.pages || Math.max(1, Math.ceil(total / limit));
  const findSupplier = (supplierId) => {
    return suppliers?.data?.find(supp => supp._id === supplierId);
  };

  // Calculate statistics
  const stats = {
    totalPurchases: purchases?.length || 0,
    totalAmount: purchases?.reduce((sum, p) => sum + (p.totalAmount || 0), 0) || 0,
    totalPaid: purchases?.reduce((sum, p) => sum + (p.paidAmount || 0), 0) || 0,
    totalOwed: purchases?.reduce((sum, p) => sum + (p.dueAmount || 0), 0) || 0,
    pendingPayments: purchases?.filter((p) => p.dueAmount > 0).length || 0,
    completedPayments: purchases?.filter((p) => p.dueAmount === 0).length || 0,
  };

  // Status colors
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

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "completed":
  //       return "bg-green-100 text-green-800 border border-green-200";
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  //     case "cancelled":
  //       return "bg-red-100 text-red-800 border border-red-200";
  //     default:
  //       return "bg-gray-100 text-gray-800 border border-gray-200";
  //   }
  // };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت خرید</h1>
          <p className="text-gray-600 mt-2">مشاهده و مدیریت خریدها</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مجموع خرید</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalPurchases}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مجموع کل</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(Number(stats?.totalAmount).toFixed(2))}
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
                {formatCurrency(stats.totalPaid?.toFixed(2))}
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
                {formatCurrency(stats.totalOwed?.toFixed(2))}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="جستجو بر اساس نمبر فاکتور یا تهیه کننده..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <select
              value={supplierFilter}
              onChange={(e) => { setSupplierFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">همه تهیه کننده ها</option>
              {suppliers?.data?.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">همه حالات</option>
              <option value="paid">پرداخت شده</option>
              <option value="partial">نسبی پرداخت شده</option>
              <option value="pending">پرداخت معلق</option>
            </select>
          </div>
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            اضافه کردن خرید
          </button>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاریخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تهیه کننده</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">قیمت مجموعی</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">پرداخت شده</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">باقی مانده</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">حالت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    در حال بارگذاری...
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    خریدی یافت نشد
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(purchase.purchaseDate).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {purchase.supplier?.name || findSupplier(purchase.supplier)?.name || 'نامشخص'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                      {formatCurrency(purchase.totalAmount?.toFixed(2))}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {formatCurrency(purchase.paidAmount?.toFixed(2))}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                      {formatCurrency(purchase.dueAmount?.toFixed(2))}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        purchase.dueAmount > 0 ? "partial" : "paid"
                      )}`}>
                        {purchase.dueAmount > 0 ? "نسبی پرداخت شده" : "تمام پرداخت شده"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => navigate(`/purchases/${purchase._id}`)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        title="مشاهده جزئیات"
                      >
                        <EyeIcon className="h-4 w-4" />
                        جزئیات
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              صفحه {page} از {totalPages} (مجموع {total} خرید)
            </div>
            <div className="flex gap-2">
              <button 
                disabled={page <= 1} 
                onClick={() => setPage((p) => Math.max(1, p - 1))} 
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                قبلی
              </button>
              <button 
                disabled={page >= totalPages} 
                onClick={() => setPage((p) => p + 1)} 
                className="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <PurchaseModal 
        isOpen={showPurchaseModal} 
        onClose={() => setShowPurchaseModal(false)} 
      />
    </div>
  );
};

export default Purchases;
