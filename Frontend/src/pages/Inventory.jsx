import { BsFillEyeFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import {
  ArrowPathIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ProductForm from "../components/ProductForm";
import Table from "../components/Table";
import TableBody from "../components/TableBody";
import TableColumn from "../components/TableColumn";
import TableHeader from "../components/TableHeader";
import TableRow from "../components/TableRow";
import {
  useCreateProdcut,
  useProduct,
  useInventoryStats,
  useStoreStocks,
  useStockTransfers,
  useStockTransferDelete,
} from "../services/useApi";
import Product from "./Product";
import Store from "./Store";
import Warehouse from "./Warehouse";
import { BiLoaderAlt } from "react-icons/bi";
import GloableModal from "../components/GloableModal";
import Confirmation from "../components/Confirmation";
import { useSearchParams } from "react-router-dom";

const Inventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openConfirm, setOpenConfirm] = useState(false);
  const { register, handleSubmit, formState, reset, control } = useForm();
  const { isLoading: isLoadingProducts } = useProduct();
  const { mutate: deleteStockTransfer } = useStockTransferDelete();
  const [id, setIds] = useState();
  const { data: inventoryStats, isLoading: isStatsLoading } =
    useInventoryStats();
  const { mutate: createProduct } = useCreateProdcut();
  const handleDelete = () => {
    deleteStockTransfer(id);
    setOpenConfirm(false);
  };
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
  const [activeTab, setActiveTab] = useState("all");

  // Stock transfer history
  const { data: transferHistoryData } = useStockTransfers();

  // Use backend stats
  const stats = inventoryStats?.data || {
    totalProducts: 0,
    warehouse: { totalQuantity: 0, totalValue: 0, uniqueProducts: 0 },
    store: { totalQuantity: 0, totalValue: 0, uniqueProducts: 0 },
    lowStockItems: 0,
  };
  useEffect(
    function () {
      activeTab === "warehouse"
        ? searchParams.set("location", "warehouse")
        : searchParams.delete("location");
      setSearchParams(searchParams);
    },
    [activeTab, searchParams, setSearchParams]
  );
  if (isLoadingProducts || isStatsLoading)
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
              <AddProductForm />
            </Modal.Window>
          </Modal>
        </div>
      </div>

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
                {stats.warehouse.totalQuantity}
              </p>
              <p className="text-sm text-gray-500">
                {stats.warehouse.uniqueProducts} محصول
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
                {stats.store.totalQuantity}
              </p>
              <p className="text-sm text-gray-500">
                {stats.store.uniqueProducts} محصول
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
              <p className="text-sm text-gray-600">کمبود موجودی</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {stats.lowStockItems}
              </p>
              <p className="text-sm text-gray-500">محصول نیاز به خرید</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
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

        {activeTab === "all" && <Product />}
        {activeTab === "warehouse" && (
          <div className="overflow-x-auto  -mx-6 px-6">
            <Warehouse />
          </div>
        )}
        {activeTab === "store" && (
          <div className="overflow-x-auto  -mx-6 px-6">
            <Store />
          </div>
        )}
      </div>

      {/* Stock Transfer History */}
      {activeTab !== "all" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"></h3>
          <ArrowPathIcon className="h-6 w-6 text-amber-600" />
          انتقالات اخیر موجودی
          <div className="overflow-x-auto h-auto -mx-6 px-6 ">
            <Table>
              <TableHeader
                headerData={[
                  { title: "جنس" },
                  { title: "تعداد" },
                  { title: "مکان گیرنده" },
                  { title: "تاریخ" },
                  { title: "کارمند" },
                  { title: "عملیات" },
                ]}
              />
              <TableBody>
                {transferHistoryData?.data
                  ?.filter((transfer) => {
                    if (activeTab === "store") {
                      return transfer.fromLocation?.toLowerCase() === "store";
                    } else if (activeTab === "warehouse") {
                      return (
                        transfer.fromLocation?.toLowerCase() === "warehouse"
                      );
                    }
                    return true; // Show all for "all" tab
                  })
                  ?.map((transfer) => (
                    <TableRow key={transfer._id}>
                      <TableColumn>
                        {transfer.product?.name || "N/A"}
                      </TableColumn>
                      <TableColumn>{transfer.quantity}</TableColumn>

                      <TableColumn className=" text-purple-600">
                        <p className=" p-1 bg-purple-300/50 rounded-full">
                          {transfer.toLocation}
                        </p>
                      </TableColumn>
                      <TableColumn>
                        {transfer?.transferDate
                          ? new Date(transfer.transferDate).toLocaleDateString(
                              "fa-IR"
                            )
                          : "—"}
                      </TableColumn>
                      <TableColumn>
                        {transfer.transferredBy?.name ||
                          transfer.transferredBy.email}
                      </TableColumn>
                      <TableColumn>
                        <div className=" w-full flex justify-between items-center">
                          <button
                            className=" rounded-full p-1.5 hover:bg-red-100 transition-all duration-100 "
                            onClick={() => {
                              setIds(transfer?._id);
                              setOpenConfirm(true);
                            }}
                          >
                            <MdDelete className=" text-lg text-red-500 " />
                          </button>
                          <button className=" rounded-full p-1.5 hover:bg-sky-100 transition-all duration-100">
                            <FiEdit className=" text-lg  text-sky-500 " />
                          </button>
                          <button className=" p-1.5 hover:b">
                            <BsFillEyeFill className=" rounded-full text-lg text-blue-400 hover:bg-blue-100 transition-all duration-100 " />
                          </button>
                        </div>
                      </TableColumn>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <GloableModal open={openConfirm} setOpen={setOpenConfirm}>
              {openConfirm && (
                <Confirmation
                  type="transfer"
                  handleClick={handleDelete}
                  handleCancel={() => setOpenConfirm(false)}
                  close={() => setOpenConfirm(false)}
                />
              )}
            </GloableModal>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
