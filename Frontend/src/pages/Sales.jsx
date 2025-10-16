import { AiTwotonePrinter } from "react-icons/ai";
import { useState, useEffect } from "react";
import Modal from "./../components/Modal";
import Button from "../components/Button";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  XMarkIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  UsersIcon,
  ShoppingCartIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "../utilies/helper";
import Table from "../components/Table";
import TableHeader from "../components/TableHeader";
import TableBody from "../components/TableBody";
import TableRow from "../components/TableRow";
import TableColumn from "../components/TableColumn";
import TableMenuModal from "../components/TableMenuModal";
import Menus from "../components/Menu";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Confirmation from "../components/Confirmation";
import SearchInput from "../components/SearchInput";
import Select from "../components/Select";
const salesHeader = [
  { title: "نمبر فاکتور" },
  { title: "تاریخ" },
  { title: "مشتری" },
  { title: "کارمند" },
  { title: "تعداد حنس" },
  { title: "مجموعه" },
  { title: "پرداخت" },
  { title: "باقی مانده" },
  { title: "نوعیت" },
  { title: "پرداخت" },
  { title: "عملیات" },
];
const Sales = () => {
  // Tab and filter states
  const [activeTab, setActiveTab] = useState("sales");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBillType, setFilterBillType] = useState("all");
  const [filterEmployee, setFilterEmployee] = useState("all");

  // Modal states
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Sale items state
  const [saleItems, setSaleItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    product: "",
    quantity: 1,
    unitPrice: 0,
  });

  // New sale form state
  const [newSale, setNewSale] = useState({
    customer: "",
    customerId: null,
    employee: "",
    saleType: "cash",
    billType: "small",
    discount: 0,
    tax: 0,
    notes: "",
    saleDate: new Date().toISOString().split("T")[0],
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
    const discountAmount = Number(newSale.discount);
    const taxAmount = ((subtotal - discountAmount) * Number(newSale.tax)) / 100;
    const total = subtotal - discountAmount + taxAmount;

    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
    };
  };

  // Add item to sale
  const addItemToSale = () => {
    if (!currentItem.product || currentItem.quantity <= 0) return;

    const item = {
      ...currentItem,
      total: currentItem.quantity * currentItem.unitPrice,
    };

    setSaleItems([...saleItems, item]);
    setCurrentItem({ product: "", quantity: 1, unitPrice: 0 });
  };

  // Remove item from sale
  const removeItemFromSale = (index) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  // Handle sale creation
  const handleAddSale = () => {
    if (saleItems.length === 0) {
      alert("Please add at least one item to the sale");
      return;
    }

    const totals = calculateSaleTotals();
    const sale = {
      id: sales.length + 1,
      billNumber: `BILL-2024-${String(sales.length + 1).padStart(3, "0")}`,
      ...newSale,
      items: saleItems,
      subtotal: parseFloat(totals.subtotal),
      taxAmount: parseFloat(totals.taxAmount),
      totalAmount: parseFloat(totals.total),
      amountPaid: newSale.saleType === "cash" ? parseFloat(totals.total) : 0,
      amountOwed: newSale.saleType === "cash" ? 0 : parseFloat(totals.total),
      paymentStatus: newSale.saleType === "cash" ? "paid" : "pending",
      createdBy: "Admin",
      lastUpdated: new Date().toISOString(),
    };

    setSales([sale, ...sales]);
    setShowAddSaleModal(false);
    resetSaleForm();
  };

  const resetSaleForm = () => {
    setSaleItems([]);
    setNewSale({
      customer: "",
      customerId: null,
      employee: "",
      saleType: "cash",
      billType: "small",
      discount: 0,
      tax: 0,
      notes: "",
      saleDate: new Date().toISOString().split("T")[0],
    });
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
              <div className="w-[400px] h-[300px] bg-white"></div>
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
            <Table
              firstRow={
                <div className=" w-full flex gap-1 justify-around  ">
                  <div className="flex-1 flex items-center justify-start">
                    <SearchInput placeholder="لطفا جستجو کنید" />
                  </div>
                  <div className="flex-1">
                    <Select
                      placeholder=" بر اساس پرداخت"
                      options={[
                        { value: "تمام پرداخت ها" },
                        { value: " پرداخت نسبی" },
                        { value: "پرداخت های معلق" },
                      ]}
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      placeholder=" تمام حالات"
                      options={[
                        { value: "تمام فاکتورها" },
                        { value: "فاکتورهای با حجم بالا" },
                        { value: "فاکتورها با حجم پایین" },
                      ]}
                    />
                  </div>
                  <div className="flex-1 flex items-center">
                    <Select
                      placeholder=" تمام حالات"
                      options={[{ value: "تما مشتری ها" }]}
                    />
                  </div>
                </div>
              }
            >
              <TableHeader headerData={salesHeader} />
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableColumn>{sale.billNumber}</TableColumn>
                    <TableColumn>
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </TableColumn>
                    <TableColumn>{sale.customer}</TableColumn>
                    <TableColumn>{sale.employee}</TableColumn>
                    <TableColumn>{sale.items.length} items</TableColumn>
                    <TableColumn>
                      {formatCurrency(sale.totalAmount.toFixed(2))}
                    </TableColumn>
                    <TableColumn className=" text-success-green">
                      {formatCurrency(sale.amountPaid.toFixed(2))}
                    </TableColumn>
                    <TableColumn className=" text-red-500">
                      {formatCurrency(sale.amountOwed.toFixed(2))}
                    </TableColumn>
                    <TableColumn>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillTypeColor(
                          sale.billType
                        )}`}
                      >
                        {sale.billType}
                      </span>
                    </TableColumn>
                    <TableColumn>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          sale.paymentStatus
                        )}`}
                      >
                        {sale.paymentStatus}
                      </span>
                    </TableColumn>
                    <TableColumn
                      className={` relative ${
                        "salesItem" +
                        sale?.id +
                        new Date(sale?.saleDate).getMilliseconds()
                      }`}
                    >
                      <TableMenuModal>
                        <Menus>
                          <Menus.Menu>
                            <Menus.Toggle id={sale?.id} />
                            <Menus.List
                              parent={
                                "salesItem" +
                                sale?.id +
                                new Date(sale?.saleDate).getMilliseconds()
                              }
                              id={sale?.id}
                              className="bg-white rounded-lg shadow-xl"
                            >
                              <TableMenuModal.Open opens="deplicate">
                                <Menus.Button icon={<HiSquare2Stack />}>
                                  نمایش
                                </Menus.Button>
                              </TableMenuModal.Open>

                              <TableMenuModal.Open opens="edit">
                                <Menus.Button icon={<HiPencil />}>
                                  ویرایش
                                </Menus.Button>
                              </TableMenuModal.Open>

                              <TableMenuModal.Open opens="delete">
                                <Menus.Button icon={<HiTrash />}>
                                  حذف
                                </Menus.Button>
                              </TableMenuModal.Open>
                              <TableMenuModal.Open opens="print">
                                <Menus.Button icon={<AiTwotonePrinter />}>
                                  چاپ
                                </Menus.Button>
                              </TableMenuModal.Open>
                            </Menus.List>
                          </Menus.Menu>

                          <TableMenuModal.Window name="delete" className={""}>
                            <Confirmation type="delete" />
                          </TableMenuModal.Window>
                          <TableMenuModal.Window
                            name="print"
                            className={""}
                          ></TableMenuModal.Window>
                          <TableMenuModal.Window name="edit" className={``}>
                            <Confirmation type="edit" />
                          </TableMenuModal.Window>
                        </Menus>
                      </TableMenuModal>
                    </TableColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                    <div className="w-[500px] h-[450px] p-3 bg-white"></div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">New Sale</h2>
              <button
                onClick={() => setShowAddSaleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Date *
                  </label>
                  <input
                    type="date"
                    value={newSale.saleDate}
                    onChange={(e) =>
                      setNewSale({ ...newSale, saleDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer *
                  </label>
                  <select
                    value={newSale.customer}
                    onChange={(e) =>
                      setNewSale({ ...newSale, customer: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.name}>
                        {customer.name} - {customer.company}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee *
                  </label>
                  <select
                    value={newSale.employee}
                    onChange={(e) =>
                      setNewSale({ ...newSale, employee: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} - {emp.position}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Type *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="cash"
                        checked={newSale.saleType === "cash"}
                        onChange={(e) =>
                          setNewSale({ ...newSale, saleType: e.target.value })
                        }
                        className="ml-2"
                      />
                      <span className="mr-2 text-sm">Cash</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="credit"
                        checked={newSale.saleType === "credit"}
                        onChange={(e) =>
                          setNewSale({ ...newSale, saleType: e.target.value })
                        }
                        className="ml-2"
                      />
                      <span className="mr-2 text-sm">Credit</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bill Type *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="small"
                        checked={newSale.billType === "small"}
                        onChange={(e) =>
                          setNewSale({ ...newSale, billType: e.target.value })
                        }
                        className="ml-2"
                      />
                      <span className="mr-2 text-sm">Small</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="large"
                        checked={newSale.billType === "large"}
                        onChange={(e) =>
                          setNewSale({ ...newSale, billType: e.target.value })
                        }
                        className="ml-2"
                      />
                      <span className="mr-2 text-sm">Large</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Sale Items Section */}
              <div className="border border-gray-300 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sale Items
                </h3>

                {/* Add Item Form */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Product
                    </label>
                    <input
                      type="text"
                      value={currentItem.product}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          product: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Product name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={currentItem.quantity}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentItem.unitPrice}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          unitPrice: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={addItemToSale}
                      className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {saleItems.length > 0 && (
                  <div className="border-t pt-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-2">Product</th>
                          <th className="text-right py-2">Qty</th>
                          <th className="text-right py-2">Price</th>
                          <th className="text-right py-2">Total</th>
                          <th className="text-right py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {saleItems.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 text-right">{item.product}</td>
                            <td className="py-2 text-right">{item.quantity}</td>
                            <td className="py-2 text-right">
                              ${item.unitPrice}
                            </td>
                            <td className="py-2 text-right font-semibold">
                              ${item.total.toFixed(2)}
                            </td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => removeItemFromSale(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSale.discount}
                    onChange={(e) =>
                      setNewSale({ ...newSale, discount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSale.tax}
                    onChange={(e) =>
                      setNewSale({ ...newSale, tax: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={newSale.notes}
                    onChange={(e) =>
                      setNewSale({ ...newSale, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Additional notes"
                  />
                </div>
              </div>

              {/* Sale Summary */}
              {saleItems.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Sale Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="font-semibold">
                        ${calculateSaleTotals().subtotal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Discount:</span>
                      <span className="font-semibold text-red-600">
                        -${newSale.discount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Tax ({newSale.tax}%):
                      </span>
                      <span className="font-semibold">
                        ${calculateSaleTotals().taxAmount}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Total:</span>
                        <span className="text-2xl font-bold text-amber-600">
                          ${calculateSaleTotals().total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={() => setShowAddSaleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSale}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Create Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add Customer</h2>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
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
                      setNewCustomer({ ...newCustomer, name: e.target.value })
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
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
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
                      setNewCustomer({ ...newCustomer, email: e.target.value })
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
          </div>
        </div>
      )}

      {/* Print Bill Modal */}
      {showPrintModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedSale.billType === "large"
                  ? "Large Bill"
                  : "Small Bill"}
              </h2>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div id="printable-bill" className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Khorma Trading System
                </h1>
                <p className="text-gray-600">
                  Trading & Distribution Management
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Contact: +93 700 000 000 | Email: info@khorma.com
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <p className="text-gray-700">{selectedSale.customer}</p>
                  <p className="text-sm text-gray-600">
                    Bill #: {selectedSale.billNumber}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedSale.saleDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <strong>Type:</strong> {selectedSale.billType} Bill
                  </p>
                  <p className="text-sm">
                    <strong>Payment:</strong> {selectedSale.saleType}
                  </p>
                </div>
              </div>

              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-right py-3">Item</th>
                    <th className="text-right py-3">Qty</th>
                    <th className="text-right py-3">Price</th>
                    <th className="text-right py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 text-right">{item.product}</td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">${item.unitPrice}</td>
                      <td className="py-3 text-right font-semibold">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      ${selectedSale.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-semibold text-red-600">
                      -${selectedSale.discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-semibold">
                      ${selectedSale.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t-2 border-gray-300 pt-2 mt-2">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-xl text-amber-600">
                      ${selectedSale.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center text-sm text-gray-500">
                <p>Thank you for your business!</p>
                <p className="mt-2">{selectedSale.notes}</p>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
              >
                <PrinterIcon className="h-5 w-5" />
                Print Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sale Details Modal */}
      {showDetailsModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Sale Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Bill Number
                  </h3>
                  <p className="text-lg font-semibold">
                    {selectedSale.billNumber}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="text-lg font-semibold">
                    {new Date(selectedSale.saleDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Customer
                  </h3>
                  <p className="text-lg font-semibold">
                    {selectedSale.customer}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Employee
                  </h3>
                  <p className="text-lg font-semibold">
                    {selectedSale.employee}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Bill Type
                  </h3>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getBillTypeColor(
                      selectedSale.billType
                    )}`}
                  >
                    {selectedSale.billType}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Sale Type
                  </h3>
                  <p className="text-lg font-semibold capitalize">
                    {selectedSale.saleType}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-right py-2 px-4">Product</th>
                      <th className="text-right py-2 px-4">Qty</th>
                      <th className="text-right py-2 px-4">Price</th>
                      <th className="text-right py-2 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4 text-right">{item.product}</td>
                        <td className="py-2 px-4 text-right">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-4 text-right">
                          ${item.unitPrice}
                        </td>
                        <td className="py-2 px-4 text-right font-semibold">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      ${selectedSale.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-semibold text-red-600">
                      -${selectedSale.discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span className="font-semibold">
                      ${selectedSale.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-xl text-amber-600">
                      ${selectedSale.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Paid:</span>
                    <span className="font-semibold text-green-600">
                      ${selectedSale.amountPaid.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Owed:</span>
                    <span className="font-semibold text-red-600">
                      ${selectedSale.amountOwed.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
