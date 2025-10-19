import { useState, useEffect, useRef } from "react";
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = ({ onMenuClick }) => {
  const [notifications] = useState([
    { id: 1, message: "Low stock alert: Dates", type: "warning" },
    { id: 2, message: "New purchase order received", type: "info" },
    { id: 3, message: "Daily sales report ready", type: "success" },
  ]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('خروج موفقیت‌آمیز بود');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('خطا در خروج از سیستم');
    }
  };

  return (
    <header
      className="shadow-sm border-b sticky top-0 w-full"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "0 2px 4px var(--shadow)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md transition-colors duration-200"
            style={{
              color: "var(--text-medium)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "var(--text-dark)";
              e.target.style.backgroundColor = "var(--beige-light)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "var(--text-medium)";
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="hidden lg:block">
            <h1
              className="font-bold"
              style={{
                fontSize: "var(--h2-size)",
                color: "var(--primary-brown)",
                marginBottom: "var(--space-1)",
              }}
            >
              سیستم مدیریت تجارت و توزیع
            </h1>
            <p className="text-sm" style={{ color: "var(--text-medium)" }}>
              مدیریت کارآمد کسب‌وکار شما
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center" style={{ gap: "var(--space-4)" }}>
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-full transition-colors duration-200"
              style={{
                color: "var(--text-medium)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "var(--text-dark)";
                e.target.style.backgroundColor = "var(--beige-light)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "var(--text-medium)";
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <BellIcon className="h-6 w-6" />
              {notifications.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 h-4 w-4 text-white text-xs rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--error-red)" }}
                >
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
              <div className="text-right hidden sm:block">
                <p
                  className="font-medium"
                  style={{
                    fontSize: "var(--body-small)",
                    color: "var(--text-dark)",
                  }}
                >
                  {user?.name || user?.email || 'کاربر مدیر'}
                </p>
                <p className="text-xs" style={{ color: "var(--text-medium)" }}>
                  {user?.role === 'admin' ? 'مدیر سیستم' : 'کاربر'}
                </p>
              </div>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-full transition-colors duration-200"
                style={{
                  color: "var(--text-medium)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "var(--text-dark)";
                  e.target.style.backgroundColor = "var(--beige-light)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "var(--text-medium)";
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <UserCircleIcon className="h-8 w-8" />
              </button>
            </div>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}>
                <div className="py-1">
                  <div className="px-4 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                    <p className="text-sm font-medium" style={{ color: "var(--text-dark)" }}>
                      {user?.name || user?.email || 'کاربر'}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-medium)" }}>
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm transition-colors duration-200"
                    style={{
                      color: "var(--text-dark)",
                      backgroundColor: "transparent"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "var(--beige-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 ml-2" />
                    خروج از سیستم
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
