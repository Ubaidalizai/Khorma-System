import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiLoaderAlt, BiPencil, BiTransferAlt } from "react-icons/bi";
import { CgEye } from "react-icons/cg";
import Button from "../components/Button";
import Confirmation from "../components/Confirmation";
import GloableModal from "../components/GloableModal";
import SearchInput from "../components/SearchInput";
import Table from "../components/Table";
import TableBody from "../components/TableBody";
import TableColumn from "../components/TableColumn";
import TableHeader from "../components/TableHeader";
import TableRow from "../components/TableRow";
import WarehouseForm from "../components/WarehouseForm";
import {
  useCreateStockTransfer,
  useEmployees,
  useUpdateStore,
  useWarehouseStocks,
} from "../services/useApi";
import { getStatusColor, getStockStatus } from "../utilies/stockStatus";
import { inputStyle } from "./../components/ProductForm";

// Headers aligned with Backend stock.model.js
const tableHeader = [
  { title: "محصول" },
  { title: "نمبر بچ" },
  { title: "واحد" },
  { title: "موقعیت" },
  { title: "تاریخ انقضا" },
  { title: "قیمت خرید/واحد" },
  { title: "تعداد" },
  { title: "حالت" },
  { title: "عملیات" },
];
function Warehouse() {
  const { control, handleSubmit, reset } = useForm();
  const { mutate: updateInventory } = useUpdateStore();
  const [showTransfer, setShowTransfer] = useState(false);
  const transferForm = useForm();
  const { register, watch } = transferForm;
  const [show, setShow] = useState(false);
  const [selectedPro, setSelectedPro] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [search] = useState("");
  const { mutate: createStockTransfer } = useCreateStockTransfer();
  const { data: warehouseData, isLoading } = useWarehouseStocks({ search });
  const warehouses = warehouseData?.data || warehouseData || [];

  const transferType = watch("transferType") || "warehouse-store";
  const quantity = watch("quantity");
  const employee = watch("employee");
  const [showTransferConf, setShwoTransferConf] = useState(false);

  const { data: employees } = useEmployees();
  // Example fromLocation/toLocation logic
  let fromLocation = selectedPro?.location;
  let toLocation =
    transferType === "warehouse-store"
      ? fromLocation === "store"
        ? "warehouse"
        : "store"
      : transferType === "warehouse-employee"
      ? "employee"
      : transferType === "employee-store"
      ? "store"
      : transferType === "warehouse-employee"
      ? "employee"
      : transferType === "employee-warehouse"
      ? "warehouse"
      : "unknown";

  const needsEmployee = [
    "warehouse-employee",
    "employee-warehouse",
    "store-employee",
    "employee-store",
  ].includes(transferType);
  function onSubmit(data) {
    if (!data.quantity || data.quantity <= 0) return;
    setShwoTransferConf(true);
  }
  function confirmTransfer() {
    const stockTransfer = {
      product: selectedPro.product?._id || selectedPro.product,
      fromLocation: fromLocation,
      toLocation: toLocation,
      employee: needsEmployee ? employee : undefined,
      quantity: Number(quantity),
      notes: "", // optional notes
    };
    createStockTransfer(stockTransfer, {
      onSuccess: () => {
        setShowTransfer(false);
        setShwoTransferConf(false);
      },
      onError: () => {
        // Error toast is handled in the hook
      },
    });
  }

  useEffect(
    function () {
      reset({ ...selectedPro });
    },
    [selectedPro, reset]
  );
  const onSubmitEdit = (data) => {
    console.log(data);
    updateInventory({ id: selectedPro.id, ...data });
    setShowEdit(false);
  };
  if (isLoading)
    return (
      <div className=" w-full h-[250px] flex justify-center items-center">
        <BiLoaderAlt className=" text-2xl animate-spin" />
      </div>
    );
  return (
    <section>
      <Table
        firstRow={
          <div className="w-full flex ">
            <div className=" flex-1  flex justify-start items-end">
              <SearchInput placeholder="جستجو کنید" />
            </div>
          </div>
        }
      >
        <TableHeader headerData={tableHeader} />
        <TableBody>
          {warehouses?.map((row) => (
            <TableRow key={row?._id}>
              <TableColumn>{row?.product?.name || row?.product}</TableColumn>
              <TableColumn>{row?.batchNumber || "DEFAULT"}</TableColumn>
              <TableColumn>{row?.unit?.name || row?.unit}</TableColumn>
              <TableColumn>
                {row?.location === "warehouse" ? "گدام" : row?.location}
              </TableColumn>
              <TableColumn>
                {row?.expiryDate
                  ? new Date(row.expiryDate).toLocaleDateString("fa-IR")
                  : "—"}
              </TableColumn>
              <TableColumn>
                {row?.purchasePricePerBaseUnit?.toLocaleString?.() ||
                  row?.purchasePricePerBaseUnit}
              </TableColumn>
              <TableColumn className="font-semibold">
                {row?.quantity}
              </TableColumn>
              <TableColumn>
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStockStatus(row?.quantity, row?.product?.minLevel || 0)
                      .color
                  }`}
                >
                  {
                    getStockStatus(row?.quantity, row?.product?.minLevel || 0)
                      .label
                  }
                </span>
              </TableColumn>
              <TableColumn>
                <div className=" flex items-center gap-2">
                  <CgEye
                    className=" text-[18px] hover:bg-slate-200 text-yellow-400 rounded-full"
                    onClick={() => {
                      setSelectedPro(row);
                      setShow(true);
                    }}
                  />
                  <BiTransferAlt
                    className=" text-[18px] hover:bg-slate-200 text-red-400 rounded-full"
                    onClick={() => {
                      setSelectedPro(row);
                      setShowTransfer(true);
                    }}
                  />
                  <BiPencil
                    className=" text-[18px] hover:bg-slate-200 text-green-500 rounded-full"
                    onClick={() => {
                      setSelectedPro(row);
                      setShowEdit(true);
                    }}
                  />
                </div>
              </TableColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <GloableModal open={show} setOpen={setShow}>
        {selectedPro && (
          <div className="bg-white rounded-sm max-w-2xl w-[700px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">جزئیات گدام </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    محصول
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro?.product?.name || selectedPro?.product}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    نمبر بچ
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro?.batchNumber || "DEFAULT"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    واحد
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro?.unit?.name || selectedPro?.unit}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    قیمت خرید/واحد
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedPro?.purchasePricePerBaseUnit}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    موجودی در انبار
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedPro?.location === "warehouse"
                      ? selectedPro?.quantity
                      : 0}{" "}
                    عدد
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    موجودی در فروشگاه
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedPro?.location === "store"
                      ? selectedPro?.quantity
                      : 0}{" "}
                    عدد
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    مجموع موجودی
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedPro?.quantity} عدد
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    وضعیت
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedPro?.expiryDate ? "موجود" : "—"
                    )}`}
                  >
                    {selectedPro?.expiryDate ? "موجود" : "—"}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    حداقل سطح موجودی
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro?.product?.minLevel ?? 0} عدد
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    تاریخ انقضا
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro?.expiryDate
                      ? new Date(selectedPro.expiryDate).toLocaleDateString(
                          "fa-IR"
                        )
                      : "در دسترس نیست"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    ارزش کل
                  </h3>
                  <p className="text-lg font-semibold text-amber-600">
                    $
                    {(
                      selectedPro?.quantity *
                      selectedPro?.purchasePricePerBaseUnit
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    آخرین به‌روزرسانی
                  </h3>
                  <p className="text-sm text-gray-700">
                    {new Date(
                      selectedPro.updatedAt || selectedPro.createdAt
                    ).toLocaleString("fa-IR")}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    توضیحات
                  </h3>
                  <p className="text-gray-900">
                    {selectedPro.description || "هیچ توضیحی در دسترس نیست"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button onClick={() => setShow(false)}>بستن</Button>
            </div>
          </div>
        )}
      </GloableModal>
      <GloableModal open={showEdit} setOpen={setShowEdit}>
        <div className="w-[660px] bg-white ">
          <WarehouseForm
            handleSubmit={handleSubmit(onSubmitEdit)}
            control={control}
          />
        </div>
      </GloableModal>
      <GloableModal open={showTransfer} setOpen={setShowTransfer}>
        <form
          noValidate
          className="bg-white rounded-lg  w-[480px] p-2 h-[500px]"
          onSubmit={transferForm.handleSubmit(onSubmit)}
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">انتقال موجودی</h2>
          </div>
          <div className="p-6 space-y-2">
            <div>
              <span>محصول: </span>
              <span className="font-bold text-amber-700 underline">
                {selectedPro?.product?.name || selectedPro?.product}
              </span>
            </div>
            <div className="flex flex-col  items-center  gap-1 md:flex-row ga-2">
              <label className="flex-1">
                <span className="block text-[12px] font-medium text-gray-600 mb-1">
                  نوع انتقال
                </span>
                <select className={inputStyle} {...register("transferType")}>
                  <option value="warehouse-store">گدام ↔ فروشگاه</option>
                  <option value="warehouse-employee">گدام → کارمند</option>
                </select>
              </label>
              {needsEmployee && (
                <label className="flex-1">
                  <span className="block text-[12px] font-medium text-gray-600 mb-1">
                    کارمند
                  </span>
                  <select className={inputStyle} {...register("employee")}>
                    <option value="">کارمند را انتخاب کنید</option>
                    {employees?.data?.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <label className="flex-1">
                <span className="block pb-1 text-sm font-medium text-gray-700 mb-2">
                  از:{" "}
                </span>
                <span className={inputStyle}>
                  {fromLocation === "warehouse"
                    ? "گدام"
                    : fromLocation === "store"
                    ? "فروشگاه"
                    : "کارمند"}
                </span>
              </label>
              <label className="flex-1">
                <span className="block text-sm pb-1 font-medium text-gray-700 mb-2">
                  به:{" "}
                </span>
                <span className={inputStyle}>
                  {toLocation === "warehouse"
                    ? "گدام"
                    : toLocation === "store"
                    ? "فروشگاه"
                    : "کارمند"}
                </span>
              </label>
            </div>
            <div className=" py-1">
              <label className="block text-sm font-[400] text-gray-700 mb-2">
                تعداد (واحد پایه)
              </label>
              <input
                className={inputStyle}
                type="number"
                placeholder="تعداد مورد نظر"
                min="1"
                {...register("quantity", { required: true, min: 1 })}
              />
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
            <Button
              onClick={() => setShowTransfer(false)}
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              بستن
            </Button>
            <Button
              type="submit"
              className=" bg-primary-brown-light text-white px-4 py-2 rounded-md"
              disabled={
                !quantity || quantity <= 0 || (needsEmployee && !employee)
              }
            >
              انتقال موجودی
            </Button>
          </div>
        </form>
      </GloableModal>
      <GloableModal open={showTransferConf} setOpen={setShowTransfer}>
        <Confirmation
          type="transfer"
          handleClick={confirmTransfer}
          handleCancel={() => setShwoTransferConf(false)}
          close={() => setShwoTransferConf(false)}
          message="آیا مطمئن هستید که این انتقال را انجام دهید؟"
        />
      </GloableModal>
    </section>
  );
}

export default Warehouse;
