import { useState, useEffect } from "react";
import {
  CubeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    lowStockItems: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    setStats({
      totalProducts: 156,
      totalSales: 125000,
      totalPurchases: 89000,
      lowStockItems: 12,
    });

    setRecentTransactions([
      {
        id: 1,
        type: "Sale",
        product: "Fresh Dates",
        quantity: 50,
        amount: 2500,
        time: "2 hours ago",
      },
      {
        id: 2,
        type: "Purchase",
        product: "Chickpeas",
        quantity: 100,
        amount: 1200,
        time: "4 hours ago",
      },
      {
        id: 3,
        type: "Sale",
        product: "Cake Mix",
        quantity: 25,
        amount: 750,
        time: "6 hours ago",
      },
      {
        id: 4,
        type: "Purchase",
        product: "Sugar",
        quantity: 200,
        amount: 800,
        time: "1 day ago",
      },
    ]);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div
      className='card hover-lift'
      style={{
        background:
          "linear-gradient(135deg, var(--beige-light), var(--surface))",
        borderLeft: "4px solid var(--primary-brown)",
        padding: "var(--space-6)",
      }}
    >
      <div className='flex items-center justify-between'>
        <div style={{ textAlign: "right" }}>
          <p
            className='font-medium'
            style={{
              fontSize: "var(--body-small)",
              color: "var(--text-medium)",
              marginBottom: "var(--space-2)",
            }}
          >
            {title}
          </p>
          <p
            className='font-bold'
            style={{
              fontSize: "var(--h1-size)",
              color: "var(--text-dark)",
            }}
          >
            {value}
          </p>
          {change && (
            <p
              className='text-sm'
              style={{
                marginTop: "var(--space-1)",
                color: change > 0 ? "var(--success-green)" : "var(--error-red)",
              }}
            >
              {change > 0 ? "+" : ""}
              {change}% از ماه گذشته
            </p>
          )}
        </div>
        <div className='p-3 rounded-full' style={{ backgroundColor: color }}>
          <Icon className='h-8 w-8 text-white' />
        </div>
      </div>
    </div>
  );

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
          value={stats.totalProducts}
          icon={CubeIcon}
          color='var(--info-blue)'
          change={5.2}
        />
        <StatCard
          title='کل فروش‌ها'
          value={`${stats.totalSales.toLocaleString()} تومان`}
          icon={CurrencyDollarIcon}
          color='var(--success-green)'
          change={12.5}
        />
        <StatCard
          title='کل خریدها'
          value={`${stats.totalPurchases.toLocaleString()} تومان`}
          icon={ShoppingCartIcon}
          color='var(--amber)'
          change={-2.1}
        />
        <StatCard
          title='موجودی کم'
          value={stats.lowStockItems}
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
          <table className='data-table'>
            <thead>
              <tr>
                <th>نوع</th>
                <th>محصول</th>
                <th>تعداد</th>
                <th>مبلغ</th>
                <th>زمان</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <span
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                      style={{
                        backgroundColor:
                          transaction.type === "Sale"
                            ? "var(--success-light)"
                            : "var(--info-light)",
                        color:
                          transaction.type === "Sale"
                            ? "var(--success-green)"
                            : "var(--info-blue)",
                      }}
                    >
                      {transaction.type === "Sale" ? (
                        <CheckCircleIcon className='w-3 h-3 ml-1' />
                      ) : (
                        <ShoppingCartIcon className='w-3 h-3 ml-1' />
                      )}
                      {transaction.type === "Sale" ? "فروش" : "خرید"}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-dark)" }}>
                    {transaction.product}
                  </td>
                  <td style={{ color: "var(--text-dark)" }}>
                    {transaction.quantity}
                  </td>
                  <td style={{ color: "var(--text-dark)" }}>
                    {transaction.amount.toLocaleString()} تومان
                  </td>
                  <td style={{ color: "var(--text-medium)" }}>
                    {transaction.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
