import {
  BanknotesIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  EyeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  usePurchases,
  useSuppliers,
  usePurchase,
  useUpdatePurchase,
  useDeletePurchase,
  useProducts,
  useUnits,
  useSystemAccounts,
} from "../services/useApi";
import { formatCurrency } from "../utilies/helper";
import PurchaseModal from "../components/PurchaseModal";
import { XCircleIcon } from "lucide-react";
import { recordPurchasePayment } from "../services/apiUtiles";

const Purchases = () => {
  // URL parameters for modal flow
  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get('openId');
  const action = searchParams.get('action');

  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [editFormData, setEditFormData] = useState({
    supplier: '',
    purchaseDate: '',
    paidAmount: 0,
    paymentAccount: '',
    stockLocation: 'warehouse',
    items: [],
    reason: ''
  });
  const [currentEditItem, setCurrentEditItem] = useState({
    product: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
    batchNumber: '',
    expiryDate: ''
  });

  const { data: suppliers } = useSuppliers();
  const { data: products } = useProducts();
  const { data: units } = useUnits();
  const { data: systemAccounts } = useSystemAccounts();
  const { data: purchasesResp, isLoading } = usePurchases({ 
    search, 
    supplier: supplierFilter, 
    page, 
    limit 
  });
  const { data: selectedPurchase, isLoading: isLoadingDetails } = usePurchase(selectedPurchaseId);
  const updatePurchaseMutation = useUpdatePurchase();
  const deletePurchaseMutation = useDeletePurchase();
  
  const purchases = useMemo(() => purchasesResp?.purchases || purchasesResp?.data || [], [purchasesResp?.purchases, purchasesResp?.data]);
  const total = purchasesResp?.total || purchases.length || 0;
  const totalPages = purchasesResp?.pages || Math.max(1, Math.ceil(total / limit));
  const findSupplier = (supplierId) => {
    return suppliers?.data?.find(supp => supp._id === supplierId);
  };

  const handleViewDetails = (purchaseId) => {
    setSelectedPurchaseId(purchaseId);
    setShowDetailsModal(true);
  };

  const handleEditPurchase = (purchase) => {
    setEditingPurchase(purchase);
    setSelectedPurchaseId(purchase._id); // This will trigger usePurchase hook
    
    // Populate form with existing purchase data
    setEditFormData({
      supplier: purchase.supplier?._id || purchase.supplier || '',
      purchaseDate: new Date(purchase.purchaseDate).toISOString().split('T')[0],
      paidAmount: purchase.paidAmount || 0,
      paymentAccount: '', // Will need to fetch from transaction
      stockLocation: 'warehouse', // Default
      items: purchase.items || [],
      reason: ''
    });
    
    setShowEditModal(true);
  };

  const handleDeletePurchase = (purchaseId) => {
    setDeleteConfirmId(purchaseId);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deletePurchaseMutation.mutate(deleteConfirmId, {
        onSuccess: () => {
          setDeleteConfirmId(null);
        },
        onError: (error) => {
          alert(`خطا در حذف خرید: ${error.message}`);
        }
      });
    }
  };

  // Handle URL parameters for modal flow
  useEffect(() => {
    if (openId && action === 'view') {
      // Find the purchase with the given ID
      const purchase = purchases.find(p => p._id === openId);
      if (purchase) {
        setSelectedPurchaseId(openId);
        setShowDetailsModal(true);
      }
    }
  }, [openId, action, purchases]);

  // Clear URL parameters when modals close
  const clearUrlParams = () => {
    setSearchParams({});
  };

  // Payment handler
  const handleRecordPayment = async () => {
    if (!paymentAmount || !selectedAccount) {
      alert("لطفاً مبلغ و حساب پرداخت را وارد کنید");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount <= 0 || amount > selectedPurchase.purchase.dueAmount) {
      alert(`مبلغ وارد شده باید بین 0 و ${selectedPurchase.purchase.dueAmount} باشد`);
      return;
    }

    setIsSubmittingPayment(true);
    try {
      await recordPurchasePayment(selectedPurchaseId, {
        amount,
        paymentAccount: selectedAccount,
        description: paymentDescription || `Payment for purchase`,
      });
      
      alert("پرداخت با موفقیت ثبت شد!");
      setShowPaymentModal(false);
      setPaymentAmount("");
      setSelectedAccount("");
      setPaymentDescription("");
      window.location.reload();
    } catch (error) {
      alert("خطا در ثبت پرداخت: " + error.message);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Helper functions for edit form
  const addEditItem = () => {
    if (currentEditItem.product && currentEditItem.unit && currentEditItem.quantity > 0) {
      const totalPrice = currentEditItem.quantity * currentEditItem.unitPrice;
      const newItem = {
        ...currentEditItem,
        totalPrice,
        product: currentEditItem.product,
        unit: currentEditItem.unit
      };
      
      setEditFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
      
      setCurrentEditItem({
        product: '',
        unit: '',
        quantity: 0,
        unitPrice: 0,
        batchNumber: '',
        expiryDate: ''
      });
    }
  };

  const removeEditItem = (index) => {
    setEditFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateEditTotals = () => {
    const subtotal = editFormData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const dueAmount = Math.max(subtotal - editFormData.paidAmount, 0);
    return { subtotal, dueAmount };
  };

  // Update form data when purchase details are loaded
  useEffect(() => {
    if (selectedPurchase && showEditModal && editingPurchase) {
      const purchaseData = selectedPurchase.purchase || selectedPurchase;
      setEditFormData(prev => ({
        ...prev,
        supplier: purchaseData.supplier?._id || purchaseData.supplier || prev.supplier,
        purchaseDate: purchaseData.purchaseDate ? new Date(purchaseData.purchaseDate).toISOString().split('T')[0] : prev.purchaseDate,
        paidAmount: purchaseData.paidAmount || prev.paidAmount,
        items: purchaseData.items || prev.items
      }));
    }
  }, [selectedPurchase, showEditModal, editingPurchase]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
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
              placeholder="جستجو بر اساس نام تهیه کننده..."
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(purchase._id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title="مشاهده جزئیات"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditPurchase(purchase)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          title="ویرایش"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePurchase(purchase._id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          title="حذف"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
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

      {/* Purchase Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">جزئیات خرید</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  clearUrlParams();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            {isLoadingDetails ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
              </div>
            ) : selectedPurchase && selectedPurchaseId ? (
              <div className="p-4 space-y-4">
                {/* Purchase Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">قیمت مجموعی</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {formatCurrency(selectedPurchase.purchase?.totalAmount?.toFixed(2))}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">مبلغ پرداخت شده</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(selectedPurchase.purchase?.paidAmount?.toFixed(2))}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">مبلغ باقی مانده</p>
                    <p className="text-lg font-semibold text-red-600">
                      {formatCurrency(selectedPurchase.purchase?.dueAmount?.toFixed(2))}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">تعداد اجناس</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {selectedPurchase.purchase?.items?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Purchase Information */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">اطلاعات خرید</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">نمبر بیل</h4>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedPurchase.purchase?.batchNumber || 'نامشخص'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">تاریخ خرید</h4>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(selectedPurchase.purchase?.purchaseDate)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">تهیه کننده</h4>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedPurchase.purchase?.supplier?.name || findSupplier(selectedPurchase.purchase?.supplier)?.name || 'نامشخص'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">حالت پرداخت</h4>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        selectedPurchase.purchase?.dueAmount > 0 ? "partial" : "paid"
                      )}`}>
                        {selectedPurchase.purchase?.dueAmount > 0 ? "نسبی پرداخت شده" : "تمام پرداخت شده"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Purchase Items */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">اجناس خریداری شده</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">محصول</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">واحد</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">تعداد</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">قیمت یک دانه</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">قیمت مجموعی</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedPurchase.purchase?.items?.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-3 py-6 text-center text-gray-500 text-sm">
                              جنس یافت نشد
                            </td>
                          </tr>
                        ) : (
                          selectedPurchase.purchase?.items?.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {item.product?.name || 'نامشخص'}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {item.unit?.name || '-'}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {item.quantity || 0}
                              </td>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {formatCurrency(item.unitPrice?.toFixed(2))}
                              </td>
                              <td className="px-3 py-2 text-sm font-medium text-purple-600">
                                {formatCurrency(item.totalPrice?.toFixed(2))}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Total Summary */}
                  <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        {selectedPurchase.purchase?.dueAmount > 0 && (
                          <button
                            onClick={() => setShowPaymentModal(true)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                          >
                            <BanknotesIcon className="h-4 w-4" />
                            ثبت پرداخت
                          </button>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          مجموع کل: {formatCurrency(selectedPurchase.purchase?.totalAmount?.toFixed(2))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-red-600">خطا در بارگذاری اطلاعات خرید</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">تأیید حذف</h3>
              </div>
              <p className="text-gray-600 mb-6">
                آیا مطمئن هستید که می‌خواهید این خرید را حذف کنید؟ این عمل قابل بازگشت نیست.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  لغو
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletePurchaseMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deletePurchaseMutation.isPending ? 'در حال حذف...' : 'حذف'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">ثبت پرداخت</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">مبلغ باقی‌مانده: {formatCurrency(selectedPurchase.purchase?.dueAmount)} AFN</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ پرداخت *</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="مبلغ را وارد کنید"
                  max={selectedPurchase.purchase?.dueAmount}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">حساب پرداخت *</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">انتخاب حساب</option>
                  {systemAccounts?.accounts?.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name} ({formatCurrency(acc.currentBalance)} AFN)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
                <textarea
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  rows={3}
                  placeholder="توضیحات اختیاری..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  onClick={handleRecordPayment}
                  disabled={isSubmittingPayment}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmittingPayment ? "در حال ثبت..." : "ثبت پرداخت"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Edit Purchase Modal */}
      {showEditModal && editingPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">ویرایش کامل خرید</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تهیه کننده
                  </label>
                  <select
                    value={editFormData.supplier}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, supplier: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">انتخاب تهیه کننده</option>
                    {suppliers?.data?.map((supplier) => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاریخ خرید
                  </label>
                  <input
                    type="date"
                    value={editFormData.purchaseDate}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مبلغ پرداخت شده
                  </label>
                  <input
                    type="number"
                    value={editFormData.paidAmount}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, paidAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    حساب پرداخت
                  </label>
                  <select
                    value={editFormData.paymentAccount}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, paymentAccount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">انتخاب حساب پرداخت</option>
                    {systemAccounts?.accounts?.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مکان انبار
                  </label>
                  <select
                    value={editFormData.stockLocation}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, stockLocation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="warehouse">انبار</option>
                    <option value="store">فروشگاه</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    دلیل تغییر
                  </label>
                  <input
                    type="text"
                    value={editFormData.reason}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="دلیل تغییر خرید"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">اجناس خرید</h3>
                
                {/* Add New Item */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">محصول</label>
                    <select
                      value={currentEditItem.product}
                      onChange={(e) => setCurrentEditItem(prev => ({ ...prev, product: e.target.value }))}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="">انتخاب محصول</option>
                      {products?.data?.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">واحد</label>
                    <select
                      value={currentEditItem.unit}
                      onChange={(e) => setCurrentEditItem(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="">انتخاب واحد</option>
                      {units?.data?.map((unit) => (
                        <option key={unit._id} value={unit._id}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">تعداد</label>
                    <input
                      type="number"
                      value={currentEditItem.quantity}
                      onChange={(e) => setCurrentEditItem(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">قیمت واحد</label>
                    <input
                      type="number"
                      value={currentEditItem.unitPrice}
                      onChange={(e) => setCurrentEditItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">شماره بچ</label>
                    <input
                      type="text"
                      value={currentEditItem.batchNumber}
                      onChange={(e) => setCurrentEditItem(prev => ({ ...prev, batchNumber: e.target.value }))}
                      placeholder="اختیاری"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addEditItem}
                      className="w-full px-3 py-1 bg-amber-600 text-white text-sm rounded hover:bg-amber-700"
                    >
                      اضافه کردن
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {editFormData.items.length > 0 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-500 mb-2 px-3">
                      <span>محصول</span>
                      <span>واحد</span>
                      <span>تعداد</span>
                      <span>قیمت واحد</span>
                      <span>مجموع</span>
                      <span>عملیات</span>
                    </div>
                    {editFormData.items.map((item, index) => {
                      console.log('Item data:', item);
                      console.log('Products data:', products?.data);
                      console.log('Units data:', units?.data);
                      
                      // Get product and unit names
                      const productName = item.product?.name || 
                                        products?.data?.find(p => p._id === item.product)?.name || 
                                        'نامشخص';
                      const unitName = item.unit?.name || 
                                     units?.data?.find(u => u._id === item.unit)?.name || 
                                     'نامشخص';
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
                          <div className="flex-1 grid grid-cols-5 gap-4 text-sm">
                            <span className="font-medium">{productName}</span>
                            <span>{unitName}</span>
                            <span>{item.quantity || 0}</span>
                            <span>{formatCurrency(item.unitPrice || 0)}</span>
                            <span className="font-semibold text-purple-600">{formatCurrency(item.totalPrice || 0)}</span>
                          </div>
                          <button
                            onClick={() => removeEditItem(index)}
                            className="ml-4 text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">مجموع کل:</span>
                    <span className="font-semibold text-gray-900 ml-2">
                      {formatCurrency(calculateEditTotals().subtotal?.toFixed(2))}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">پرداخت شده:</span>
                    <span className="font-semibold text-gray-900 ml-2">
                      {formatCurrency(editFormData.paidAmount?.toFixed(2))}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">باقی مانده:</span>
                    <span className="font-semibold text-gray-900 ml-2">
                      {formatCurrency(calculateEditTotals().dueAmount?.toFixed(2))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  لغو
                </button>
                  <button
                    onClick={() => {
                      const updateData = {
                        id: editingPurchase._id,
                        supplier: editFormData.supplier,
                        purchaseDate: editFormData.purchaseDate,
                        paidAmount: editFormData.paidAmount,
                        stockLocation: editFormData.stockLocation,
                        items: editFormData.items,
                        reason: editFormData.reason || 'Purchase updated via UI'
                      };
                      
                      // Only include paymentAccount if it's provided
                      if (editFormData.paymentAccount) {
                        updateData.paymentAccount = editFormData.paymentAccount;
                      }
                      
                      updatePurchaseMutation.mutate(updateData, {
                      onSuccess: () => {
                        setShowEditModal(false);
                        setEditingPurchase(null);
                        setEditFormData({
                          supplier: '',
                          purchaseDate: '',
                          paidAmount: 0,
                          paymentAccount: '',
                          stockLocation: 'warehouse',
                          items: [],
                          reason: ''
                        });
                      },
                      onError: (error) => {
                        alert(`خطا در ویرایش خرید: ${error.message}`);
                      }
                    });
                  }}
                  disabled={updatePurchaseMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50"
                >
                  {updatePurchaseMutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
