import {
  BanknotesIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Select from "../components/Select";
import Table from "../components/Table";
import Confirmation from "./../components/Confirmation";
import Menus from "./../components/Menu";
import SearchInput from "./../components/SearchInput";
import TableBody from "./../components/TableBody";
import TableColumn from "./../components/TableColumn";
import TableHeader from "./../components/TableHeader";
import TableMenuModal from "./../components/TableMenuModal";
import TableRow from "./../components/TableRow";

const tableHeader = [
  { title: "نمبر فاکتور" },
  { title: "تاریخ" },
  { title: "تهیه کننده" },
  { title: "جنس" },
  { title: "مقدار" },
  { title: "قیمت مجموعی" },
  { title: "پرداخت شده" },
  { title: "باقی مانده" },
  { title: "پرداخت" },
  { title: "عملیات" },
];
const historyHeader = [
  { title: "تاریخ" },
  { title: "نمبر فاکتور" },
  { title: "تهیه کننده" },
  { title: "مبلغ" },
  { title: "میتود" },
  { title: "مراجعه" },
  { title: "یادداشت" },
];
const Purchases = () => {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStatusOpen, setFilterStatusOpen] = useState(false);
  const [filterSupplier, setFilterSupplier] = useState("all");
  const [filterSupplierOpen, setFilterSupplierOpen] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [activeTab, setActiveTab] = useState("purchases"); // 'purchases', 'suppliers', 'history'

  // Modal states
  const [showAddPurchaseModal, setShowAddPurchaseModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Form states
  const [newPurchase, setNewPurchase] = useState({
    invoiceNumber: "",
    supplier: "",
    product: "",
    quantity: 0,
    unitPrice: 0,
    tax: 0,
    discount: 0,
    shippingCost: 0,
    paymentMethod: "cash",
    paymentStatus: "pending",
    notes: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    taxId: "",
    bankAccount: "",
    creditLimit: 0,
    paymentTerms: "30",
    notes: "",
  });

  // Suppliers data
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "Ahmed Hassan",
      company: "Fresh Foods Ltd",
      email: "ahmed@freshfoods.com",
      phone: "+93 700 123 456",
      address: "Kabul, Afghanistan",
      taxId: "TIN-12345",
      totalPurchases: 15,
      totalAmount: 45000,
      amountOwed: 5000,
      amountPaid: 40000,
      creditLimit: 50000,
      paymentTerms: "30 days",
      status: "active",
      lastPurchase: "2024-01-15",
    },
    {
      id: 2,
      name: "Mohammad Ali",
      company: "Grain Suppliers Inc",
      email: "ali@grainsupply.com",
      phone: "+93 700 234 567",
      address: "Herat, Afghanistan",
      taxId: "TIN-23456",
      totalPurchases: 12,
      totalAmount: 38000,
      amountOwed: 8000,
      amountPaid: 30000,
      creditLimit: 40000,
      paymentTerms: "45 days",
      status: "active",
      lastPurchase: "2024-01-14",
    },
    {
      id: 3,
      name: "Fatima Karimi",
      company: "Bakery Supplies Co",
      email: "fatima@bakerysupply.com",
      phone: "+93 700 345 678",
      address: "Mazar-i-Sharif, Afghanistan",
      taxId: "TIN-34567",
      totalPurchases: 8,
      totalAmount: 22000,
      amountOwed: 0,
      amountPaid: 22000,
      creditLimit: 30000,
      paymentTerms: "15 days",
      status: "active",
      lastPurchase: "2024-01-13",
    },
  ]);

  // Purchases data
  const [purchases, setPurchases] = useState([
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      supplier: "Fresh Foods Ltd",
      supplierId: 1,
      product: "Fresh Dates - Medjool",
      productId: 1,
      quantity: 100,
      unitPrice: 12.5,
      subtotal: 1250,
      tax: 125,
      discount: 0,
      shippingCost: 50,
      totalAmount: 1425,
      amountPaid: 1425,
      amountOwed: 0,
      purchaseDate: "2024-01-15",
      paymentDate: "2024-01-15",
      paymentMethod: "bank_transfer",
      paymentStatus: "paid",
      status: "completed",
      notes: "Bulk order for warehouse",
      createdBy: "Admin",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      supplier: "Grain Suppliers Inc",
      supplierId: 2,
      product: "Chickpeas - Organic",
      productId: 2,
      quantity: 200,
      unitPrice: 6.75,
      subtotal: 1350,
      tax: 135,
      discount: 50,
      shippingCost: 75,
      totalAmount: 1510,
      amountPaid: 510,
      amountOwed: 1000,
      purchaseDate: "2024-01-14",
      paymentDate: null,
      paymentMethod: "credit",
      paymentStatus: "partial",
      status: "pending",
      notes: "Payment in installments",
      createdBy: "Admin",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      supplier: "Bakery Supplies Co",
      supplierId: 3,
      product: "Cake Mix - Chocolate",
      productId: 3,
      quantity: 50,
      unitPrice: 10.99,
      subtotal: 549.5,
      tax: 54.95,
      discount: 20,
      shippingCost: 25,
      totalAmount: 609.45,
      amountPaid: 609.45,
      amountOwed: 0,
      purchaseDate: "2024-01-13",
      paymentDate: "2024-01-13",
      paymentMethod: "cash",
      paymentStatus: "paid",
      status: "completed",
      notes: "",
      createdBy: "Admin",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 4,
      invoiceNumber: "INV-2024-004",
      supplier: "Fresh Foods Ltd",
      supplierId: 1,
      product: "Sugar - White Granulated",
      productId: 4,
      quantity: 300,
      unitPrice: 3.25,
      subtotal: 975,
      tax: 97.5,
      discount: 0,
      shippingCost: 40,
      totalAmount: 1112.5,
      amountPaid: 0,
      amountOwed: 1112.5,
      purchaseDate: "2024-01-12",
      paymentDate: null,
      paymentMethod: "credit",
      paymentStatus: "pending",
      status: "pending",
      notes: "Payment due in 30 days",
      createdBy: "Admin",
      lastUpdated: new Date().toISOString(),
    },
  ]);

  // Payment history
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: 1,
      purchaseId: 1,
      invoiceNumber: "INV-2024-001",
      supplier: "Fresh Foods Ltd",
      amount: 1425,
      paymentMethod: "bank_transfer",
      paymentDate: "2024-01-15",
      reference: "TXN-20240115-001",
      notes: "Full payment",
    },
    {
      id: 2,
      purchaseId: 2,
      invoiceNumber: "INV-2024-002",
      supplier: "Grain Suppliers Inc",
      amount: 510,
      paymentMethod: "cash",
      paymentDate: "2024-01-14",
      reference: "TXN-20240114-001",
      notes: "Partial payment - 1st installment",
    },
    {
      id: 3,
      purchaseId: 3,
      invoiceNumber: "INV-2024-003",
      supplier: "Bakery Supplies Co",
      amount: 609.45,
      paymentMethod: "cash",
      paymentDate: "2024-01-13",
      reference: "TXN-20240113-001",
      notes: "Full payment",
    },
  ]);

  // Calculate totals
  const calculatePurchaseTotals = () => {
    const subtotal =
      Number(newPurchase.quantity) * Number(newPurchase.unitPrice);
    const taxAmount = (subtotal * Number(newPurchase.tax)) / 100;
    const total =
      subtotal +
      taxAmount -
      Number(newPurchase.discount) +
      Number(newPurchase.shippingCost);

    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
    };
  };

  // Filter purchases
  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || purchase.paymentStatus === filterStatus;

    const matchesSupplier =
      filterSupplier === "all" || purchase.supplier === filterSupplier;

    const matchesDateRange =
      (!dateRange.start || purchase.purchaseDate >= dateRange.start) &&
      (!dateRange.end || purchase.purchaseDate <= dateRange.end);

    return (
      matchesSearch && matchesStatus && matchesSupplier && matchesDateRange
    );
  });

  // Calculate statistics
  const stats = {
    totalPurchases: purchases.length,
    totalAmount: purchases.reduce((sum, p) => sum + p.totalAmount, 0),
    totalPaid: purchases.reduce((sum, p) => sum + p.amountPaid, 0),
    totalOwed: purchases.reduce((sum, p) => sum + p.amountOwed, 0),
    pendingPayments: purchases.filter((p) => p.paymentStatus === "pending")
      .length,
    completedPayments: purchases.filter((p) => p.paymentStatus === "paid")
      .length,
  };

  // Status colors
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

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Handle purchase creation
  const handleAddPurchase = () => {
    const totals = calculatePurchaseTotals();
    const purchase = {
      id: purchases.length + 1,
      ...newPurchase,
      subtotal: parseFloat(totals.subtotal),
      taxAmount: parseFloat(totals.taxAmount),
      totalAmount: parseFloat(totals.total),
      amountPaid:
        newPurchase.paymentStatus === "paid" ? parseFloat(totals.total) : 0,
      amountOwed:
        newPurchase.paymentStatus === "paid" ? 0 : parseFloat(totals.total),
      status: newPurchase.paymentStatus === "paid" ? "completed" : "pending",
      createdBy: "Admin",
      lastUpdated: new Date().toISOString(),
    };

    setPurchases([purchase, ...purchases]);
    setShowAddPurchaseModal(false);
    resetPurchaseForm();
  };

  const resetPurchaseForm = () => {
    setNewPurchase({
      invoiceNumber: "",
      supplier: "",
      product: "",
      quantity: 0,
      unitPrice: 0,
      tax: 0,
      discount: 0,
      shippingCost: 0,
      paymentMethod: "cash",
      paymentStatus: "pending",
      notes: "",
      purchaseDate: new Date().toISOString().split("T")[0],
    });
  };

  // Handle supplier creation
  const handleAddSupplier = () => {
    const supplier = {
      id: suppliers.length + 1,
      ...newSupplier,
      totalPurchases: 0,
      totalAmount: 0,
      amountOwed: 0,
      amountPaid: 0,
      status: "active",
      lastPurchase: null,
    };

    setSuppliers([...suppliers, supplier]);
    setShowSupplierModal(false);
    resetSupplierForm();
  };

  const resetSupplierForm = () => {
    setNewSupplier({
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      taxId: "",
      bankAccount: "",
      creditLimit: 0,
      paymentTerms: "30",
      notes: "",
    });
  };

  // Handle purchase deletion
  const handleDeletePurchase = (purchaseId) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      setPurchases(purchases.filter((p) => p.id !== purchaseId));
    }
  };

  // Handle purchase update
  const handleUpdatePurchase = () => {
    if (!selectedPurchase) return;

    setPurchases(
      purchases.map((p) =>
        p.id === selectedPurchase.id
          ? {
              ...selectedPurchase,
              lastUpdated: new Date().toISOString(),
            }
          : p
      )
    );

    setShowEditModal(false);
    setSelectedPurchase(null);
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت خرید</h1>
          <p className="text-gray-600 mt-2">
            پیدا کردن خرید، مدیریت تامین کننده ها و مانتور کردن پرداخت ها
          </p>
        </div>
        <div className="flex w-[300px] gap-3">
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
              <Button className=" bg-deepdate-400">اضافه کردن خرید</Button>
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
              <p className="text-sm text-gray-600">مجموع خرید</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalPurchases}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مجموع کل</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.totalAmount.toFixed(2)}
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
              <p className="text-sm text-gray-600">مبلغ پرداخت شده</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${stats.totalPaid.toFixed(2)}
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
              <p className="text-sm text-gray-600">مبلغ باقی مانده</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                ${stats.totalOwed.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("purchases")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "purchases"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ClipboardDocumentListIcon className="h-5 w-5" />
              خرید
            </button>
            <button
              onClick={() => setActiveTab("suppliers")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "suppliers"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <UserGroupIcon className="h-5 w-5" />
              تهیه کننده ({suppliers.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "history"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ChartBarIcon className="h-5 w-5" />
              تاریخچه چرداخت ها
            </button>
          </nav>
        </div>

        {/* Purchases Tab */}
        {activeTab === "purchases" && (
          <div className="p-6">
            {/* Filters */}
            {/* <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search purchases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial Payment</option>
                  <option value="pending">Pending Payment</option>
                </select>

                <select
                  value={filterSupplier}
                  onChange={(e) => setFilterSupplier(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="all">All Suppliers</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.company}>
                      {supplier.company}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowSupplierModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Add Supplier
                </button>
              </div>
            </div> */}

            {/* Purchases Table */}

            <Table
              firstRow={
                <div className=" w-full flex gap-1 justify-around  ">
                  <div className="flex-1 flex items-center justify-start">
                    <SearchInput placeholder="لطفا جستجو کنید" />
                  </div>
                  <div className="flex-1">
                    <Select
                      placeholder="تهیه کننده"
                      options={[
                        { value: " تمام تهیه کننده" },
                        { value: "غذا ها" },
                        { value: "انواع" },
                        { value: "تعداد" },
                        { value: "نان" },
                      ]}
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      placeholder=" تمام حالات"
                      options={[
                        { value: "پرداخت شده ها" },
                        { value: " پرداخت ها نسبی" },
                        { value: "پرداخت ها معلق" },
                      ]}
                    />
                  </div>
                  <div className="flex-1 flex items-center">
                    <Modal>
                      <Modal.Toggle>
                        <Button className="py-[14px] bg-success-green">
                          اضافه کردن تهیه کننده
                        </Button>
                      </Modal.Toggle>
                      <Modal.Window>
                        <div className="w-[500px] h-[450px] p-3 bg-white"></div>
                      </Modal.Window>
                    </Modal>
                  </div>
                </div>
              }
            >
              <TableHeader headerData={tableHeader} />
              <TableBody>
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-lg font-medium">
                          No purchases found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.invoiceNumber}>
                      <TableColumn>{purchase.invoiceNumber}</TableColumn>
                      <TableColumn>
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </TableColumn>
                      <TableColumn>{purchase.supplier}</TableColumn>
                      <TableColumn>{purchase.product}</TableColumn>
                      <TableColumn>{purchase.quantity}</TableColumn>
                      <TableColumn>
                        {purchase.totalAmount.toFixed(2)}
                      </TableColumn>
                      <TableColumn>
                        {purchase.amountPaid.toFixed(2)}
                      </TableColumn>
                      <TableColumn>
                        {purchase.amountOwed.toFixed(2)}
                      </TableColumn>
                      <TableColumn>{purchase.paymentMethod}</TableColumn>
                      <TableColumn
                        className={` relative ${
                          "pur234chase" +
                          purchase?.invoiceNumber +
                          new Date(purchase?.paymentDate).getMilliseconds()
                        }`}
                      >
                        <TableMenuModal>
                          <Menus>
                            <Menus.Menu>
                              <Menus.Toggle id={purchase?.invoiceNumber} />
                              <Menus.List
                                parent={
                                  "pur234chase" +
                                  purchase?.invoiceNumber +
                                  new Date(
                                    purchase?.paymentDate
                                  ).getMilliseconds()
                                }
                                id={purchase?.invoiceNumber}
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
                              </Menus.List>
                            </Menus.Menu>

                            <TableMenuModal.Window name="delete" className={""}>
                              <Confirmation type="delete" />
                            </TableMenuModal.Window>
                            <TableMenuModal.Window name="edit" className={``}>
                              <Confirmation type="edit" />
                            </TableMenuModal.Window>
                          </Menus>
                        </TableMenuModal>
                      </TableColumn>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Suppliers Tab */}
        {activeTab === "suppliers" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <SupplierComponent supplier={supplier} key={supplier.id} />
              ))}
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === "history" && (
          <div className="p-6">
            <div className="overflow-x-auto -mx-6 px-6">
              <Table>
                <TableHeader headerData={historyHeader} />
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow>
                      <TableColumn>{payment.paymentDate}</TableColumn>
                      <TableColumn>{payment.invoiceNumber}</TableColumn>
                      <TableColumn>{payment.supplier}</TableColumn>
                      <TableColumn className={"text-green-600"}>
                        {" "}
                        ${payment.amount.toFixed(2)}
                      </TableColumn>
                      <TableColumn>
                        {payment.paymentMethod.replace("_", " ")}
                      </TableColumn>
                      <TableColumn>{payment.reference}</TableColumn>
                      <TableColumn>{payment.notes}</TableColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Method
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.supplier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold ">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {payment.paymentMethod.replace("_", " ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.reference}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {payment.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
            </div>
          </div>
        )}
      </div>

      {/* Add Purchase Modal */}
      {showAddPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Add New Purchase
              </h2>
              <button
                onClick={() => setShowAddPurchaseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Number *
                  </label>
                  <input
                    type="text"
                    value={newPurchase.invoiceNumber}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        invoiceNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="INV-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date *
                  </label>
                  <input
                    type="date"
                    value={newPurchase.purchaseDate}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        purchaseDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier *
                  </label>
                  <select
                    value={newPurchase.supplier}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        supplier: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.company}>
                        {supplier.company}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product *
                  </label>
                  <input
                    type="text"
                    value={newPurchase.product}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        product: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={newPurchase.quantity}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        quantity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPurchase.unitPrice}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        unitPrice: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPurchase.tax}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        tax: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPurchase.discount}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        discount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPurchase.shippingCost}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        shippingCost: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={newPurchase.paymentMethod}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status *
                  </label>
                  <select
                    value={newPurchase.paymentStatus}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        paymentStatus: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partial Payment</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newPurchase.notes}
                    onChange={(e) =>
                      setNewPurchase({
                        ...newPurchase,
                        notes: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Additional notes..."
                  ></textarea>
                </div>
              </div>

              {/* Purchase Summary */}
              {newPurchase.quantity > 0 && newPurchase.unitPrice > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Purchase Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-gray-900">
                        ${calculatePurchaseTotals().subtotal}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Tax ({newPurchase.tax}%):
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${calculatePurchaseTotals().taxAmount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold text-red-600">
                        -${newPurchase.discount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold text-gray-900">
                        ${newPurchase.shippingCost}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-300">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">
                          Total Amount:
                        </span>
                        <span className="text-xl font-bold text-amber-600">
                          ${calculatePurchaseTotals().total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setShowAddPurchaseModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPurchase}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Add Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Add New Supplier
              </h2>
              <button
                onClick={() => setShowSupplierModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={newSupplier.name}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ahmed Hassan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={newSupplier.company}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        company: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Company Name Ltd"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newSupplier.email}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={newSupplier.phone}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+93 700 123 456"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newSupplier.address}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    value={newSupplier.taxId}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        taxId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="TIN-12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Account
                  </label>
                  <input
                    type="text"
                    value={newSupplier.bankAccount}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        bankAccount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Account number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Limit ($)
                  </label>
                  <input
                    type="number"
                    value={newSupplier.creditLimit}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        creditLimit: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms (days)
                  </label>
                  <select
                    value={newSupplier.paymentTerms}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        paymentTerms: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="15">15 days</option>
                    <option value="30">30 days</option>
                    <option value="45">45 days</option>
                    <option value="60">60 days</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newSupplier.notes}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        notes: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Additional notes..."
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setShowSupplierModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSupplier}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Add Supplier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Details Modal */}
      {showDetailsModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Purchase Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Invoice Number
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPurchase.invoiceNumber}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Purchase Date
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(
                      selectedPurchase.purchaseDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Supplier
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPurchase.supplier}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Product
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPurchase.product}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Quantity
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPurchase.quantity} units
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Unit Price
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedPurchase.unitPrice}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Subtotal
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedPurchase.subtotal.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Tax
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedPurchase.tax.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Discount
                  </h3>
                  <p className="text-lg font-semibold text-red-600">
                    -${selectedPurchase.discount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Shipping Cost
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedPurchase.shippingCost.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Total Amount
                  </h3>
                  <p className="text-2xl font-bold text-amber-600">
                    ${selectedPurchase.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Payment Status
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                      selectedPurchase.paymentStatus
                    )}`}
                  >
                    {selectedPurchase.paymentStatus}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Amount Paid
                  </h3>
                  <p className="text-lg font-semibold text-green-600">
                    ${selectedPurchase.amountPaid.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Amount Owed
                  </h3>
                  <p className="text-lg font-semibold text-red-600">
                    ${selectedPurchase.amountOwed.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Payment Method
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {selectedPurchase.paymentMethod.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Created By
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPurchase.createdBy}
                  </p>
                </div>
                {selectedPurchase.notes && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Notes
                    </h3>
                    <p className="text-gray-900">{selectedPurchase.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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

const SupplierComponent = ({ supplier }) => {
  return (
    <div
      key={supplier.id}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-3 rounded-full">
            <UserGroupIcon className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {supplier.name}
            </h3>
            <p className="text-sm text-gray-600">{supplier.company}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">مجموعی خرید:</span>
          <span className="font-semibold text-gray-900">
            {supplier.totalPurchases}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">مجموعی قیمت:</span>
          <span className="font-semibold text-gray-900">
            ${supplier.totalAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">مبلغ پرداختی:</span>
          <span className="font-semibold text-green-600">
            ${supplier.amountPaid.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">مبلغ باقی مانده:</span>
          <span className="font-semibold text-red-600">
            ${supplier.amountOwed.toLocaleString()}
          </span>
        </div>
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Credit Limit:</span>
            <span>${supplier.creditLimit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Payment Terms:</span>
            <span>{supplier.paymentTerms}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          className=" bg-warning-orange"
          // onClick={() => {
          //   setSelectedSupplier(supplier);
          //   setShowDetailsModal(true);
          // }}
        >
          دیدن جزئیات
        </Button>
        <Button className=" bg-success-green">تماس</Button>
      </div>
    </div>
  );
};
export default Purchases;
