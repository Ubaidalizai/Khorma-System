import {
  ArrowUturnLeftIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CubeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import { TrendingDown, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import TableBody from "../components/TableBody";
import TableColumn from "../components/TableColumn";
import TableRow from "../components/TableRow";
import {
  useInventoryStats,
  useProduct,
  usePurchases,
  useRecentTransactions,
  useReverseTransaction,
  useSales,
} from "../services/useApi";
import { useAuditLogsByTable } from "../services/useAuditLogs";
import TableHeader from "./../components/TableHeader";
import { formatCurrency } from "./../utilies/helper";
import { inputStyle } from "./../components/ProductForm";

const Dashboard = () => {
  const headers = [
    { title: "حساب" },
    { title: "نوع انتقال" },
    { title: "انتقال دهنده" },
    { title: "تاریخ" },
    { title: "مبلغ" },
    { title: "عملیات" },
  ];

  // Helper function to render values nicely
  const renderValue = (value, depth = 0) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500">خالی</span>;
    }
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return (
          <div className={`ml-${depth * 4} mt-1`}>
            <div className="text-xs text-gray-600 mb-1">
              آرایه ({value.length} آیتم):
            </div>
            {value.map((item, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-2 mb-1">
                <span className="text-xs text-gray-500">[{index}]:</span>
                {renderValue(item, depth + 1)}
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div className={`ml-${depth * 4} mt-1`}>
            <div className="text-xs text-gray-600 mb-1">شیء:</div>
            {Object.entries(value).map(([key, val]) => (
              <div key={key} className="border-l-2 border-gray-200 pl-2 mb-1">
                <span className="font-medium text-xs">{key}:</span>
                {renderValue(val, depth + 1)}
              </div>
            ))}
          </div>
        );
      }
    } else {
      return <span className="text-sm">{String(value)}</span>;
    }
  };
  const getTypeColor = (type) => {
    switch (type) {
      case "Sale":
        return "text-blue-600 ";
      case "Purchase":
        return "text-orange-600  ";
      case "Payment":
        return "text-green-600";
      case "Transfer":
        return "text-purple-600 ";
      case "Expense":
        return "text-red-600";
      case "Credit":
        return "text-green-700 ";
      case "Debit":
        return "text-red-700 ";
      case "SaleReturn":
        return "text-yellow-600 ";
      default:
        return "text-gray-800";
    }
  };

  const getTransactionTypePersian = (type) => {
    switch (type) {
      case "Sale":
        return "فروش";
      case "Purchase":
        return "خرید";
      case "Payment":
        return "پرداخت";
      case "Transfer":
        return "انتقال";
      case "Expense":
        return "هزینه";
      case "Credit":
        return "اعتبار";
      case "Debit":
        return "بدهی";
      case "SaleReturn":
        return "بازگشت فروش";
      default:
        return type;
    }
  };

  const getOperationPersian = (operation) => {
    switch (operation) {
      case "INSERT":
        return "درج";
      case "UPDATE":
        return "بروزرسانی";
      case "DELETE":
        return "حذف";
      default:
        return operation;
    }
  };

  const getOperationColor = (operation) => {
    switch (operation) {
      case "INSERT":
        return "text-green-600";
      case "UPDATE":
        return "text-yellow-600";
      case "DELETE":
        return "text-red-600";
      default:
        return "text-gray-800";
    }
  };

  // API hooks
  const { data: products, isLoading: productsLoading } = useProduct();
  const { data: sales, isLoading: salesLoading } = useSales();
  const { data: purchases, isLoading: purchasesLoading } = usePurchases();
  // const { data: inventory, isLoading: inventoryLoading } = useInventory();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [reason, setReason] = useState("");
  const [activeTab, setActiveTab] = useState("transaction");
  const { data: recentTransactions, isLoading: statsLoading } =
    useRecentTransactions({ page: currentPage, limit });
  // const { data: lowStockItems, isLoading: lowStockLoading } =
  //   useLowStockItems();
  const { data: lowStock, isLoading: lowStockLoading } = useInventoryStats();
  const { mutate: reverseTransaction, isLoading: reverseLoading } =
    useReverseTransaction();

  // Audit logs hooks
  const [auditPage, setAuditPage] = useState(1);
  const [auditLimit] = useState(10);
  const [selectedTable, setSelectedTable] = useState("Sale");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const tableLogs = useAuditLogsByTable(selectedTable, {
    page: auditPage,
    limit: auditLimit,
  });

  const auditLogs = tableLogs.data;
  const auditLoading = tableLogs.isLoading;

  useEffect(() => {
    setAuditPage(1);
  }, [selectedTable]);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    lowStockItems: 0,
    totalStock: 0,
    totalReceivables: 0,
    totalPayables: 0,
    netProfit: 0,
  });

  const handleReverseClick = (transaction) => {
    if (transaction && transaction._id && transaction._id !== "undefined") {
      setSelectedTransaction(transaction);
      setShowModal(true);
    }
  };

  const handleConfirmReverse = () => {
    if (reason.trim() && selectedTransaction && selectedTransaction._id) {
      reverseTransaction({ id: selectedTransaction._id, reason });
      setShowModal(false);
      setReason("");
      setSelectedTransaction(null);
    }
  };

  // Use dashboard stats from API or calculate from individual endpoints
  useEffect(() => {
    // Fallback calculation if dashboard stats not available
    // Ensure sales is an array before calling reduce

    const totalSalesAmount =
      sales?.data?.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0) || 0;
    const totalPurchasesAmount =
      purchases?.purchases?.reduce(
        (sum, purchase) => sum + (purchase.totalAmount || 0),
        0
      ) || 0;
    const totalStockQuantity =
      products?.data?.reduce(
        (sum, product) => sum + (product.quantity || 0),
        0
      ) || 0;
    const totalReceivables =
      sales?.data?.reduce((sum, sale) => sum + (sale.dueAmount || 0), 0) || 0;
    const totalPayables =
      purchases?.purchases?.reduce(
        (sum, purchase) => sum + (purchase.dueAmount || 0),
        0
      ) || 0;
    const netProfit = sales?.summary?.totalProfit || 0;

    const newStats = {
      totalProducts: Array.isArray(products?.data) ? products?.data.length : 0,
      totalSales: totalSalesAmount,
      totalPurchases: totalPurchasesAmount,
      lowStockItems: lowStock?.data?.lowStockDetails?.length || 0,
      totalStock: totalStockQuantity,
      totalReceivables,
      totalPayables,
      netProfit,
    };

    setStats(newStats);
  }, [products, sales, purchases, lowStock]);
  // Format recent transactions from API data

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "زمان نامشخص";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "همین الان";
    if (diffInHours < 24) return `${diffInHours} ساعت پیش`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} روز پیش`;
    // For older dates, show the date in Dari format
    return date.toLocaleDateString("fa-IR");
  };

  const StatCard = ({ title, value, icon, color = "#6366F1", change }) => {
    const isPositive = change > 0;
    return (
      <div className="bg-white hover:translate-y-1.5 transition-all duration-200  cursor-pointer  rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title} </p>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {change ? (
                <div
                  className={`mt-2 text-center  w-full  flex items-center gap-1 text-sm font-medium ${
                    isPositive
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  <div className=" flex items-center justify-start">
                    {isPositive ? (
                      <span className=" p-3">
                        <TrendingUp size={24} />
                      </span>
                    ) : (
                      <span className=" p-3 ">
                        <TrendingDown size={24} />
                      </span>
                    )}
                    <span className="">
                      {isPositive ? "+" : "-"}%
                      {change > 0 ? change : change * -1}
                    </span>
                  </div>
                </div>
              ) : (
                <p style={{ color }}> {value}</p>
              )}
            </div>
          </div>

          <div
            className="p-3 rounded-lg border border-slate-200"
            style={{
              background: `linear-gradient(135deg, ${color}33, ${color}99)`,
            }}
          >
            {React.createElement(icon, {
              className: "h-6 w-6",
              style: { color },
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Page header */}
      <div>
        <h1
          className="font-bold"
          style={{
            fontSize: "var(--h1-size)",
            color: "var(--text-dark)",
            marginBottom: "var(--space-2)",
          }}
        >
          داشبورد
        </h1>
        <p
          style={{
            color: "var(--text-medium)",
            fontSize: "var(--body-regular)",
          }}
        >
          خوش آمدید! اینجا وضعیت کسب‌وکار شما نمایش داده می‌شود.
        </p>
      </div>

      {/* Stats grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
        style={{ gap: "var(--space-6)" }}
      >
        <StatCard
          title="کل محصولات"
          value={statsLoading || productsLoading ? "..." : stats.totalProducts}
          icon={CubeIcon}
          color="var(--info-blue)"
        />

        <StatCard
          title="موجودی کم"
          value={statsLoading || lowStockLoading ? "..." : stats.lowStockItems}
          icon={ExclamationTriangleIcon}
          color="var(--error-red)"
        />
        <StatCard
          title="دریافتنی‌ها"
          value={
            statsLoading || salesLoading
              ? "..."
              : formatCurrency(stats.totalReceivables)
          }
          icon={ReceiptRefundIcon}
          color="var(--success-green)"
        />
        <StatCard
          title="پرداختنی‌ها"
          value={
            statsLoading || purchasesLoading
              ? "..."
              : formatCurrency(stats.totalPayables)
          }
          icon={DocumentTextIcon}
          color="var(--error-red)"
        />
        <StatCard
          title="سود خالص"
          value={
            statsLoading || salesLoading
              ? "..."
              : formatCurrency(stats.netProfit)
          }
          icon={ChartBarIcon}
          color="var(--success-green)"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("transaction")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "transaction"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              انتقالات اخیر
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "logs"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BuildingOffice2Icon className="h-5 w-5" />
              لاگ های سیستم
            </button>
          </nav>
        </div>
      </div>
      {activeTab === "transaction" && (
        <div className="card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader headerData={headers} />
              <TableBody>
                {statsLoading ? (
                  <TableRow>
                    <TableColumn>
                      <p className="">در حال بارگیری...</p>
                    </TableColumn>
                  </TableRow>
                ) : recentTransactions?.data?.transactions?.length > 0 ? (
                  recentTransactions.data?.transactions?.map(
                    (transaction, index) => (
                      <TableRow key={index}>
                        <TableColumn className="px-4 py-2">
                          {transaction.account?.name || "Unknown"}
                        </TableColumn>
                        <TableColumn
                          className={`font-semibold text-center ${getTypeColor(
                            transaction.transactionType
                          )}`}
                        >
                          {getTransactionTypePersian(
                            transaction.transactionType
                          )}
                        </TableColumn>
                        <TableColumn className="px-4">
                          {transaction.created_by?.name || "Unknown"}
                        </TableColumn>
                        <TableColumn className="px-4">
                          {formatTimeAgo(transaction.date)}
                        </TableColumn>
                        <TableColumn
                          className={`px-4 font-semibold ${
                            (transaction.amount || 0) > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(transaction.amount || 0)}
                        </TableColumn>
                        <TableColumn className="px-4">
                          <button
                            onClick={() => handleReverseClick(transaction)}
                            disabled={reverseLoading}
                            className="text-red-500 transition-all duration-200 hover:bg-red-100 p-0.5 rounded-full  hover:text-red-700 disabled:opacity-50"
                            title="برگشت"
                          >
                            <ArrowUturnLeftIcon className="h-5 w-5" />
                          </button>
                        </TableColumn>
                      </TableRow>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      هیچ تراکنش اخیر یافت نشد
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
            {recentTransactions?.data?.pagination &&
              recentTransactions?.data?.pagination?.totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    قبلی
                  </button>
                  <span className="px-3 py-1">
                    صفحه {currentPage} از{" "}
                    {recentTransactions?.data?.pagination?.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          recentTransactions?.data?.pagination?.totalPages
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      recentTransactions?.data?.pagination?.totalPages
                    }
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    بعدی
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
      {activeTab === "logs" && (
        <div className="card">
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  انتخاب جدول برای نمایش لاگ‌ها
                </label>
                <div className="relative">
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className={inputStyle}
                  >
                    <option value="Sale">فروش</option>
                    <option value="Purchase">خرید</option>
                    <option value="Transaction">تراکنش‌ها</option>
                    <option value="Stock">موجودی</option>
                    <option value="Account">انتقال</option>
                  </select>
                </div>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  جستجو در لاگ‌ها
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="جستجو بر اساس دلیل، تغییر دهنده یا عملیات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${inputStyle} pr-10`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {auditLogs?.pagination && auditLogs.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mb-4 space-x-2">
              <button
                onClick={() => setAuditPage((prev) => Math.max(prev - 1, 1))}
                disabled={auditPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                قبلی
              </button>
              <span className="px-3 py-1">
                صفحه {auditPage} از {auditLogs.pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setAuditPage((prev) =>
                    Math.min(prev + 1, auditLogs.pagination.totalPages)
                  )
                }
                disabled={auditPage === auditLogs.pagination.totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                بعدی
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader
                headerData={[
                  { title: "تاریخ تغییر" },
                  { title: "جدول" },
                  { title: "دلیل" },
                  { title: "تغییر دهنده" },
                  { title: "نوعیت عملیات" },
                  { title: "جزئیات" },
                ]}
              />
              <TableBody>
                {auditLoading ? (
                  <TableRow>
                    <TableColumn>
                      <p className="">در حال بارگیری...</p>
                    </TableColumn>
                  </TableRow>
                ) : auditLogs?.data?.length > 0 ? (
                  auditLogs.data.map((log, index) => (
                    <TableRow key={index}>
                      <TableColumn className="px-4 py-2">
                        {formatTimeAgo(log.changedAt)}
                      </TableColumn>
                      <TableColumn className="px-4">
                        {log.tableName || "نامشخص"}
                      </TableColumn>
                      <TableColumn className="px-4">
                        {log.reason || "بدون دلیل"}
                      </TableColumn>
                      <TableColumn className="px-4">
                        {log.changedBy || "نامشخص"}
                      </TableColumn>
                      <TableColumn
                        className={`px-4 font-semibold ${getOperationColor(
                          log.operation
                        )}`}
                      >
                        {getOperationPersian(log.operation)}
                      </TableColumn>
                      <TableColumn className="px-4">
                        <button
                          onClick={() => {
                            setSelectedLog(log);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-500 hover:bg-blue-100 p-1 rounded transition-colors"
                          title="مشاهده جزئیات"
                        >
                          <DocumentTextIcon className="h-5 w-5" />
                        </button>
                      </TableColumn>
                    </TableRow>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      هیچ لاگ حسابرسی یافت نشد
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
            {auditLogs?.pagination && auditLogs.pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => setAuditPage((prev) => Math.max(prev - 1, 1))}
                  disabled={auditPage === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  قبلی
                </button>
                <span className="px-3 py-1">
                  صفحه {auditPage} از {auditLogs.pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setAuditPage((prev) =>
                      Math.min(prev + 1, auditLogs.pagination.totalPages)
                    )
                  }
                  disabled={auditPage === auditLogs.pagination.totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  بعدی
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">تأیید برگشت تراکنش</h3>
            <p className="mb-4">لطفاً دلیل برگشت این تراکنش را وارد کنید:</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows="3"
              placeholder="دلیل برگشت..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                لغو
              </button>
              <button
                onClick={handleConfirmReverse}
                disabled={!reason.trim() || reverseLoading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {reverseLoading ? "در حال پردازش..." : "تأیید برگشت"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">جزئیات لاگ حسابرسی</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    جدول
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedLog.tableName || "نامشخص"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    نوع عملیات
                  </label>
                  <p
                    className={`mt-1 text-sm font-semibold ${getOperationColor(
                      selectedLog.operation
                    )}`}
                  >
                    {getOperationPersian(selectedLog.operation)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    تغییر دهنده
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedLog.changedBy || "نامشخص"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    تاریخ تغییر
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatTimeAgo(selectedLog.changedAt)}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  دلیل
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedLog.reason || "بدون دلیل"}
                </p>
              </div>
              {selectedLog.operation === "INSERT" && selectedLog.newData && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    داده‌های جدید اضافه شده
                  </label>
                  <div className="bg-green-50 p-4 rounded border overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-green-100">
                          <th className="px-4 py-2 text-left text-green-800 font-semibold">
                            فیلد
                          </th>
                          <th className="px-4 py-2 text-left text-green-800 font-semibold">
                            مقدار
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(selectedLog.newData).map(
                          ([key, value], index) => (
                            <tr
                              key={key}
                              className={
                                index % 2 === 0 ? "bg-green-50" : "bg-white"
                              }
                            >
                              <td className="px-4 py-2 font-medium text-green-800 border-b border-green-200">
                                {key}
                              </td>
                              <td className="px-4 py-2 text-green-700 border-b border-green-200">
                                {renderValue(value)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {selectedLog.operation === "UPDATE" &&
                (selectedLog.oldData || selectedLog.newData) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مقایسه داده‌ها: قبل و بعد از تغییر
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedLog.oldData && (
                        <div className="bg-red-50 p-4 rounded border overflow-x-auto">
                          <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                            <span>🔴</span> داده‌های قدیمی (قبل از تغییر)
                          </h4>
                          <table className="min-w-full table-auto">
                            <thead>
                              <tr className="bg-red-100">
                                <th className="px-4 py-2 text-left text-red-800 font-semibold">
                                  فیلد
                                </th>
                                <th className="px-4 py-2 text-left text-red-800 font-semibold">
                                  مقدار قدیمی
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(selectedLog.oldData).map(
                                ([key, value], index) => (
                                  <tr
                                    key={key}
                                    className={
                                      index % 2 === 0 ? "bg-red-50" : "bg-white"
                                    }
                                  >
                                    <td className="px-4 py-2 font-medium text-red-800 border-b border-red-200">
                                      {key}
                                    </td>
                                    <td className="px-4 py-2 text-red-700 border-b border-red-200">
                                      {renderValue(value)}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {selectedLog.newData && (
                        <div className="bg-green-50 p-4 rounded border overflow-x-auto">
                          <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                            <span>🟢</span> داده‌های جدید (بعد از تغییر)
                          </h4>
                          <table className="min-w-full table-auto">
                            <thead>
                              <tr className="bg-green-100">
                                <th className="px-4 py-2 text-left text-green-800 font-semibold">
                                  فیلد
                                </th>
                                <th className="px-4 py-2 text-left text-green-800 font-semibold">
                                  مقدار جدید
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(selectedLog.newData).map(
                                ([key, value], index) => (
                                  <tr
                                    key={key}
                                    className={
                                      index % 2 === 0
                                        ? "bg-green-50"
                                        : "bg-white"
                                    }
                                  >
                                    <td className="px-4 py-2 font-medium text-green-800 border-b border-green-200">
                                      {key}
                                    </td>
                                    <td className="px-4 py-2 text-green-700 border-b border-green-200">
                                      {renderValue(value)}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              {selectedLog.operation === "DELETE" && selectedLog.oldData && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    داده‌های حذف شده
                  </label>
                  <div className="bg-red-50 p-4 rounded border overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-red-100">
                          <th className="px-4 py-2 text-left text-red-800 font-semibold">
                            فیلد
                          </th>
                          <th className="px-4 py-2 text-left text-red-800 font-semibold">
                            مقدار حذف شده
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(selectedLog.oldData).map(
                          ([key, value], index) => (
                            <tr
                              key={key}
                              className={
                                index % 2 === 0 ? "bg-red-50" : "bg-white"
                              }
                            >
                              <td className="px-4 py-2 font-medium text-red-800 border-b border-red-200">
                                {key}
                              </td>
                              <td className="px-4 py-2 text-red-700 border-b border-red-200">
                                {renderValue(value)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedLog(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
