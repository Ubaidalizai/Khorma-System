import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  UsersIcon,
  ChartBarIcon,
  XMarkIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [isFinanceOpen, setIsFinanceOpen] = React.useState(false);

  // Flat items and grouped sections
  const navigation = [
    { type: "item", name: "داشبورد", href: "/", icon: HomeIcon },
    { type: "item", name: "موجودی", href: "/inventory", icon: CubeIcon },
    { type: "item", name: "خریدها", href: "/purchases", icon: ShoppingCartIcon },
    { type: "item", name: "فروش‌ها", href: "/sales", icon: CurrencyDollarIcon },
    { type: "group", name: "مالی", icon: CurrencyDollarIcon, items: [
      { name: "حساب‌ها", href: "/accounts", icon: UsersIcon },
      { name: "هزینه‌ها", href: "/expenses", icon: BanknotesIcon },
    ]},
    { type: "item", name: "گزارش‌ها", href: "/reports", icon: ChartBarIcon },
    { type: "item", name: "پنل مدیریت", href: "/admin", icon: ShieldCheckIcon },
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
            {navigation.map((entry) => {
              if (entry.type === "item") {
                const isActive = location.pathname === entry.href;
                return (
                  <li key={entry.name}>
                    <Link
                      to={entry.href}
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
                      <entry.icon className="ml-3 h-5 w-5" />
                      <span className="mr-3">{entry.name}</span>
                    </Link>
                  </li>
                );
              }

              // group (collapsible/select-like)
              const groupActive = entry.items.some((it) => location.pathname === it.href);
              // auto-open when route is inside the group
              if (groupActive && !isFinanceOpen) setIsFinanceOpen(true);
              const isOpen = isFinanceOpen;
              return (
                <li key={entry.name}>
                  <button
                    type="button"
                    onClick={() => setIsFinanceOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-sm font-medium rounded-lg transition-all duration-200"
                    style={{
                      padding: "var(--space-2) var(--space-4)",
                      backgroundColor: groupActive ? "var(--primary-brown-light)" : "transparent",
                      color: groupActive ? "white" : "var(--amber-light)",
                      borderRight: groupActive ? `4px solid var(--amber)` : "4px solid transparent",
                      textAlign: "right",
                    }}
                    onMouseEnter={(e) => {
                      if (!groupActive) {
                        e.currentTarget.style.backgroundColor = "var(--primary-brown-light)";
                        e.currentTarget.style.color = "white";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!groupActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--amber-light)";
                      }
                    }}
                  >
                    <span className="flex items-center">
                      <entry.icon className="ml-3 h-5 w-5" />
                      <span className="mr-3">{entry.name}</span>
                    </span>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <ul style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                      {entry.items.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              onClick={onClose}
                              className="flex items-center text-sm font-medium rounded-lg transition-all duration-200"
                              style={{
                                padding: "var(--space-2) var(--space-4)",
                                marginRight: "var(--space-4)",
                                backgroundColor: isActive ? "var(--primary-brown-light)" : "transparent",
                                color: isActive ? "white" : "var(--amber-light)",
                                borderRight: isActive ? `4px solid var(--amber)` : "4px solid transparent",
                                textAlign: "right",
                              }}
                              onMouseEnter={(e) => {
                                if (!isActive) {
                                  e.currentTarget.style.backgroundColor = "var(--primary-brown-light)";
                                  e.currentTarget.style.color = "white";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isActive) {
                                  e.currentTarget.style.backgroundColor = "transparent";
                                  e.currentTarget.style.color = "var(--amber-light)";
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
                  )}
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
