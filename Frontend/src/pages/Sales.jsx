import {
  BanknotesIcon,
  CurrencyDollarIcon,
  PrinterIcon,
  ReceiptPercentIcon,
  ShoppingCartIcon,
  TrashIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "../components/Button";
import Sale from "../components/Sale";
import { formatCurrency } from "../utilies/helper";
import Modal from "./../components/Modal";
import { useForm } from "react-hook-form";
import { useCreateSale } from "../services/useApi";
import CustomerForm from "../components/CustomerForm";
import SalesForm from "../components/SalesForm";

const Sales = () => {
  // Tab and filter states
  const { register, handleSubmit, watch, reset, control } = useForm({
    defaultValues: {
      saleDate: new Date().toISOString().slice(0, 10),
      customer: "",
      employee: "",
      saleType: "cash",
      billType: "small",
      discount: 0,
      tax: 0,
      notes: "",
      items: [], // sale items (saleItemSchema fields)
    },
  });
  const { mutate: createSale } = useCreateSale();
  const [activeTab, setActiveTab] = useState("sales");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBillType, setFilterBillType] = useState("all");
  const [filterEmployee, setFilterEmployee] = useState("all");

  // Modal states
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Sale items state
  const [saleItems, setSaleItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    product: "",
    unit: "",
    batchNumber: "",
    quantity: 0,
    unitPrice: 0,
    total: 0,
  });

  // New customer state
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    address: "",
    customerType: "retail",
    creditLimit: 0,
    paymentTerms: "30",
  });
  const onSubmit = (data) => {
    createSale({ ...data, items: saleItems });
    reset();
  };
  // Customers data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Ahmad Khan",
      company: "Ahmad Retail Store",
      phone: "+93 700 111 222",
      email: "ahmad@retailstore.com",
      address: "Kabul, Afghanistan",
      customerType: "retail",
      totalPurchases: 25,
      totalAmount: 12500,
      amountPaid: 10000,
      amountOwed: 2500,
      creditLimit: 5000,
      paymentTerms: "15 days",
      status: "active",
      lastPurchase: "2024-01-15",
    },
    {
      id: 2,
      name: "Sara Ahmed Wholesale",
      company: "Sara Trading Co",
      phone: "+93 700 333 444",
      email: "sara@trading.com",
      address: "Herat, Afghanistan",
      customerType: "wholesale",
      totalPurchases: 15,
      totalAmount: 45000,
      amountPaid: 40000,
      amountOwed: 5000,
      creditLimit: 20000,
      paymentTerms: "30 days",
      status: "active",
      lastPurchase: "2024-01-15",
    },
  ]);

  // Employees data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Ali Mohammad",
      position: "Sales Associate",
      phone: "+93 700 555 666",
      totalSales: 50,
      totalRevenue: 25000,
      commission: 1250,
      goodsGiven: 10000,
      goodsReturned: 500,
      status: "active",
    },
    {
      id: 2,
      name: "Fatima Hussain",
      position: "Store Manager",
      phone: "+93 700 777 888",
      totalSales: 75,
      totalRevenue: 38000,
      commission: 1900,
      goodsGiven: 15000,
      goodsReturned: 200,
      status: "active",
    },
  ]);

  // Sales data
  const [sales, setSales] = useState([
    {
      id: 1,
      billNumber: "BILL-2024-001",
      customer: "Ahmad Khan",
      customerId: 1,
      employee: "Ali Mohammad",
      employeeId: 1,
      items: [
        {
          product: "Fresh Dates - Medjool",
          quantity: 10,
          unitPrice: 15.99,
          total: 159.9,
        },
        { product: "Chickpeas", quantity: 5, unitPrice: 8.5, total: 42.5 },
      ],
      subtotal: 202.4,
      discount: 10,
      tax: 19.24,
      totalAmount: 211.64,
      amountPaid: 211.64,
      amountOwed: 0,
      saleType: "cash",
      billType: "small",
      paymentStatus: "paid",
      saleDate: "2024-01-15",
      notes: "Regular customer",
      createdBy: "Admin",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 2,
      billNumber: "BILL-2024-002",
      customer: "Sara Ahmed Wholesale",
      customerId: 2,
      employee: "Fatima Hussain",
      employeeId: 2,
      items: [
        {
          product: "Fresh Dates - Medjool",
          quantity: 100,
          unitPrice: 14.99,
          total: 1499,
        },
        {
          product: "Chickpeas - Organic",
          quantity: 50,
          unitPrice: 7.5,
          total: 375,
        },
      ],
      subtotal: 1874,
      discount: 100,
      tax: 177.4,
      totalAmount: 1951.4,
      amountPaid: 1000,
      amountOwed: 951.4,
      saleType: "credit",
      billType: "large",
      paymentStatus: "partial",
      saleDate: "2024-01-15",
      notes: "Bulk order - 30 days payment terms",
      createdBy: "Admin",
      lastUpdated: new Date().toISOString(),
    },
  ]);

  // Calculate sale totals
  const calculateSaleTotals = () => {
    const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = Number(watch("discount"));
    const taxAmount =
      ((subtotal - discountAmount) * Number(watch("tax"))) / 100;
    const total = subtotal - discountAmount + taxAmount;
    console.log(subtotal, discountAmount, taxAmount);
    return {
      subtotal: subtotal,
      taxAmount: taxAmount,
      total: total,
    };
  };

  // Handle customer creation
  const handleAddCustomer = () => {
    const customer = {
      id: customers.length + 1,
      ...newCustomer,
      totalPurchases: 0,
      totalAmount: 0,
      amountPaid: 0,
      amountOwed: 0,
      status: "active",
      lastPurchase: null,
    };

    setCustomers([...customers, customer]);
    setShowCustomerModal(false);
    setNewCustomer({
      name: "",
      company: "",
      phone: "",
      email: "",
      address: "",
      customerType: "retail",
      creditLimit: 0,
      paymentTerms: "30",
    });
  };

  // Filter sales
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.items.some((item) =>
        item.product.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      filterStatus === "all" || sale.paymentStatus === filterStatus;
    const matchesBillType =
      filterBillType === "all" || sale.billType === filterBillType;
    const matchesEmployee =
      filterEmployee === "all" || sale.employee === filterEmployee;

    return matchesSearch && matchesStatus && matchesBillType && matchesEmployee;
  });

  // Calculate statistics
  const stats = {
    totalSales: sales.length,
    totalRevenue: sales.reduce((sum, s) => sum + s.totalAmount, 0),
    cashSales: sales.filter((s) => s.saleType === "cash").length,
    creditSales: sales.filter((s) => s.saleType === "credit").length,
    smallBills: sales.filter((s) => s.billType === "small").length,
    largeBills: sales.filter((s) => s.billType === "large").length,
    totalPaid: sales.reduce((sum, s) => sum + s.amountPaid, 0),
    totalOwed: sales.reduce((sum, s) => sum + s.amountOwed, 0),
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border border-green-200";
      case "partial":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "pending":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getBillTypeColor = (type) => {
    return type === "large"
      ? "bg-blue-100 text-blue-800 border border-blue-200"
      : "bg-gray-100 text-gray-800 border border-gray-200";
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت خرید</h1>
          <p className="text-gray-600 mt-2">
            مدیریت خرید، ایجاد فاکتور ها و ردیابی مشتریها و کارمندها
          </p>
        </div>
        <div className="flex w-2/5 gap-3">
          <Modal>
            <Modal.Toggle id="export">
              <Button className=" bg-success-green">خروجی</Button>
            </Modal.Toggle>
            <Modal.Window name="export">
              <div className="w-[400px] h-[300px] bg-white"></div>
            </Modal.Window>
          </Modal>
          <Modal>
            <Modal.Toggle id="addPurchase">
              <Button className=" bg-deepdate-400">اضافه کردن فروش</Button>
            </Modal.Toggle>
            <Modal.Window name="addPurchase">
              <SalesForm
                summary={() => calculateSaleTotals()}
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                items={saleItems}
                setItems={setSaleItems}
                handleSubmit={handleSubmit(onSubmit)}
                register={register}
                watch={watch}
                control={control}
              />
            </Modal.Window>
          </Modal>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مجموعه خرید</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalSales}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مجموعه عواید</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.totalRevenue.toFixed(2))}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مبلغ جمع آوری شده</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(stats.totalPaid.toFixed(2))}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">فروش اعتباری</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(stats.totalOwed.toFixed(2))}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <ReceiptPercentIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("sales")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "sales"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              فروش
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "customers"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserGroupIcon className="h-5 w-5" />
              مشتری ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "employees"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <UsersIcon className="h-5 w-5" />
              پیگری کارمند
            </button>
          </nav>
        </div>

        {/* Sales Tab */}
        {activeTab === "sales" && (
          <div className="p-6">
            <Sale
              getBillTypeColor={getBillTypeColor}
              getPaymentStatusColor={getPaymentStatusColor}
            />
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                حساب مشتریان
              </h3>
              <div className=" w-[200px]">
                <Modal>
                  <Modal.Toggle>
                    <Button className="py-[14px] bg-success-green">
                      اضافه کردن مشتری
                    </Button>
                  </Modal.Toggle>
                  <Modal.Window>
                    {/* <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Add Customer
                        </h2>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Customer Name *
                            </label>
                            <input
                              type="text"
                              value={newCustomer.name}
                              onChange={(e) =>
                                setNewCustomer({
                                  ...newCustomer,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company
                            </label>
                            <input
                              type="text"
                              value={newCustomer.company}
                              onChange={(e) =>
                                setNewCustomer({
                                  ...newCustomer,
                                  company: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone *
                            </label>
                            <input
                              type="tel"
                              value={newCustomer.phone}
                              onChange={(e) =>
                                setNewCustomer({
                                  ...newCustomer,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={newCustomer.email}
                              onChange={(e) =>
                                setNewCustomer({
                                  ...newCustomer,
                                  email: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={newCustomer.address}
                              onChange={(e) =>
                                setNewCustomer({
                                  ...newCustomer,
                                  address: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Customer Type
                            </label>
                            <select
                              value={newCustomer.customerType}
                              onChange={(e) =>
                                setNewCustomer({
                                  ...newCustomer,
                                  customerType: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="retail">Retail</option>
                              <option value="wholesale">Wholesale</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Credit Limit ($)
                            </label>
                            <input
                              type="number"
                              value={newCustomer.creditLimit}
                              onChange={(e) =>
                                setNewCustomer({
                                  ...newCustomer,
                                  creditLimit: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Payment Terms
                            </label>
                            <select
                              value={newCustomer.paymentTerms}
                              onChange={(e) =>
                                setNewCustomer({
                                  ...newCustomer,
                                  paymentTerms: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="15">15 days</option>
                              <option value="30">30 days</option>
                              <option value="45">45 days</option>
                              <option value="60">60 days</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 border-t flex justify-end gap-4">
                        <button
                          onClick={() => setShowCustomerModal(false)}
                          className="px-4 py-2 border rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddCustomer}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg"
                        >
                          Add Customer
                        </button>
                      </div>
                    </div> */}
                    <CustomerForm />
                  </Modal.Window>
                </Modal>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.map((customer, index) => (
                <CustomerAccountComponent key={index} customer={customer} />
              ))}
            </div>
          </div>
        )}

        {/* Employee Tracking Tab */}
        {activeTab === "employees" && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              موثریت کارمند در فروش
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employees.map((employee, index) => (
                <EmployeAccountComponent key={index} employee={employee} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Sale Modal */}
      {showAddSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"></div>
      )}

      {/* Add Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"></div>
      )}
    </div>
  );
};
const EmployeAccountComponent = ({ employee }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-amber-100 p-4 rounded-full">
          <UsersIcon className="h-8 w-8 text-amber-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
          <p className="text-sm text-gray-600">{employee.position}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">مجموعه فروشات:</span>
          <span className="text-lg font-bold text-gray-900">
            {employee.totalSales}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">مجموعه عواید:</span>
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(employee.totalRevenue)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">کمیسیون:</span>
          <span className="text-lg font-bold text-amber-600">
            {formatCurrency(employee.commission)}
          </span>
        </div>
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">اجناس داده شده:</span>
            <span className="font-semibold text-blue-600">
              {formatCurrency(employee.goodsGiven)}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">اجناس برگشت خورده:</span>
            <span className="font-semibold text-purple-600">
              {formatCurrency(employee.goodsReturned)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="flex-1">
          <Button className="flex-1 px-3 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            View Details
          </Button>
        </div>
        <div className="flex-1">
          <Button className="bg-success-green">Sales History</Button>
        </div>
      </div>
    </div>
  );
};
const CustomerAccountComponent = ({ customer }) => {
  return (
    <div className="bg-white  relative flex flex-col border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex w-full  flex-1 items-start justify-between mb-4">
        <div className="flex w-full  items-center gap-3 ">
          <UserGroupIcon className="w-7 text-blue-600" />

          <div className=" ">
            <h3 className="text-lg font-medium w-full  text-gray-900">
              {customer.name}
            </h3>
            <p className="text-sm text-gray-600">{customer.company}</p>
            <span
              className={`inline-flex mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                customer.customerType === "wholesale"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {customer.customerType}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 flex-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">مجموعه خریدها:</span>
          <span className="font-semibold text-gray-900">
            {customer.totalPurchases}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">مجموعه مبلغ:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(customer.totalAmount.toLocaleString())}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">مبلغ پرداخت شده:</span>
          <span className="font-semibold text-green-600">
            {formatCurrency(customer.amountPaid.toLocaleString())}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">مبلغ باقی مانده:</span>
          <span className="font-semibold text-red-600">
            {formatCurrency(customer.amountOwed.toLocaleString())}
          </span>
        </div>
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Credit Limit:</span>
            <span>${customer.creditLimit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1">
        <Button>دیدن تمام جزئیات</Button>
      </div>
    </div>
  );
};
export default Sales;
