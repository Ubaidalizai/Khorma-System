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
  XMarkIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import AccountForm from "../components/AccountForm";
import { createAccount as createAccountAPI } from "../services/apiUtiles";
import { useForm } from "react-hook-form";

const Accounts = () => {
  const [activeTab, setActiveTab] = useState("suppliers");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmitAccount = async (data) => {
    try {
      await createAccountAPI(data);
      setShowAccountModal(false);
      reset();
      // Refresh the accounts list
      window.location.reload();
    } catch (error) {
      console.error("Failed to create account:", error);
    }
  };

  // Supplier account tracking state
  const [suppliers] = useState([
    {
      id: 1,
      name: "Fresh Foods Ltd",
      contact: "Ahmed Hassan",
      phone: "+93 700 123 456",
      email: "ahmed@freshfoods.com",
      totalPurchases: 15,
      totalAmount: 45000,
      amountPaid: 40000,
      amountOwed: 5000,
      lastPayment: "2024-01-15",
      lastPurchase: "2024-01-16",
      paymentTerms: "30 days",
      status: "active",
    },
    {
      id: 2,
      name: "Grain Suppliers Inc",
      contact: "Mohammad Ali",
      phone: "+93 700 234 567",
      email: "ali@grainsupply.com",
      totalPurchases: 12,
      totalAmount: 38000,
      amountPaid: 30000,
      amountOwed: 8000,
      lastPayment: "2024-01-14",
      lastPurchase: "2024-01-15",
      paymentTerms: "45 days",
      status: "active",
    },
  ]);

  // Employee accountability state
  const [employees] = useState([
    {
      id: 1,
      name: "Ali Mohammad",
      position: "Sales Associate",
      phone: "+93 700 555 666",
      salary: 15000,
      totalSales: 50,
      salesRevenue: 25000,
      commission: 1250,
      goodsGiven: 10000,
      goodsSold: 9000,
      goodsReturned: 500,
      cashCollected: 8500,
      cashSubmitted: 8500,
      balance: 0,
      status: "active",
    },
    {
      id: 2,
      name: "Fatima Hussain",
      position: "Store Manager",
      phone: "+93 700 777 888",
      salary: 18000,
      totalSales: 75,
      salesRevenue: 38000,
      commission: 1900,
      goodsGiven: 15000,
      goodsSold: 14500,
      goodsReturned: 200,
      cashCollected: 14300,
      cashSubmitted: 14000,
      balance: 300,
      status: "active",
    },
  ]);

  // Expense categories state
  const [expenseCategories] = useState([
    { id: 1, name: "Rent", icon: "🏢", budget: 5000, color: "blue" },
    { id: 2, name: "Utilities", icon: "⚡", budget: 1000, color: "yellow" },
    { id: 3, name: "Transportation", icon: "🚚", budget: 2000, color: "green" },
    { id: 4, name: "Salaries", icon: "👥", budget: 50000, color: "purple" },
    { id: 5, name: "Marketing", icon: "📢", budget: 3000, color: "pink" },
    { id: 6, name: "Maintenance", icon: "🔧", budget: 1500, color: "orange" },
    { id: 7, name: "Office Supplies", icon: "📎", budget: 800, color: "gray" },
    { id: 8, name: "Other", icon: "📋", budget: 2000, color: "indigo" },
  ]);

  // Expenses state
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      category: "Rent",
      amount: 5000,
      description: "Monthly office rent",
      date: "2024-01-01",
      paymentMethod: "bank_transfer",
      reference: "RENT-JAN-2024",
      createdBy: "Admin",
    },
    {
      id: 2,
      category: "Utilities",
      amount: 850,
      description: "Electricity bill",
      date: "2024-01-05",
      paymentMethod: "cash",
      reference: "UTIL-JAN-2024-01",
      createdBy: "Admin",
    },
    {
      id: 3,
      category: "Transportation",
      amount: 1200,
      description: "Delivery vehicles fuel",
      date: "2024-01-10",
      paymentMethod: "cash",
      reference: "TRANS-JAN-2024-01",
      createdBy: "Admin",
    },
    {
      id: 4,
      category: "Salaries",
      amount: 33000,
      description: "Monthly employee salaries",
      date: "2024-01-01",
      paymentMethod: "bank_transfer",
      reference: "SAL-JAN-2024",
      createdBy: "Admin",
    },
  ]);

  // Payment tracking state
  const [payments] = useState([
    {
      id: 1,
      type: "supplier_payment",
      party: "Fresh Foods Ltd",
      amount: 5000,
      paymentMethod: "bank_transfer",
      reference: "TXN-2024-001",
      date: "2024-01-15",
      status: "completed",
      notes: "Payment for invoice INV-2024-001",
    },
    {
      id: 2,
      type: "customer_receipt",
      party: "Ahmad Khan",
      amount: 2500,
      paymentMethod: "cash",
      reference: "RCP-2024-001",
      date: "2024-01-15",
      status: "completed",
      notes: "Payment received for bill BILL-2024-001",
    },
    {
      id: 3,
      type: "expense_payment",
      party: "Office Landlord",
      amount: 5000,
      paymentMethod: "bank_transfer",
      reference: "RENT-JAN-2024",
      date: "2024-01-01",
      status: "completed",
      notes: "Monthly rent payment",
    },
    {
      id: 4,
      type: "employee_salary",
      party: "Ali Mohammad",
      amount: 15000,
      paymentMethod: "bank_transfer",
      reference: "SAL-JAN-2024-001",
      date: "2024-01-01",
      status: "completed",
      notes: "Monthly salary",
    },
  ]);

  // New expense form state
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    reference: "",
  });

  // Calculate statistics
  const supplierStats = {
    totalOwed: suppliers.reduce((sum, s) => sum + s.amountOwed, 0),
    totalPaid: suppliers.reduce((sum, s) => sum + s.amountPaid, 0),
    totalSuppliers: suppliers.length,
    activeSuppliers: suppliers.filter((s) => s.status === "active").length,
  };

  const employeeStats = {
    totalEmployees: employees.length,
    totalSalary: employees.reduce((sum, e) => sum + e.salary, 0),
    totalCommission: employees.reduce((sum, e) => sum + e.commission, 0),
    totalGoodsGiven: employees.reduce((sum, e) => sum + e.goodsGiven, 0),
    totalCashPending: employees.reduce((sum, e) => sum + e.balance, 0),
  };

  const expenseStats = {
    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    categoriesUsed: [...new Set(expenses.map((e) => e.category))].length,
    thisMonthExpenses: expenses
      .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
      .reduce((sum, e) => sum + e.amount, 0),
    totalBudget: expenseCategories.reduce((sum, c) => sum + c.budget, 0),
  };

  const paymentStats = {
    totalPayments: payments.length,
    totalPaid: payments
      .filter((p) => p.type.includes("payment"))
      .reduce((sum, p) => sum + p.amount, 0),
    totalReceived: payments
      .filter((p) => p.type.includes("receipt"))
      .reduce((sum, p) => sum + p.amount, 0),
  };

  // Handle expense creation
  const handleAddExpense = () => {
    const expense = {
      id: expenses.length + 1,
      ...newExpense,
      createdBy: "Admin",
      createdAt: new Date().toISOString(),
    };

    setExpenses([expense, ...expenses]);
    setShowExpenseModal(false);
    setNewExpense({
      category: "",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
      reference: "",
    });
  };

  return (
    <div className='space-y-6 w-full max-w-full overflow-x-hidden'>
      {/* Page header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>مدیریت حسابات</h1>
          <p className='text-gray-600 mt-2'>
            ردیابی تهیه کننده ها، کارمندان، مصارف و پرداخت ها
          </p>
        </div>
        {activeTab === "expenses" && (
          <button
            onClick={() => setShowExpenseModal(true)}
            className='bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2'
          >
            <PlusIcon className='h-5 w-5' />
            Add Expense
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {activeTab === "suppliers" && (
          <>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>مجموعه تهیه کننده ها</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>
                    {supplierStats.totalSuppliers}
                  </p>
                </div>
                <div className='bg-blue-100 p-3 rounded-lg'>
                  <BuildingOfficeIcon className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>مبلغ پرداخت شده</p>
                  <p className='text-2xl font-bold text-green-600 mt-1'>
                    ${supplierStats.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className='bg-green-100 p-3 rounded-lg'>
                  <BanknotesIcon className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>مبلغ باقی مانده</p>
                  <p className='text-2xl font-bold text-red-600 mt-1'>
                    ${supplierStats.totalOwed.toLocaleString()}
                  </p>
                </div>
                <div className='bg-red-100 p-3 rounded-lg'>
                  <CurrencyDollarIcon className='h-6 w-6 text-red-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>تهیه کننده فعال</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>
                    {supplierStats.activeSuppliers}
                  </p>
                </div>
                <div className='bg-purple-100 p-3 rounded-lg'>
                  <ChartBarIcon className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "employees" && (
          <>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>تعداد کارمندان</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>
                    {employeeStats.totalEmployees}
                  </p>
                </div>
                <div className='bg-blue-100 p-3 rounded-lg'>
                  <UserIcon className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>مجموعه معاشات</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>
                    ${employeeStats.totalSalary.toLocaleString()}
                  </p>
                </div>
                <div className='bg-purple-100 p-3 rounded-lg'>
                  <BanknotesIcon className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>اجناس فروختده شده</p>
                  <p className='text-2xl font-bold text-amber-600 mt-1'>
                    ${employeeStats.totalGoodsGiven.toLocaleString()}
                  </p>
                </div>
                <div className='bg-amber-100 p-3 rounded-lg'>
                  <ArrowTrendingUpIcon className='h-6 w-6 text-amber-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>مبالغ معلق</p>
                  <p className='text-2xl font-bold text-red-600 mt-1'>
                    ${employeeStats.totalCashPending.toLocaleString()}
                  </p>
                </div>
                <div className='bg-red-100 p-3 rounded-lg'>
                  <ArrowTrendingDownIcon className='h-6 w-6 text-red-600' />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "expenses" && (
          <>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>مجموعه مصارف</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>
                    ${expenseStats.totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div className='bg-red-100 p-3 rounded-lg'>
                  <CurrencyDollarIcon className='h-6 w-6 text-red-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>این ماه</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>
                    ${expenseStats.thisMonthExpenses.toLocaleString()}
                  </p>
                </div>
                <div className='bg-purple-100 p-3 rounded-lg'>
                  <CalendarIcon className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>کتگوری</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>
                    {expenseStats.categoriesUsed}
                  </p>
                </div>
                <div className='bg-amber-100 p-3 rounded-lg'>
                  <TagIcon className='h-6 w-6 text-amber-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>مجموع سرمایه</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>
                    ${expenseStats.totalBudget.toLocaleString()}
                  </p>
                </div>
                <div className='bg-blue-100 p-3 rounded-lg'>
                  <ChartBarIcon className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "payments" && (
          <>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>مجموع پرداخت ها</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>
                    {paymentStats.totalPayments}
                  </p>
                </div>
                <div className='bg-blue-100 p-3 rounded-lg'>
                  <ClipboardDocumentListIcon className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Total Paid Out</p>
                  <p className='text-2xl font-bold text-red-600 mt-1'>
                    ${paymentStats.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div className='bg-red-100 p-3 rounded-lg'>
                  <ArrowTrendingDownIcon className='h-6 w-6 text-red-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>مجموع دریافتی</p>
                  <p className='text-2xl font-bold text-green-600 mt-1'>
                    ${paymentStats.totalReceived.toLocaleString()}
                  </p>
                </div>
                <div className='bg-green-100 p-3 rounded-lg'>
                  <ArrowTrendingUpIcon className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>Net Flow</p>
                  <p
                    className={`text-2xl font-bold mt-1 ${
                      paymentStats.totalReceived - paymentStats.totalPaid > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    $
                    {(
                      paymentStats.totalReceived - paymentStats.totalPaid
                    ).toLocaleString()}
                  </p>
                </div>
                <div className='bg-purple-100 p-3 rounded-lg'>
                  <ChartBarIcon className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='border-b border-gray-200'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab("suppliers")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "suppliers"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <BuildingOfficeIcon className='h-5 w-5' />
              حساب تهیه کننده
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "employees"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserIcon className='h-5 w-5' />
              جوابگویی کارمند
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "expenses"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <TagIcon className='h-5 w-5' />
              مدیریت مصارف
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "payments"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <BanknotesIcon className='h-5 w-5' />
              ردیابی پرداختی
            </button>
          </nav>
        </div>

        {/* Supplier Accounts Tab */}
        {activeTab === "suppliers" && (
          <div className='p-6'>
            <div className='overflow-x-auto -mx-6 px-6'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Supplier
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Contact
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Total Amount
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Paid
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Owed
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Last Payment
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Terms
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>
                          {supplier.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {supplier.email}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {supplier.contact}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900'>
                        ${supplier.totalAmount.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600'>
                        ${supplier.amountPaid.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600'>
                        ${supplier.amountOwed.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(supplier.lastPayment).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {supplier.paymentTerms}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          {supplier.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>
                        <div className='flex space-x-2'>
                          <button className='text-blue-600 hover:text-blue-900'>
                            <EyeIcon className='h-5 w-5' />
                          </button>
                          <button className='text-green-600 hover:text-green-900'>
                            <BanknotesIcon className='h-5 w-5' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Employee Accountability Tab */}
        {activeTab === "employees" && (
          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className='bg-white border border-gray-200 rounded-lg p-6'
                >
                  <div className='flex items-center gap-4 mb-6'>
                    <div className='bg-amber-100 p-4 rounded-full'>
                      <UserIcon className='h-8 w-8 text-amber-600' />
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-gray-900'>
                        {employee.name}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {employee.position}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div className='bg-blue-50 rounded-lg p-3'>
                      <h4 className='text-xs font-semibold text-gray-600 mb-2'>
                        Sales Performance
                      </h4>
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-700'>Total Sales:</span>
                        <span className='font-bold text-blue-600'>
                          {employee.totalSales}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm mt-1'>
                        <span className='text-gray-700'>Revenue:</span>
                        <span className='font-bold text-blue-600'>
                          ${employee.salesRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm mt-1'>
                        <span className='text-gray-700'>Commission:</span>
                        <span className='font-bold text-green-600'>
                          ${employee.commission.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className='bg-amber-50 rounded-lg p-3'>
                      <h4 className='text-xs font-semibold text-gray-600 mb-2'>
                        Goods Accountability
                      </h4>
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-700'>Goods Given:</span>
                        <span className='font-bold text-amber-600'>
                          ${employee.goodsGiven.toLocaleString()}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm mt-1'>
                        <span className='text-gray-700'>Goods Sold:</span>
                        <span className='font-bold text-green-600'>
                          ${employee.goodsSold.toLocaleString()}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm mt-1'>
                        <span className='text-gray-700'>Goods Returned:</span>
                        <span className='font-bold text-purple-600'>
                          ${employee.goodsReturned.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className='bg-green-50 rounded-lg p-3'>
                      <h4 className='text-xs font-semibold text-gray-600 mb-2'>
                        Cash Accountability
                      </h4>
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-700'>Cash Collected:</span>
                        <span className='font-bold text-green-600'>
                          ${employee.cashCollected.toLocaleString()}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm mt-1'>
                        <span className='text-gray-700'>Cash Submitted:</span>
                        <span className='font-bold text-blue-600'>
                          ${employee.cashSubmitted.toLocaleString()}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm mt-1'>
                        <span className='text-gray-700'>Balance:</span>
                        <span
                          className={`font-bold ${
                            employee.balance > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          ${employee.balance.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className='pt-3 border-t'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-gray-600'>Monthly Salary:</span>
                        <span className='font-semibold text-gray-900'>
                          ${employee.salary.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 flex gap-2'>
                    <button className='flex-1 px-3 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700'>
                      View Details
                    </button>
                    <button className='flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200'>
                      Sales History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense Management Tab */}
        {activeTab === "expenses" && (
          <div className='p-6'>
            {/* Expense Categories */}
            <div className='mb-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Expense Categories & Budgets
              </h3>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {expenseCategories.map((category) => {
                  const spent = expenses
                    .filter((e) => e.category === category.name)
                    .reduce((sum, e) => sum + e.amount, 0);
                  const percentage = (spent / category.budget) * 100;

                  return (
                    <div
                      key={category.id}
                      className='bg-white border border-gray-200 rounded-lg p-4'
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-2xl'>{category.icon}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            percentage > 90
                              ? "bg-red-100 text-red-800"
                              : percentage > 70
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <h4 className='font-semibold text-gray-900 text-sm'>
                        {category.name}
                      </h4>
                      <div className='mt-2 text-xs text-gray-600'>
                        <div className='flex justify-between'>
                          <span>Spent:</span>
                          <span className='font-semibold'>
                            ${spent.toLocaleString()}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Budget:</span>
                          <span>${category.budget.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className='mt-2 w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full ${
                            percentage > 90
                              ? "bg-red-500"
                              : percentage > 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Expenses */}
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Recent Expenses
              </h3>
              <div className='overflow-x-auto -mx-6 px-6'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                        Date
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                        Category
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                        Description
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                        Amount
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                        Method
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                        Reference
                      </th>
                      <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                            {expense.category}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-900'>
                          {expense.description}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600'>
                          ${expense.amount.toLocaleString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize'>
                          {expense.paymentMethod.replace("_", " ")}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {expense.reference}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex space-x-2'>
                            <button className='text-blue-600 hover:text-blue-900'>
                              <EyeIcon className='h-5 w-5' />
                            </button>
                            <button className='text-red-600 hover:text-red-900'>
                              <TrashIcon className='h-5 w-5' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payment Tracking Tab */}
        {activeTab === "payments" && (
          <div className='p-6'>
            <div className='overflow-x-auto -mx-6 px-6'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Type
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Party
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Method
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Reference
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {payments.map((payment) => (
                    <tr key={payment.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.type.includes("receipt")
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payment.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {payment.party}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                          payment.type.includes("receipt")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {payment.type.includes("receipt") ? "+" : "-"}$
                        {payment.amount.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize'>
                        {payment.paymentMethod.replace("_", " ")}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {payment.reference}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          {payment.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <button className='text-blue-600 hover:text-blue-900'>
                          <EyeIcon className='h-5 w-5' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full'>
            <div className='p-6 border-b flex justify-between items-center'>
              <h2 className='text-2xl font-bold text-gray-900'>Add Expense</h2>
              <button
                onClick={() => setShowExpenseModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Date *
                  </label>
                  <input
                    type='date'
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category *
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                  >
                    <option value=''>Select category</option>
                    {expenseCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Amount ($) *
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Payment Method *
                  </label>
                  <select
                    value={newExpense.paymentMethod}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        paymentMethod: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                  >
                    <option value='cash'>Cash</option>
                    <option value='bank_transfer'>Bank Transfer</option>
                    <option value='check'>Check</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Reference
                  </label>
                  <input
                    type='text'
                    value={newExpense.reference}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        reference: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                    placeholder='e.g., RENT-JAN-2024'
                  />
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description *
                  </label>
                  <textarea
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    rows='3'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                    placeholder='Expense description'
                  ></textarea>
                </div>
              </div>
            </div>
            <div className='p-6 border-t flex justify-end gap-4'>
              <button
                onClick={() => setShowExpenseModal(false)}
                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className='px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700'
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
