import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  XMarkIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "داشبورد", href: "/", icon: HomeIcon },
    { name: "موجودی", href: "/inventory", icon: CubeIcon },
    { name: "خریدها", href: "/purchases", icon: ShoppingCartIcon },
    { name: "فروش‌ها", href: "/sales", icon: CurrencyDollarIcon },
    { name: "حساب‌ها", href: "/accounts", icon: UsersIcon },
    { name: "گزارش‌ها", href: "/reports", icon: ChartBarIcon },
    { name: "پنل مدیریت", href: "/admin", icon: ShieldCheckIcon },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
         sticky top-0 right-0 z-50 h-screen w-64
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0 lg:static lg:h-screen
        flex-shrink-0
      `}
        style={{
          background: `linear-gradient(135deg, var(--primary-brown), var(--primary-brown-dark))`,
          boxShadow: "-4px 0 8px var(--shadow)",
        }}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h2
            className="font-bold text-white"
            style={{ fontSize: "var(--h4-size)" }}
          >
            سیستم مدیریت
          </h2>
          <button
            onClick={onClose}
            className="text-white transition-colors duration-200"
            onMouseEnter={(e) => (e.target.style.color = "var(--amber-light)")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo */}
        <div
          className="hidden lg:flex items-center justify-center"
          style={{ padding: "var(--space-4) var(--space-6)" }}
        >
          <div className="text-center">
            <h1
              className="font-bold text-white"
              style={{ fontSize: "var(--h3-size)" }}
            >
              سیستم مدیریت
            </h1>
            <p
              className="text-sm"
              style={{
                color: "var(--amber-light)",
                marginTop: "var(--space-1)",
              }}
            >
              تجارت و توزیع
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4" style={{ marginTop: "var(--space-2)" }}>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
            }}
          >
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center text-sm font-medium rounded-lg transition-all duration-200"
                    style={{
                      padding: "var(--space-2) var(--space-4)",
                      backgroundColor: isActive
                        ? "var(--primary-brown-light)"
                        : "transparent",
                      color: isActive ? "white" : "var(--amber-light)",
                      borderRight: isActive
                        ? `4px solid var(--amber)`
                        : "4px solid transparent",
                      textAlign: "right",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor =
                          "var(--primary-brown-light)";
                        e.target.style.color = "white";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "var(--amber-light)";
                      }
                    }}
                  >
                    <item.icon className="ml-3 h-5 w-5" />
                    <span className="mr-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div
          className="absolute bottom-0 w-full"
          style={{ padding: "var(--space-3) var(--space-4)" }}
        >
          <div
            className="text-center text-xs"
            style={{ color: "var(--amber-light)" }}
          >
            <p>© 2024 سیستم مدیریت</p>
            <p>نسخه 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
