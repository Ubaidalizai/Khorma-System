import { CgCloseO } from "react-icons/cg";
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
  TagIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { inputStyle } from "../components/ProductForm";
import GloableModal from "../components/GloableModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, API_ENDPOINTS } from "../services/apiConfig";
import { toast } from "react-toastify";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import {
  useProfile,
  useUpdatePassword,
  useUpdateProfile,
} from "../services/useApi";
import { useForm } from "react-hook-form";
import Button from "../components/Button";

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
      id: "profile",
      name: "پروفایل کاربری",
      icon: IdentificationIcon,
      description: "مشاهده و مدیریت اطلاعات پروفایل",
    },
    {
      id: "suppliers",
      name: "مدیریت تامین‌کنندگان",
      icon: BuildingOfficeIcon,
      description: "افزودن، ویرایش و حذف تامین‌کنندگان",
    },
    {
      id: "categories",
      name: "مدیریت دسته‌بندی‌ها",
      icon: TagIcon,
      description: "CRUD دسته‌بندی‌ها برای هزینه/درآمد/محصول",
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
      case "profile":
        return <ProfileManagement />;
      case "suppliers":
        return <SupplierManagement />;
      case "categories":
        return <CategoryManagement />;
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
                      <section.icon className="h-3 w-3 ml-3" />
                      <div>
                        <div className="text-xs font-normal">
                          {section.name}
                        </div>
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
const SettingsManagement = () => {
  return (
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
          <button
            className={` bg-transparent border border-slate-600 cursor-pointer group  text-slate-600   duration-200   flex gap-2 justify-center items-center  px-4 py-2 rounded-sm font-medium text-sm  transition-all ease-in `}
          >
            بازنشانی
          </button>
          <button
            className={`bg-amber-600 cursor-pointer group  text-white hover:bg-amber-600/90  duration-200   flex gap-2 justify-center items-center  px-4 py-2 rounded-sm font-medium text-sm  transition-all ease-in `}
          >
            ذخیره تنظیمات
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

// Category Management Component
const CategoryManagement = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // expense | income | product | both
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    type: "expense",
    color: "#95684c",
    isActive: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["categories", { search, typeFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (typeFilter) params.set("type", typeFilter);
      params.set("limit", "100");
      return apiRequest(
        `${API_ENDPOINTS.CATEGORIES.LIST}?${params.toString()}`
      );
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload) =>
      apiRequest(API_ENDPOINTS.CATEGORIES.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("دسته‌بندی ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsModalOpen(false);
    },
    onError: (e) => toast.error(e.message || "ایجاد ناموفق بود"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) =>
      apiRequest(API_ENDPOINTS.CATEGORIES.UPDATE(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("دسته‌بندی ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsModalOpen(false);
      setEditing(null);
    },
    onError: (e) => toast.error(e.message || "ویرایش ناموفق بود"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      apiRequest(API_ENDPOINTS.CATEGORIES.DELETE(id), { method: "DELETE" }),
    onSuccess: () => {
      toast.success("حذف شد");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e) => toast.error(e.message || "حذف ناموفق بود"),
  });

  const categories = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--primary-brown)" }}
          >
            مدیریت دسته‌بندی‌ها
          </h2>
          <p className="text-gray-600 mt-1">
            افزودن، ویرایش و حذف دسته‌بندی‌ها
          </p>
        </div>
        <button
          className={`bg-amber-600 cursor-pointer group  text-white hover:bg-amber-600/90  duration-200   flex gap-2 justify-center items-center  px-4 py-2 rounded-sm font-medium text-sm  transition-all ease-in duration-200`}
          onClick={() => {
            setEditing(null);
            setForm({
              name: "",
              type: "expense",
              color: "#95684c",
              isActive: true,
            });
            setIsModalOpen(true);
          }}
        >
          <PlusIcon className="h-5 w-5" />
          <span>افزودن دسته‌بندی</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در دسته‌بندی‌ها..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputStyle} pr-10`}
            />
          </div>
          <div className="w-full sm:w-56">
            <select
              className={inputStyle}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">همه انواع</option>
              <option value="expense">هزینه</option>
              <option value="income">درآمد</option>
              <option value="product">محصول</option>
              <option value="both">هزینه و درآمد</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نوع
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رنگ
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  فعال
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اقدامات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    در حال بارگذاری...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    موردی یافت نشد
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3 whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className="inline-block w-4 h-4 rounded align-middle"
                        style={{ backgroundColor: c.color || "#ccc" }}
                      />
                      <span className="mr-2 align-middle">
                        {c.color || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {c.isActive ? "بله" : "خیر"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditing(c);
                            setForm({
                              name: c.name || "",
                              type: c.type || "expense",
                              color: c.color || "#95684c",
                              isActive: c.isActive ?? true,
                            });
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="ویرایش"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("حذف شود؟"))
                              deleteMutation.mutate(c._id);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
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
      </div>

      {/* Add/Edit Modal */}
      <GloableModal open={isModalOpen} setOpen={setIsModalOpen} isClose={true}>
        <div className=" w-[480px] max-h-[80vh] bg-white overflow-y-auto rounded-md">
          <div className=" mx-auto p-5 w-full rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editing ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}
              </h3>
              <span className="text-sm" style={{ color: "var(--text-medium)" }}>
                دسته‌بندی‌ها
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label
                  className="block mb-2"
                  style={{ color: "var(--text-medium)" }}
                >
                  نام
                </label>
                <input
                  className={inputStyle}
                  name="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{ color: "var(--text-medium)" }}
                >
                  نوع
                </label>
                <select
                  className={inputStyle}
                  name="type"
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                >
                  <option value="expense">هزینه</option>
                  <option value="income">درآمد</option>
                  <option value="product">محصول</option>
                  <option value="both">هزینه و درآمد</option>
                </select>
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{ color: "var(--text-medium)" }}
                >
                  رنگ
                </label>
                <input
                  className={inputStyle}
                  type="color"
                  name="color"
                  value={form.color}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, color: e.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                />
                <label
                  htmlFor="isActive"
                  style={{ color: "var(--text-medium)" }}
                >
                  فعال
                </label>
              </div>
            </div>
            <div className="flex items-center justify-start gap-2 mt-6">
              <button
                className={` cursor-pointer bg-transparent border border-slate-500 group  text-slate-600   duration-200   flex gap-2 justify-center items-center  px-4 py-2 rounded-sm font-medium text-sm  transition-all ease-in `}
                onClick={() => {
                  setIsModalOpen(false);
                  setEditing(null);
                }}
              >
                لغو
              </button>
              <button
                className={`bg-amber-600 cursor-pointer group  text-white hover:bg-amber-600/90  duration-200   flex gap-2 justify-center items-center  px-4 py-2 rounded-sm font-medium text-sm  transition-all ease-in duration-200`}
                disabled={!form.name || !form.type}
                onClick={() =>
                  editing
                    ? updateMutation.mutate({ id: editing._id, payload: form })
                    : createMutation.mutate(form)
                }
              >
                {editing ? "ذخیره تغییرات" : "ثبت"}
              </button>
            </div>
          </div>
        </div>
      </GloableModal>
    </div>
  );
};

// Profile Management Component
const ProfileManagement = () => {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [changeSetting, setChangeSetting] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const fileInputRef = React.useRef(null);
  const Navigate = useNavigate();
  const { mutate: updatePassword } = useUpdatePassword();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    register: emailReigster,
    handleSubmit: emailtHandleSubmit,
    formState: { errors: editError },
  } = useForm();
  const { data: profile, isLoading } = useProfile();

  const updateEmailMutation = useUpdateProfile();

  const handlePassword = (data) => {
    updatePassword(data, {
      onSuccess: () => Navigate("/login"),
    });
  };

  const handleEmail = (data) => {
    updateEmailMutation.mutate(data);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">در حال بارگذاری...</div>
      </div>
    );
  }

  const displayData = profile || user;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div
            className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold cursor-pointer"
            onClick={handleImageClick}
            title="برای تغییر تصویر کلیک کنید"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : displayData?.name ? (
              displayData.name.charAt(0).toUpperCase()
            ) : (
              "U"
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--primary-brown)" }}
            >
              پروفایل کاربری
            </h2>
            <p className="text-gray-600 mt-1">مشاهده اطلاعات پروفایل خود</p>
            <div className="flex items-center mt-2">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: "var(--beige-light)",
                  color: "var(--primary-brown)",
                }}
              >
                {displayData?.role || "کاربر"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="card">
        <h3
          className="text-xl font-semibold mb-6"
          style={{ color: "var(--text-dark)" }}
        >
          اطلاعات شخصی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-dark)" }}
            >
              نام کامل
            </label>
            <p className="text-gray-600">{displayData?.name || "نامشخص"}</p>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-dark)" }}
            >
              ایمیل
            </label>
            <p className="text-gray-600">{displayData?.email || "نامشخص"}</p>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-dark)" }}
            >
              شماره تلفن
            </label>
            <p className="text-gray-600">{displayData?.phone || "نامشخص"}</p>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-dark)" }}
            >
              نقش
            </label>
            <p className="text-gray-600">{displayData?.role || "کاربر"}</p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="card">
        <h3
          className="text-xl font-semibold mb-6"
          style={{ color: "var(--text-dark)" }}
        >
          اطلاعات حساب
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-dark)" }}
            >
              تاریخ عضویت
            </label>
            <p className="text-gray-600">
              {displayData?.createdAt
                ? new Date(displayData.createdAt).toLocaleDateString("fa-IR")
                : "نامشخص"}
            </p>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-dark)" }}
            >
              وضعیت حساب
            </label>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: "var(--success-green)",
                color: "white",
              }}
            >
              فعال
            </span>
          </div>
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
            <button
              onClick={() => setChangeSetting(true)}
              className="btn-secondary"
            >
              تغییر رمز
            </button>
          </div>
          {changeSetting && (
            <form
              noValidate
              onSubmit={handleSubmit(handlePassword)}
              className=" space-y-3"
            >
              <div className=" w-full pt-3 font-semibold  text-xl ">
                تغییر دادن پسورد
              </div>
              <div className=" flex  w-full gap-x-6  mx-auto">
                <div className="flex-1 flex flex-col  gap-y-2">
                  <label
                    className=" text-[16px] text-slate-600"
                    htmlFor="pastPassword"
                  >
                    پسورد قبلی
                  </label>
                  <input
                    type="password"
                    {...register("currentPassword", {
                      required: "لطفا پسورد قبلی تانرا وارد کنید",
                    })}
                    id="pastPassword"
                    placeholder="اینجا پسورد فعلی تانرا بنوسید"
                    className={inputStyle}
                  />
                  {errors.currentPassword && (
                    <p className=" text-[9px] text-red-500">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
                <div className=" flex-1 flex flex-col gap-y-2">
                  <label
                    className=" text-[16px] text-slate-600"
                    htmlFor="newPassword"
                  >
                    پسورد جدید{" "}
                  </label>
                  <input
                    type="password"
                    {...register("newPassword", {
                      required: "لطفا پسورد جدید تانرا وارد کنید",
                    })}
                    id="newPassword"
                    placeholder="اینجا پسورد جدید تانرا بنوسید"
                    className={inputStyle}
                  />
                  {errors.newPassword && (
                    <p className=" text-[9px] text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <div className=" w-[300px] flex gap-1">
                <Button type="submit">تغییر دادن</Button>
                <Button
                  type="button"
                  onClick={() => {
                    setChangeSetting(false);
                  }}
                  className=" bg-transparent border border-slate-600"
                >
                  {" "}
                  انصراف
                </Button>
              </div>
            </form>
          )}

          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: "var(--beige-light)" }}
          >
            <div>
              <h4 className="font-medium" style={{ color: "var(--text-dark)" }}>
                تغییر ایمیل
              </h4>
              <p className="text-sm" style={{ color: "var(--text-medium)" }}>
                ایمیل خود را به‌روزرسانی کنید
              </p>
            </div>
            <button
              onClick={() => setChangeEmail(true)}
              className="btn-secondary"
            >
              تغییر ایمیل
            </button>
          </div>

          {changeEmail && (
            <form
              noValidate
              onSubmit={emailtHandleSubmit(handleEmail)}
              className=" space-y-3"
            >
              <div className=" w-full pt-3 font-semibold  text-xl ">
                تغییر دادن ایمیل
              </div>
              <div className=" flex  w-full gap-x-6  mx-auto">
                <div className="flex-1 flex flex-col  gap-y-2">
                  <label className=" text-[16px] text-slate-600" htmlFor="name">
                    نام کامل
                  </label>
                  <input
                    type="text"
                    {...emailReigster("name", {
                      required: "لطفا نام تانرا وارد کنید",
                    })}
                    id="name"
                    placeholder="اینجا نام تانرا بنوسید"
                    className={inputStyle}
                  />
                  {editError.name && (
                    <p className=" text-[9px] text-red-500">
                      {editError.name.message}
                    </p>
                  )}
                </div>
                <div className=" flex-1 flex flex-col gap-y-2">
                  <label
                    className=" text-[16px] text-slate-600"
                    htmlFor="newEmail"
                  >
                    ایمیل جدید{" "}
                  </label>
                  <input
                    type="email"
                    {...emailReigster("email", {
                      required: "لطفا ایمیل جدید تانرا وارد کنید",
                    })}
                    id="email"
                    placeholder="اینجا ایمیل جدید تانرا بنوسید"
                    className={inputStyle}
                  />
                  {editError.email && (
                    <p className=" text-[9px] text-red-500">
                      {editError.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className=" w-[300px] flex gap-1">
                <Button type="submit">تغییر دادن</Button>
                <Button
                  type="button"
                  onClick={() => {
                    setChangeEmail(false);
                  }}
                  className=" bg-transparent border border-slate-600"
                >
                  {" "}
                  انصراف
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
