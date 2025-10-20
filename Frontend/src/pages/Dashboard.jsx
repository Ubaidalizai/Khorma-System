import React, { useState, useEffect } from "react";
import {
  CubeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Table from "../components/Table";
import TableHeader from "./../components/TableHeader";
import TableBody from "./../components/TableBody";
import TableRow from "./../components/TableRow";
import TableColumn from "./../components/TableColumn";
import { TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "./../utilies/helper";
import {
  useProduct,
  useSales,
  usePurchases,
  useDashboardStats,
  useRecentTransactions,
  useLowStockItems,
} from "../services/useApi";

const Dashboard = () => {
  const headers = [
    { title: "نوع" },
    { title: "محصول" },
    { title: "تعداد" },
    { title: "مبلغ" },
    { title: "زمان" },
  ];

  // API hooks
  const { data: products, isLoading: productsLoading } = useProduct();
  const { data: sales, isLoading: salesLoading } = useSales();
  const { data: purchases, isLoading: purchasesLoading } = usePurchases();
  // const { data: inventory, isLoading: inventoryLoading } = useInventory();
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentTransactions, isLoading: transactionsLoading } =
    useRecentTransactions(5);
  const { data: lowStockItems, isLoading: lowStockLoading } =
    useLowStockItems();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    lowStockItems: 0,
  });

  // Use dashboard stats from API or calculate from individual endpoints
  useEffect(() => {
    if (dashboardStats) {
      setStats({
        totalProducts: dashboardStats.totalProducts || 0,
        totalSales: dashboardStats.totalSales || 0,
        totalPurchases: dashboardStats.totalPurchases || 0,
        lowStockItems: dashboardStats.lowStockItems || 0,
      });
    } else if (products && sales && purchases) {
      // Fallback calculation if dashboard stats not available
      // Ensure sales is an array before calling reduce
      const salesArray = Array.isArray(sales) ? sales : [];
      const purchasesArray = Array.isArray(purchases) ? purchases : [];

      const totalSalesAmount =
        salesArray.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0) || 0;
      const totalPurchasesAmount =
        purchasesArray.reduce(
          (sum, purchase) => sum + (purchase.totalAmount || 0),
          0
        ) || 0;

      setStats({
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalSales: totalSalesAmount,
        totalPurchases: totalPurchasesAmount,
        lowStockItems: Array.isArray(lowStockItems) ? lowStockItems.length : 0,
      });
    }
  }, [dashboardStats, products, sales, purchases, lowStockItems]);

  // Format recent transactions from API data
  const formatRecentTransactions = () => {
    if (!recentTransactions) return [];

    return recentTransactions.map((transaction) => ({
      id: transaction._id,
      type: transaction.type || (transaction.saleId ? "Sale" : "Purchase"),
      product:
        transaction.productName || transaction.product || "Unknown Product",
      quantity: transaction.quantity || 0,
      amount: transaction.amount || transaction.totalAmount || 0,
      time: formatTimeAgo(transaction.createdAt || transaction.date),
    }));
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Unknown time";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const StatCard = ({ title, value, icon, color = "#6366F1", change }) => {
    const isPositive = change > 0;
    return (
      <div className='bg-white hover:translate-y-1.5 transition-all duration-200  cursor-pointer  rounded-lg shadow-sm border border-gray-200 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-gray-600'>{title} </p>
            <div className='text-2xl font-bold text-gray-900 mt-1'>
              {change ? (
                <div
                  className={`mt-2 text-center  w-full  flex items-center gap-1 text-sm font-medium ${
                    isPositive
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  <div className=' flex items-center justify-start'>
                    {isPositive ? (
                      <span className=' p-3'>
                        <TrendingUp size={24} />
                      </span>
                    ) : (
                      <span className=' p-3 '>
                        <TrendingDown size={24} />
                      </span>
                    )}
                    <span className=''>
                      {isPositive ? "+" : "-"}%
                      {change > 0 ? change : change * -1}
                    </span>
                  </div>
                </div>
              ) : (
                value
              )}
            </div>
          </div>

          <div
            className='p-3 rounded-lg border border-slate-200'
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
      dir='rtl'
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Page header */}
      <div>
        <h1
          className='font-bold'
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
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        style={{ gap: "var(--space-6)" }}
      >
        <StatCard
          title='کل محصولات'
          value={statsLoading || productsLoading ? "..." : stats.totalProducts}
          icon={CubeIcon}
          color='var(--info-blue)'
          change={5.2}
        />
        <StatCard
          title='کل فروش‌ها'
          value={
            statsLoading || salesLoading
              ? "..."
              : formatCurrency(stats.totalSales)
          }
          icon={CurrencyDollarIcon}
          color='var(--success-green)'
          change={12.5}
        />
        <StatCard
          title='کل خریدها'
          value={
            statsLoading || purchasesLoading
              ? "..."
              : formatCurrency(stats.totalPurchases)
          }
          icon={ShoppingCartIcon}
          color='var(--amber)'
          change={-2.1}
        />
        <StatCard
          title='موجودی کم'
          value={statsLoading || lowStockLoading ? "..." : stats.lowStockItems}
          icon={ExclamationTriangleIcon}
          color='var(--error-red)'
        />
      </div>

      {/* Recent transactions */}
      <div className='card'>
        <div
          className='px-6 py-4 border-b'
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--beige-light)",
          }}
        >
          <h2
            className='font-semibold'
            style={{
              fontSize: "var(--h4-size)",
              color: "var(--text-dark)",
            }}
          >
            تراکنش‌های اخیر
          </h2>
        </div>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader headerData={headers} />
            <TableBody>
              {transactionsLoading ? (
                <TableRow>
                  <TableColumn colSpan={5} className='text-center py-4'>
                    Loading transactions...
                  </TableColumn>
                </TableRow>
              ) : formatRecentTransactions().length > 0 ? (
                formatRecentTransactions().map((tra) => (
                  <TableRow key={tra.id}>
                    <TableColumn
                      className={`${
                        tra.type === "Purchase"
                          ? " text-orange-300"
                          : "text-green-400"
                      }`}
                    >
                      {tra.type}
                    </TableColumn>
                    <TableColumn>{tra.product}</TableColumn>
                    <TableColumn>{tra.quantity}</TableColumn>
                    <TableColumn>{formatCurrency(tra.amount)}</TableColumn>
                    <TableColumn>{tra.time}</TableColumn>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableColumn
                    colSpan={5}
                    className='text-center py-4 text-gray-500'
                  >
                    No recent transactions found
                  </TableColumn>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Quick actions */}
      <div
        className='grid grid-cols-1 md:grid-cols-3'
        style={{ gap: "var(--space-6)" }}
      >
        <div
          className='rounded-lg p-6 text-white hover-lift'
          style={{
            background:
              "linear-gradient(135deg, var(--info-blue), var(--info-blue))",
            textAlign: "right",
          }}
        >
          <h3
            className='font-semibold mb-2'
            style={{
              fontSize: "var(--h5-size)",
              marginBottom: "var(--space-2)",
            }}
          >
            فروش سریع
          </h3>
          <p
            className='mb-4'
            style={{
              opacity: 0.9,
              marginBottom: "var(--space-4)",
            }}
          >
            ثبت فروش جدید به سرعت
          </p>
          <button
            className='px-4 py-2 rounded-lg font-medium transition-colors duration-200'
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
          className='rounded-lg p-6 text-white hover-lift'
          style={{
            background:
              "linear-gradient(135deg, var(--success-green), var(--success-green))",
            textAlign: "right",
          }}
        >
          <h3
            className='font-semibold mb-2'
            style={{
              fontSize: "var(--h5-size)",
              marginBottom: "var(--space-2)",
            }}
          >
            افزودن خرید
          </h3>
          <p
            className='mb-4'
            style={{
              opacity: 0.9,
              marginBottom: "var(--space-4)",
            }}
          >
            ثبت خرید جدید موجودی
          </p>
          <button
            className='px-4 py-2 rounded-lg font-medium transition-colors duration-200'
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
          className='rounded-lg p-6 text-white hover-lift'
          style={{
            background:
              "linear-gradient(135deg, var(--amber), var(--amber-dark))",
            textAlign: "right",
          }}
        >
          <h3
            className='font-semibold mb-2'
            style={{
              fontSize: "var(--h5-size)",
              marginBottom: "var(--space-2)",
            }}
          >
            مشاهده گزارش‌ها
          </h3>
          <p
            className='mb-4'
            style={{
              opacity: 0.9,
              marginBottom: "var(--space-4)",
            }}
          >
            بررسی تحلیل‌های کسب‌وکار
          </p>
          <button
            className='px-4 py-2 rounded-lg font-medium transition-colors duration-200'
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
      </div>
    </div>
  );
};

export default Dashboard;
