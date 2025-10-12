import { useState } from "react";
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Header = ({ onMenuClick }) => {
  const [notifications] = useState([
    { id: 1, message: "Low stock alert: Dates", type: "warning" },
    { id: 2, message: "New purchase order received", type: "info" },
    { id: 3, message: "Daily sales report ready", type: "success" },
  ]);

  return (
    <header
      className='shadow-sm border-b w-full'
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "0 2px 4px var(--shadow)",
      }}
    >
      <div className='flex items-center justify-between px-4 py-4 sm:px-6'>
        {/* Left side */}
        <div className='flex items-center'>
          <button
            onClick={onMenuClick}
            className='lg:hidden p-2 rounded-md transition-colors duration-200'
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
            <Bars3Icon className='h-6 w-6' />
          </button>

          <div className='hidden lg:block'>
            <h1
              className='font-bold'
              style={{
                fontSize: "var(--h2-size)",
                color: "var(--primary-brown)",
                marginBottom: "var(--space-1)",
              }}
            >
              سیستم مدیریت تجارت و توزیع
            </h1>
            <p className='text-sm' style={{ color: "var(--text-medium)" }}>
              مدیریت کارآمد کسب‌وکار شما
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className='flex items-center' style={{ gap: "var(--space-4)" }}>
          {/* Notifications */}
          <div className='relative'>
            <button
              className='p-2 rounded-full transition-colors duration-200'
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
              <BellIcon className='h-6 w-6' />
              {notifications.length > 0 && (
                <span
                  className='absolute -top-1 -right-1 h-4 w-4 text-white text-xs rounded-full flex items-center justify-center'
                  style={{ backgroundColor: "var(--error-red)" }}
                >
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* User menu */}
          <div className='flex items-center' style={{ gap: "var(--space-3)" }}>
            <div className='text-right hidden sm:block'>
              <p
                className='font-medium'
                style={{
                  fontSize: "var(--body-small)",
                  color: "var(--text-dark)",
                }}
              >
                کاربر مدیر
              </p>
              <p className='text-xs' style={{ color: "var(--text-medium)" }}>
                مدیر سیستم
              </p>
            </div>
            <button
              className='p-2 rounded-full transition-colors duration-200'
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
              <UserCircleIcon className='h-8 w-8' />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
