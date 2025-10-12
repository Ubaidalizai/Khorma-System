import { useState } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const Accounts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data
  const [customers] = useState([
    {
      id: 1,
      name: "Ahmad Khan",
      phone: "+93 70 123 4567",
      address: "Kabul, Afghanistan",
      totalPurchases: 12500,
      lastPurchase: "2024-01-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Sara Ahmed",
      phone: "+93 70 234 5678",
      address: "Herat, Afghanistan",
      totalPurchases: 8750,
      lastPurchase: "2024-01-14",
      status: "Active",
    },
    {
      id: 3,
      name: "Mohammad Ali",
      phone: "+93 70 345 6789",
      address: "Mazar-i-Sharif, Afghanistan",
      totalPurchases: 3200,
      lastPurchase: "2024-01-10",
      status: "Inactive",
    },
  ]);

  const [suppliers] = useState([
    {
      id: 1,
      name: "Fresh Foods Ltd",
      contact: "John Smith",
      phone: "+93 70 111 2222",
      address: "Kabul, Afghanistan",
      totalPurchases: 45000,
      lastPurchase: "2024-01-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Grain Suppliers Inc",
      contact: "Mike Johnson",
      phone: "+93 70 333 4444",
      address: "Kandahar, Afghanistan",
      totalPurchases: 32000,
      lastPurchase: "2024-01-14",
      status: "Active",
    },
  ]);

  const [employees] = useState([
    {
      id: 1,
      name: "Ali Hassan",
      position: "Sales Manager",
      phone: "+93 70 555 6666",
      salary: 15000,
      joinDate: "2023-01-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Fatima Zahra",
      position: "Warehouse Assistant",
      phone: "+93 70 777 8888",
      salary: 12000,
      joinDate: "2023-06-01",
      status: "Active",
    },
  ]);

  const getCurrentData = () => {
    switch (activeTab) {
      case "customers":
        return customers;
      case "suppliers":
        return suppliers;
      case "employees":
        return employees;
      default:
        return customers;
    }
  };

  const filteredData = getCurrentData().filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone && item.phone.includes(searchTerm))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    {
      id: "customers",
      name: "مشتریان",
      icon: UserGroupIcon,
      count: customers.length,
    },
    {
      id: "suppliers",
      name: "تامین‌کنندگان",
      icon: BuildingOfficeIcon,
      count: suppliers.length,
    },
    {
      id: "employees",
      name: "کارمندان",
      icon: UserIcon,
      count: employees.length,
    },
  ];

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
      <div className='flex justify-between items-center'>
        <div>
          <h1
            className='font-bold'
            style={{
              fontSize: "var(--h1-size)",
              color: "var(--text-dark)",
              marginBottom: "var(--space-2)",
            }}
          >
            مدیریت حساب‌ها
          </h1>
          <p
            style={{
              color: "var(--text-medium)",
              fontSize: "var(--body-regular)",
            }}
          >
            مدیریت مشتریان، تامین‌کنندگان و کارمندان
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className='btn-primary flex items-center'
          style={{
            backgroundColor: "var(--amber)",
            color: "white",
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "0.5rem",
            border: "none",
            fontWeight: "600",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px var(--shadow)",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "var(--amber-dark)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "var(--amber)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <PlusIcon className='h-5 w-5 ml-2' />
          افزودن{" "}
          {activeTab === "customers"
            ? "مشتری"
            : activeTab === "suppliers"
            ? "تامین‌کننده"
            : "کارمند"}
        </button>
      </div>

      {/* Tabs */}
      <div className='card'>
        <div className='border-b' style={{ borderColor: "var(--border)" }}>
          <nav className='-mb-px flex px-6' style={{ gap: "var(--space-8)" }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className='py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-200'
                  style={{
                    borderBottomColor:
                      activeTab === tab.id ? "var(--amber)" : "transparent",
                    color:
                      activeTab === tab.id
                        ? "var(--amber-dark)"
                        : "var(--text-medium)",
                    textAlign: "right",
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.color = "var(--text-dark)";
                      e.target.style.borderBottomColor = "var(--border)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.color = "var(--text-medium)";
                      e.target.style.borderBottomColor = "transparent";
                    }
                  }}
                >
                  <Icon className='h-5 w-5 ml-2' />
                  {tab.name}
                  <span
                    className='ml-2 py-0.5 px-2.5 rounded-full text-xs'
                    style={{
                      backgroundColor: "var(--beige-light)",
                      color: "var(--text-dark)",
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Search */}
      <div className='card'>
        <div className='relative'>
          <MagnifyingGlassIcon
            className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5'
            style={{ color: "var(--text-light)" }}
          />
          <input
            type='text'
            placeholder={`جستجو در ${
              activeTab === "customers"
                ? "مشتریان"
                : activeTab === "suppliers"
                ? "تامین‌کنندگان"
                : "کارمندان"
            }...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='form-input'
            style={{
              paddingRight: "2.5rem",
              paddingLeft: "1rem",
              textAlign: "right",
            }}
          />
        </div>
      </div>

      {/* Data table */}
      <div className='card overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='data-table'>
            <thead>
              <tr>
                <th>نام</th>
                <th>تماس</th>
                <th>تلفن</th>
                <th>{activeTab === "employees" ? "سمت" : "آدرس"}</th>
                {activeTab !== "employees" && <th>کل خریدها</th>}
                {activeTab === "employees" && <th>حقوق</th>}
                <th>
                  {activeTab === "employees" ? "تاریخ استخدام" : "آخرین خرید"}
                </th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: "var(--text-dark)", fontWeight: "500" }}>
                    {item.name}
                  </td>
                  <td style={{ color: "var(--text-dark)" }}>
                    {item.contact || "-"}
                  </td>
                  <td style={{ color: "var(--text-dark)" }}>{item.phone}</td>
                  <td style={{ color: "var(--text-dark)" }}>
                    {activeTab === "employees" ? item.position : item.address}
                  </td>
                  {activeTab !== "employees" && (
                    <td style={{ color: "var(--text-dark)" }}>
                      {item.totalPurchases?.toLocaleString() || "-"} تومان
                    </td>
                  )}
                  {activeTab === "employees" && (
                    <td style={{ color: "var(--text-dark)" }}>
                      {item.salary?.toLocaleString() || "-"} تومان
                    </td>
                  )}
                  <td style={{ color: "var(--text-medium)" }}>
                    {activeTab === "employees"
                      ? item.joinDate
                      : item.lastPurchase}
                  </td>
                  <td>
                    <span
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                      style={{
                        backgroundColor:
                          item.status === "Active"
                            ? "var(--success-light)"
                            : "var(--error-light)",
                        color:
                          item.status === "Active"
                            ? "var(--success-green)"
                            : "var(--error-red)",
                      }}
                    >
                      {item.status === "Active" ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td>
                    <div className='flex' style={{ gap: "var(--space-2)" }}>
                      <button
                        className='transition-colors duration-200'
                        style={{ color: "var(--info-blue)" }}
                        onMouseEnter={(e) =>
                          (e.target.style.color = "var(--info-blue)")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.color = "var(--info-blue)")
                        }
                      >
                        <EyeIcon className='h-4 w-4' />
                      </button>
                      <button
                        className='transition-colors duration-200'
                        style={{ color: "var(--amber)" }}
                        onMouseEnter={(e) =>
                          (e.target.style.color = "var(--amber-dark)")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.color = "var(--amber)")
                        }
                      >
                        <PencilIcon className='h-4 w-4' />
                      </button>
                      <button
                        className='transition-colors duration-200'
                        style={{ color: "var(--error-red)" }}
                        onMouseEnter={(e) =>
                          (e.target.style.color = "var(--error-red)")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.color = "var(--error-red)")
                        }
                      >
                        <TrashIcon className='h-4 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {showAddModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Add New {activeTab.slice(0, -1)}
              </h3>
              <form className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Name
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder={`Enter ${activeTab.slice(0, -1)} name`}
                  />
                </div>
                {activeTab === "suppliers" && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Contact Person
                    </label>
                    <input
                      type='text'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                      placeholder='Enter contact person name'
                    />
                  </div>
                )}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='Enter phone number'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {activeTab === "employees" ? "Position" : "Address"}
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder={
                      activeTab === "employees"
                        ? "Enter position"
                        : "Enter address"
                    }
                  />
                </div>
                {activeTab === "employees" && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Salary
                    </label>
                    <input
                      type='number'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                      placeholder='Enter salary'
                    />
                  </div>
                )}
                <div className='flex justify-end space-x-3 pt-4'>
                  <button
                    type='button'
                    onClick={() => setShowAddModal(false)}
                    className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700'
                  >
                    Add {activeTab.slice(0, -1)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
