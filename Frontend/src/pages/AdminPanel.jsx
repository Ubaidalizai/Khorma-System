import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import SupplierManagement from "../components/SupplierManagement";
import UnitManagement from "../components/UnitManagement";
import CustomerManagement from "../components/CustomerManagement";
import EmployeeManagement from "../components/EmployeeManagement";
import {
  BuildingOfficeIcon,
  CogIcon,
  ShieldCheckIcon,
  ScaleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { inputStyle } from "../components/ProductForm";

const AdminPanel = () => {
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState("suppliers");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            دسترسی غیرمجاز
          </h2>
          <p className="text-gray-600">لطفاً ابتدا وارد شوید</p>
        </div>
      </div>
    );
  }

  const adminSections = [
    {
      id: "suppliers",
      name: "مدیریت تامین‌کنندگان",
      icon: BuildingOfficeIcon,
      description: "افزودن، ویرایش و حذف تامین‌کنندگان",
    },
    {
      id: "customers",
      name: "مدیریت مشتریان",
      icon: UserGroupIcon,
      description: "افزودن، ویرایش و حذف مشتریان",
    },
    {
      id: "employees",
      name: "مدیریت کارمندان",
      icon: UserIcon,
      description: "افزودن، ویرایش و حذف کارمندان",
    },
    {
      id: "units",
      name: "مدیریت واحدها",
      icon: ScaleIcon,
      description: "مدیریت واحدهای اندازه‌گیری و تبدیل",
    },
    {
      id: "settings",
      name: "تنظیمات",
      icon: CogIcon,
      description: "تنظیمات سیستم و کاربران",
    },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "suppliers":
        return <SupplierManagement />;
      case "customers":
        return <CustomerManagement />;
      case "employees":
        return <EmployeeManagement />;
      case "units":
        return <UnitManagement />;
      case "settings":
        return <SettingsManagement />;
      default:
        return <SupplierManagement />;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className=" mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-bold text-primary-brown-light">
                پنل مدیریت
              </h1>
              <p
                className="mt-1 text-lg"
                style={{ color: "var(--text-medium)" }}
              >
                مدیریت تامین‌کنندگان، مشتریان، کارمندان، واحدها و تنظیمات سیستم
              </p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <ShieldCheckIcon
                  className="h-6 w-6"
                  style={{ color: "var(--success-green)" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-dark)" }}
                >
                  دسترسی مدیر
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-[var(--text-dark)]">
                بخش‌های مدیریت
              </h3>
              <nav className="space-y-2">
                {adminSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-right p-3 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-amber-100 to-amber-50 border-r-4"
                        : "hover:bg-gray-50"
                    }`}
                    style={{
                      borderRightColor:
                        activeSection === section.id
                          ? "var(--primary-brown)"
                          : "transparent",
                      color:
                        activeSection === section.id
                          ? "var(--primary-brown)"
                          : "var(--text-medium)",
                    }}
                  >
                    <div className="flex items-center">
                      <section.icon className="h-5 w-5 ml-3" />
                      <div>
                        <div className="font-medium">{section.name}</div>
                        <div
                          className="text-xs mt-1"
                          style={{ color: "var(--text-light)" }}
                        >
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderSectionContent()}</div>
        </div>
      </div>
    </div>
  );
};

// Settings Management Component
const SettingsManagement = () => (
  <div className="space-y-6">
    <div className="card">
      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: "var(--primary-brown)" }}
      >
        تنظیمات سیستم
      </h2>
      <p className="text-gray-600 mb-6">
        در این بخش می‌توانید تنظیمات کلی سیستم را مدیریت کنید.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Settings */}
        <div className="card">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-dark)" }}
          >
            تنظیمات کلی
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-dark)" }}
              >
                نام شرکت
              </label>
              <input
                type="text"
                className={inputStyle}
                placeholder="نام شرکت شما"
                defaultValue="سیستم مدیریت تجارت و توزیع"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-dark)" }}
              >
                آدرس شرکت
              </label>
              <textarea
                className={inputStyle}
                rows={3}
                placeholder="آدرس کامل شرکت"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-dark)" }}
              >
                شماره تماس
              </label>
              <input
                type="tel"
                className={inputStyle}
                placeholder="09123456789"
              />
            </div>
          </div>
        </div>

        {/* User Settings */}
        <div className="card">
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text-dark)" }}
          >
            تنظیمات کاربری
          </h3>
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-dark)" }}
              >
                زبان سیستم
              </label>
              <select className={inputStyle}>
                <option value="fa">فارسی</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-dark)" }}
              >
                منطقه زمانی
              </label>
              <select className={inputStyle}>
                <option value="Asia/Tehran">تهران (GMT+3:30)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-dark)" }}
              >
                فرمت تاریخ
              </label>
              <select className={inputStyle}>
                <option value="jalali">جلالی (1403/01/01)</option>
                <option value="gregorian">میلادی (2024/01/01)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-x-2 space-x-reverse mt-6">
        <button className="btn-secondary">بازنشانی</button>
        <button className="btn-primary">ذخیره تنظیمات</button>
      </div>
    </div>

    {/* Security Settings */}
    <div className="card">
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--text-dark)" }}
      >
        تنظیمات امنیتی
      </h3>
      <div className="space-y-4">
        <div
          className="flex items-center justify-between p-4 rounded-lg"
          style={{ backgroundColor: "var(--beige-light)" }}
        >
          <div>
            <h4 className="font-medium" style={{ color: "var(--text-dark)" }}>
              تغییر رمز عبور
            </h4>
            <p className="text-sm" style={{ color: "var(--text-medium)" }}>
              رمز عبور خود را به‌روزرسانی کنید
            </p>
          </div>
          <button className="btn-secondary">تغییر رمز</button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminPanel;
