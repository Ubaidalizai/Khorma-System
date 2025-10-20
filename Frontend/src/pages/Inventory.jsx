import {
  ArrowPathIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toJalaali } from "jalaali-js";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import NumberInput from "../components/NumberInput";
import ProductForm from "../components/ProductForm";
import Select from "../components/Select";
import Table from "../components/Table";
import TableBody from "../components/TableBody";
import TableColumn from "../components/TableColumn";
import TableHeader from "../components/TableHeader";
import TableRow from "../components/TableRow";
import TextArea from "../components/TextArea";
import { useCreateProdcut, useInventory, useProduct } from "../services/useApi";
import {
  fetchProducts,
  createProduct as createProductAPI,
} from "../services/apiUtiles";
import Product from "./Product";
import Store from "./Store";
import Warehouse from "./Warehouse";
import { BiLoaderAlt } from "react-icons/bi";

const getStatusColor = (status) => {
  switch (status) {
    case "موجود":
      return "bg-green-100 text-green-800 border border-green-200";
    case "کمبود موجودی":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "Out of Stock":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

const Inventory = () => {
  const { register, handleSubmit, formState, reset, control } = useForm();
  const { data: totalProdcut } = useProduct();
  const { data: productList, isLoadingProduct } = useProduct();
  const { mutate: createProduct } = useCreateProdcut();
  function AddProductForm({ close }) {
    const onSubmit = async (data) => {
      createProduct({ ...data });
      if (typeof close === "function") close();
      reset();
    };
    return (
      <ProductForm
        register={register}
        handleSubmit={handleSubmit(onSubmit)}
        formState={formState}
        control={control}
        onClose={close}
      />
    );
  }
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  // Selected product and transfer state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transferQuantity, setTransferQuantity] = useState("");

  // Inventory (stock) data
  const { data: products, isLoading: IsInventoryIsLoading } = useInventory();

  // Stock transfer history
  const [transferHistory, setTransferHistory] = useState([]);

  // Calculate stock status
  const calculateStockStatus = (product) => {
    const totalStock = product.warehouseStock + product.storeStock;
    if (totalStock === 0) return "موجود";
    if (totalStock <= product.minStockLevel) return "کمبود موجودی";
    return "In Stock";
  };

  // Update product status on mount
  // setTransferHistory([
  //       {
  //         id: 12 + 1,
  //         productName: "Kandom",
  //         quantity: 12,
  //         from: "Warehouse",
  //         to: "Store",
  //         date: new Date().toISOString(),
  //         performedBy: "Admin",
  //       },
  //     ]);
  // Real-time stock tracking simulation (updates every 30 seconds)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setProducts((prevProducts) =>
  //       prevProducts.map((product) => ({
  //         ...product,
  //         lastUpdated: new Date().toISOString(),
  //       }))
  //     );
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, []);

  // Get alerts
  const getLowStockAlerts = () => {
    return products?.data?.filter((p) => {
      const total = p.warehouseStock + p.storeStock;
      return total > 0 && total <= p.minStockLevel;
    });
  };

  const getOutOfStockItems = () => {
    return products?.data?.filter(
      (p) => p?.warehouseStock === 0 && p?.storeStock === 0
    );
  };

  // Filter products
  const filteredProducts = products?.data?.filter((product) => {
    // const matchesSearch =
    //   product.name.includes(searchTerm.toLowerCase())
    // product.sku.includes(searchTerm.toLowerCase()) ||
    // product.category.includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      product.status.toLowerCase().includes(filterType.toLowerCase());

    let matchesTab = true;
    if (activeTab === "warehouse") {
      matchesTab = product.warehouseStock > 0;
    } else if (activeTab === "store") {
      matchesTab = product.storeStock > 0;
    }

    // return matchesSearch && matchesFilter && matchesTab;
  });

  // Split stocks by location to match Backend stock.model.js
  const warehouseStocks = products?.data?.filter((s) => s?.location === "warehouse");
  const storeStocks = products?.data?.filter((s) => s?.location === "store");

  // Calculate statistics
  const stats = {
    totalProducts: totalProdcut?.length || 0,
    totalWarehouseStock:
      products?.data?.reduce((sum, p) => sum + p.warehouseStock, 0) || 0,
    totalStoreStock:
      products?.data?.reduce((sum, p) => sum + p.storeStock, 0) || 0,
    totalValue:
      products?.data?.reduce(
        (sum, p) => sum + (p.warehouseStock + p.storeStock) * p.unitPrice,
        0
      ) || 0,
  };
  if (IsInventoryIsLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <BiLoaderAlt className=" text-2xl animate-spin" />
      </div>
    );
  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت موجودی</h1>
          <p className="text-gray-600 mt-2">
            مدیریت کردن تمام دیتا های و نماینده گی های تان
          </p>
        </div>
        <div className=" w-[200px] ">
          <Modal>
            <Modal.Toggle>
              <Button icon={<PlusIcon className="h-5 w-5" />}>
                اضافه کردن جنس
              </Button>
            </Modal.Toggle>
            <Modal.Window>
              {/* AddProductForm will receive `close` injected by Modal.Window */}
              <AddProductForm />
            </Modal.Window>
          </Modal>
        </div>
      </div>
      {/* Stock Alerts Section */}
      {(getLowStockAlerts()?.length > 0 ||
        getOutOfStockItems()?.length > 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
            هشتدار موجودی
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getLowStockAlerts().length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  موجودی باقی مانده ({getLowStockAlerts().length})
                </h4>
                <ul className="space-y-2">
                  {getLowStockAlerts().map((product) => (
                    <li
                      key={product.id}
                      className="text-sm text-yellow-700 flex justify-between"
                    >
                      <span>{product.name}</span>
                      <span className="font-semibold">
                        {product.warehouseStock + product.storeStock} units
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {getOutOfStockItems().length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <XCircleIcon className="h-5 w-5" />
                  موجودی تمام شده ({getOutOfStockItems().length})
                </h4>
                <ul className="space-y-2">
                  {getOutOfStockItems().map((product) => (
                    <li key={product.id} className="text-sm text-red-700">
                      {product.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">تمام اجناس</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalProducts}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">موجودی گدام</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalWarehouseStock}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BuildingOffice2Icon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">موجودی فروشگاه</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalStoreStock}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BuildingStorefrontIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مجموع قیمت</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.totalValue.toFixed(2)}
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "all"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              تمام اجناس
            </button>
            <button
              onClick={() => setActiveTab("warehouse")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "warehouse"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BuildingOffice2Icon className="h-5 w-5" />
              گدام
            </button>
            <button
              onClick={() => setActiveTab("store")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "store"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BuildingStorefrontIcon className="h-5 w-5" />
              فروشگاه
            </button>
          </nav>
        </div>

        {activeTab === "all" && <Product properties={productList?.products} />} 
        {activeTab === "warehouse" && (
          <div className="overflow-x-auto  -mx-6 px-6">
            <Warehouse
              getStatusColor={getStatusColor}
              warehouses={warehouseStocks}
              isLoading={IsInventoryIsLoading}
            />
          </div>
        )}
        {activeTab === "store" && (
          <div className="overflow-x-auto  -mx-6 px-6">
            <Store stocks={storeStocks} isLoading={IsInventoryIsLoading} />
          </div>
        )}
      </div>

      {/* Stock Transfer History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowPathIcon className="h-6 w-6 text-amber-600" />
          انتقالات اخیر موجودی
        </h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <Table>
            <TableHeader
              headerData={[
                { title: "جنس" },
                { title: "فرستنده" },
                { title: "گیرنده" },
                { title: "تاریخ" },
                { title: "اجرا کننده" },
              ]}
            >
              <TableBody>
                {transferHistory.map((transfer) => (
                  <TableRow>
                    <TableColumn>{transfer.productName} units</TableColumn>
                    <TableColumn>
                      <BuildingOffice2Icon className="h-4 w-4" />
                      {transfer.from}
                    </TableColumn>
                    <TableColumn>
                      <BuildingStorefrontIcon className="h-4 w-4" />
                      {transfer.to}
                    </TableColumn>
                    <TableColumn>
                      {new Date(transfer.date).toLocaleString()}
                    </TableColumn>
                    <TableColumn>{transfer.performedBy}</TableColumn>
                  </TableRow>
                ))}
              </TableBody>
            </TableHeader>
          </Table>
        </div>
      </div>

      {/* Transfer Stock Modal */}
      {/* {showTransferModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Transfer Stock
              </h2>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedProduct.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available in Warehouse</p>
                <p className="text-2xl font-bold text-purple-600">
                  {selectedProduct.warehouseStock} units
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Transfer *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.warehouseStock}
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Transfer Direction:</strong> Warehouse → Store
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedProduct(null);
                  setTransferQuantity("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStockTransfer}
                disabled={
                  !transferQuantity ||
                  transferQuantity <= 0 ||
                  transferQuantity > selectedProduct.warehouseStock
                }
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Transfer Stock
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Inventory;
