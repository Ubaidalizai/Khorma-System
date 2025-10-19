import {
  BanknotesIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import Modal from "../components/Modal";
import PaymentHistory from "../components/PaymentHistory";
import Purchase from "../components/Purchase";
import PurchaseForm from "../components/PurchaseForm";
import Spinner from "../components/Spinner";
import {
  useCreatePurchase,
  usePurchases,
  useSuppliers,
} from "../services/useApi";
import { formatCurrency } from "../utilies/helper";
import { createPurchase as createPurchaseAPI } from "../services/apiUtiles";

const Purchases = () => {
  const { data: suppliers, isLoading: isSupplierLoading } = useSuppliers();
  const { data: purchases } = usePurchases();
  const { mutate: createPurchase } = useCreatePurchase();
  const { register, handleSubmit, watch, reset } = useForm();
  const [currentItem, setCurrentItem] = useState({
    product: "",
    unit: "",
    batchNumber: "",
    quantity: 0,
    unitPrice: 0,
    total: 0,
  });
  const [items, setItems] = useState([]);
  // Search and filter states
  // const [searchTerm, setSearchTerm] = useState("");

  // const [filterStatus, setFilterStatus] = useState("all");
  // const [filterStatusOpen, setFilterStatusOpen] = useState(false);
  // const [filterSupplier, setFilterSupplier] = useState("all");
  // const [filterSupplierOpen, setFilterSupplierOpen] = useState("all");
  // const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [activeTab, setActiveTab] = useState("purchases"); // 'purchases', 'suppliers', 'history'
  const onSubmit = async (data) => {
    try {
      await createPurchaseAPI(data);
      // Refresh the purchases list
      window.location.reload();
    } catch (error) {
      console.error("Failed to create purchase:", error);
    }
  };

  // Payment history
  const [paymentHistory] = useState([
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

  const calculatePurchaseTotals = () => {
    const totalProductPrice = items?.reduce((pre, curr) => pre + curr.total, 0);

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = watch("discount");
    const taxAmount =
      ((subtotal - discountAmount) * Number(watch("tax"))) / 100;
    const total = totalProductPrice - discountAmount + taxAmount;

    taxAmount - Number(watch("discount")) + Number(watch("shippingCost"));

    return {
      subtotal: subtotal,
      taxAmount: taxAmount,
      total: total,
    };
  };
  // Filter purchases
  // const filteredPurchases = purchases?.filter((purchase) => {
  //   const matchesSearch =
  //     purchase?.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     purchase?.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     purchase?.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesStatus =
  //     filterStatus === "all" || purchase?.paymentStatus === filterStatus;

  //   const matchesSupplier =
  //     filterSupplier === "all" || purchase?.supplier === filterSupplier;

  //   const matchesDateRange =
  //     (!dateRange.start || purchase?.purchaseDate >= dateRange.start) &&
  //     (!dateRange.end || purchase?.purchaseDate <= dateRange.end);

  //   return (
  //     matchesSearch && matchesStatus && matchesSupplier && matchesDateRange
  //   );
  // });

  // Calculate statistics
  const stats = {
    totalPurchases: purchases?.data?.length,
    totalAmount: purchases?.data?.reduce((sum, p) => sum + p.totalAmount, 0),
    totalPaid: purchases?.data?.reduce((sum, p) => sum + p.paidAmount, 0),
    totalOwed: purchases?.data?.reduce((sum, p) => sum + p.dueAmount, 0),
    pendingPayments: purchases?.data?.filter((p) => p.paymentStatus === "pending")
      .length,
    completedPayments: purchases?.data?.filter((p) => p.paymentStatus === "paid")
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

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "completed":
  //       return "bg-green-100 text-green-800 border border-green-200";
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  //     case "cancelled":
  //       return "bg-red-100 text-red-800 border border-red-200";
  //     default:
  //       return "bg-gray-100 text-gray-800 border border-gray-200";
  //   }
  // };

  return (
    <div className='space-y-6 w-full max-w-full overflow-x-hidden'>
      {/* Page header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>مدیریت خرید</h1>
          <p className='text-gray-600 mt-2'>
            پیدا کردن خرید، مدیریت تامین کننده ها و مانتور کردن پرداخت ها
          </p>
        </div>
        <div className='flex w-[300px] gap-3'>
          <Modal>
            <Modal.Toggle id='export'>
              <Button className=' bg-success-green'>خروجی</Button>
            </Modal.Toggle>
            <Modal.Window name='export'>
              <div className='w-[400px] h-[300px] bg-white'></div>
            </Modal.Window>
          </Modal>
          <Modal>
            <Modal.Toggle id='addPurchase'>
              <Button className=' bg-deepdate-400'>اضافه کردن خرید</Button>
            </Modal.Toggle>
            <Modal.Window name='addPurchase'>
              <PurchaseForm
                register={register}
                watch={watch}
                handleSubmit={handleSubmit(onSubmit)}
                reset={reset}
                createPurchase={createPurchase}
                calculatePurchaseTotals={calculatePurchaseTotals}
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                items={items}
                setItems={setItems}
                close={() => document.getElementById("addPurchase").click()}
              />
            </Modal.Window>
          </Modal>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>مجموع خرید</p>
              <p className='text-2xl font-bold text-gray-900 mt-1'>
                {stats.totalPurchases}
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
              <p className="text-sm text-gray-600">مجموع کل</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(Number(stats?.totalAmount).toFixed(2))}
              </p>
            </div>
            <div className='bg-purple-100 p-3 rounded-lg'>
              <CurrencyDollarIcon className='h-6 w-6 text-purple-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className="text-sm text-gray-600">مبلغ پرداخت شده</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(stats.totalPaid?.toFixed(2))}
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
              <p className="text-sm text-gray-600">مبلغ باقی مانده</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(stats.totalOwed?.toFixed(2))}
              </p>
            </div>
            <div className='bg-red-100 p-3 rounded-lg'>
              <DocumentTextIcon className='h-6 w-6 text-red-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='border-b border-gray-200'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab("purchases")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "purchases"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ClipboardDocumentListIcon className='h-5 w-5' />
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
              <UserGroupIcon className='h-5 w-5' />
              تهیه کننده ({suppliers?.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "history"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ChartBarIcon className='h-5 w-5' />
              تاریخچه چرداخت ها
            </button>
          </nav>
        </div>

        {/* Purchases Tab */}
        {activeTab === "purchases" && (
          <div className='p-6'>
            <Purchase getPaymentStatusColor={getPaymentStatusColor} />
          </div>
        )}

        {/* Suppliers Tab */}
        {activeTab === "suppliers" && (
          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {isSupplierLoading ? (
                <Spinner />
              ) : (
                suppliers?.map((supplier) => (
                  <SupplierComponent supplier={supplier} key={supplier.id} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === "history" && (
          <div className='p-6'>
            <div className='overflow-x-auto -mx-6 px-6'>
              <PaymentHistory paymentHistory={paymentHistory} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SupplierComponent = ({ supplier }) => {
  return (
    <div
      key={supplier.id}
      className='bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'
    >
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-amber-100 p-3 rounded-full'>
            <UserGroupIcon className='h-6 w-6 text-amber-600' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>
              {supplier.name}
            </h3>
            <p className='text-sm text-gray-600'>{supplier.company}</p>
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>مجموعی خرید:</span>
          <span className='font-semibold text-gray-900'>
            {supplier.totalPurchases}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">مجموعی قیمت:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(supplier?.totalAmount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">مبلغ پرداختی:</span>
          <span className="font-semibold text-green-600">
            ${supplier?.amountPaid}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">مبلغ باقی مانده:</span>
          <span className="font-semibold text-red-600">
            {formatCurrency(supplier?.amountOwed)}
          </span>
        </div>
        <div className='pt-3 border-t border-gray-200'>
          <div className='flex justify-between text-xs text-gray-500'>
            <span>Credit Limit:</span>
            <span>${supplier?.creditLimit}</span>
          </div>
          <div className='flex justify-between text-xs text-gray-500 mt-1'>
            <span>Payment Terms:</span>
            <span>{supplier.paymentTerms}</span>
          </div>
        </div>
      </div>

      <div className='mt-4 flex gap-2'>
        <Button
          className=' bg-warning-orange'
          // onClick={() => {
          //   setSelectedSupplier(supplier);
          //   setShowDetailsModal(true);
          // }}
        >
          دیدن جزئیات
        </Button>
        <Button className=' bg-success-green'>تماس</Button>
      </div>
    </div>
  );
};
export default Purchases;
