import {
  ArchiveBoxIcon,
  ArrowUturnLeftIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ReceiptRefundIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { TrendingDown, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import {
  useInventoryStats,
  useProduct,
  usePurchases,
  useRecentTransactions,
  useReverseTransaction,
  useSales,
} from "../services/useApi";
import TableHeader from "./../components/TableHeader";
import { formatCurrency } from "./../utilies/helper";
import TableRow from "../components/TableRow";
import TableColumn from "../components/TableColumn";
import TableBody from "../components/TableBody";

const Dashboard = () => {
  const headers = [
    { title: "حساب" },
    { title: "نوع انتقال" },
    { title: "انتقال دهنده" },
    { title: "تاریخ" },
    { title: "مبلغ" },
    { title: "عملیات" },
  ];

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
  const { data: recentTransactions, isLoading: statsLoading } =
    useRecentTransactions({ page: currentPage, limit });
  // const { data: lowStockItems, isLoading: lowStockLoading } =
  //   useLowStockItems();
  const { data: lowStock, isLoading: lowStockLoading } = useInventoryStats();
  const { mutate: reverseTransaction, isLoading: reverseLoading } =
    useReverseTransaction();
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
    console.log("Dashboard useEffect triggered");
    console.log("Products data:", products);
    console.log("Sales data:", sales);
    console.log("Purchases data:", purchases);
    console.log("LowStock data:", lowStock);

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

    console.log("Calculated totalSalesAmount:", totalSalesAmount);
    console.log("Calculated totalPurchasesAmount:", totalPurchasesAmount);
    console.log("Calculated totalStockQuantity:", totalStockQuantity);
    console.log("Calculated totalReceivables:", totalReceivables);
    console.log("Calculated totalPayables:", totalPayables);
    console.log("Calculated netProfit:", netProfit);

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

    console.log("Setting stats:", newStats);
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

      {/* Recent transactions */}
      <div className="card">
        <div
          className="px-6 py-4 border-b"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--beige-light)",
          }}
        >
          <h2
            className="font-semibold"
            style={{
              fontSize: "var(--h4-size)",
              color: "var(--text-dark)",
            }}
          >
            تراکنش‌های اخیر
          </h2>
        </div>
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
                        {getTransactionTypePersian(transaction.transactionType)}
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
          {/* Pagination */}
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

      {/* Quick actions */}
      {/* <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{ gap: "var(--space-6)" }}
      >
        <div
          className="rounded-lg p-6 text-white hover-lift"
          style={{
            background:
              "linear-gradient(135deg, var(--info-blue), var(--info-blue))",
            textAlign: "right",
          }}
        >
          <h3
            className="font-semibold mb-2"
            style={{
              fontSize: "var(--h5-size)",
              marginBottom: "var(--space-2)",
            }}
          >
            فروش سریع
          </h3>
          <p
            className="mb-4"
            style={{
              opacity: 0.9,
              marginBottom: "var(--space-4)",
            }}
          >
            ثبت فروش جدید به سرعت
          </p>
          <button
            className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--info-blue)",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "var(--info-light)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "var(--surface)")
            }
          >
            شروع فروش
          </button>
        </div>

        <div
          className="rounded-lg p-6 text-white hover-lift"
          style={{
            background:
              "linear-gradient(135deg, var(--success-green), var(--success-green))",
            textAlign: "right",
          }}
        >
          <h3
            className="font-semibold mb-2"
            style={{
              fontSize: "var(--h5-size)",
              marginBottom: "var(--space-2)",
            }}
          >
            افزودن خرید
          </h3>
          <p
            className="mb-4"
            style={{
              opacity: 0.9,
              marginBottom: "var(--space-4)",
            }}
          >
            ثبت خرید جدید موجودی
          </p>
          <button
            className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--success-green)",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "var(--success-light)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "var(--surface)")
            }
          >
            افزودن خرید
          </button>
        </div>

        <div
          className="rounded-lg p-6 text-white hover-lift"
          style={{
            background:
              "linear-gradient(135deg, var(--amber), var(--amber-dark))",
            textAlign: "right",
          }}
        >
          <h3
            className="font-semibold mb-2"
            style={{
              fontSize: "var(--h5-size)",
              marginBottom: "var(--space-2)",
            }}
          >
            مشاهده گزارش‌ها
          </h3>
          <p
            className="mb-4"
            style={{
              opacity: 0.9,
              marginBottom: "var(--space-4)",
            }}
          >
            بررسی تحلیل‌های کسب‌وکار
          </p>
          <button
            className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--amber-dark)",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "var(--amber-light)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "var(--surface)")
            }
          >
            مشاهده گزارش‌ها
          </button>
        </div>
      </div> */}

      {/* Modal for reverse confirmation */}
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
    </div>
  );
};

export default Dashboard;
