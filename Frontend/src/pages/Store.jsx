import { ImPriceTag } from "react-icons/im";
import SearchInput from "../components/SearchInput";
import Table from "../components/Table";
import React, { useState } from "react";
import TableBody from "../components/TableBody";
import TableRow from "../components/TableRow";
import TableColumn from "../components/TableColumn";
import TableMenuModal from "../components/TableMenuModal";
import Menus from "../components/Menu";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { BiTransferAlt } from "react-icons/bi";
import Confirmation from "../components/Confirmation";
import { getStockStatus } from "../utilies/stockStatus";
import GloableModal from "../components/GloableModal";
import TableHeader from "../components/TableHeader";

import {
  useCreateStockTransfer,
  useDeleteStore,
  useEmployees,
  useStoreStocks,
} from "../services/useApi";
import Button from "../components/Button";
import { CalendarDays, ClipboardList, Info, Package } from "lucide-react";
import { useForm } from "react-hook-form";
// Headers aligned with Backend stock.model.js for store location
const storeHeader = [
  { title: "نمبر بچ" },
  { title: "موقعیت" },
  { title: "محصول" },
  { title: "تاریخ انقضا" },
  { title: "قیمت خرید/واحد" },
  { title: "واحد" },
  { title: "تعداد" },
  { title: "حالت" },
  { title: "عملیات" },
];

function Store() {
  const { data: stocks } = useStoreStocks();
  const { data: employees } = useEmployees();
  const { register, handleSubmit, watch } = useForm();
  const { mutate: createStockTransfer } = useCreateStockTransfer();
  const transferType = watch("transferType") || "store-warehouse";
  const quantity = watch("quantity");
  const employee = watch("employee");
  const [search, setSearch] = useState("");

  // Example fromLocation/toLocation logic

  const { mutate: deleteStore } = useDeleteStore();
  const [selectedData, setSelectedData] = useState(null);
  const [show, setShow] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showTransferConf, setShwoTransferConf] = useState(false);

  let fromLocation = selectedData?.location;
  let toLocation =
    transferType === "store-warehouse"
      ? fromLocation === "store"
        ? "warehouse"
        : "store"
      : transferType === "store-employee"
      ? "employee"
      : "unknown";

  const needsEmployee = [
    "store-employee",
    "employee-store",
    "warehouse-employee",
    "employee-warehouse",
  ].includes(transferType);

  function onSubmit(data) {
    console.log(data);
    if (!data.quantity || data.quantity <= 0) return;
    setShwoTransferConf(true);
  }

  function confirmTransfer() {
    const stockTransfer = {
      product: selectedData.product?._id || selectedData.product,
      fromLocation: fromLocation,
      toLocation: toLocation,
      employee: needsEmployee ? employee : undefined,
      quantity: Number(quantity),
      transferDate: new Date(),
      transferredBy: "currentUserId", // replace if you have user context
    };
    createStockTransfer(stockTransfer);
    // console.log(stockTransfer);
    setShwoTransferConf(false);
  }

  return (
    <section>
      <Table
        firstRow={
          <div className=" w-full flex  justify-between ">
            <div className=" w-[300px]">
              <SearchInput
                placeholder="جستجو بر اساس نام محصول..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        }
      >
        <TableHeader headerData={storeHeader} />
        <TableBody>
          {stocks?.data?.map((el) => (
            <TableRow key={el?._id}>
              <TableColumn>{el?.batchNumber || "DEFAULT"}</TableColumn>
              <TableColumn>
                {el?.location === "store" ? "فروشگاه" : el?.location}
              </TableColumn>
              <TableColumn>{el?.product?.name || el?.product}</TableColumn>
              <TableColumn>
                {el?.expiryDate
                  ? new Date(el.expiryDate).toLocaleDateString("fa-IR")
                  : "—"}
              </TableColumn>
              <TableColumn>
                {el?.purchasePricePerBaseUnit?.toLocaleString?.() ||
                  el?.purchasePricePerBaseUnit}
              </TableColumn>
              <TableColumn>{el?.unit?.name || el?.unit}</TableColumn>
              <TableColumn className="font-semibold">
                {el?.quantity}
              </TableColumn>
              <TableColumn>
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStockStatus(el?.quantity, el?.product?.minLevel || 0)
                      .color
                  }`}
                >
                  {
                    getStockStatus(el?.quantity, el?.product?.minLevel || 0)
                      .label
                  }
                </span>
              </TableColumn>
              <TableColumn>
                <span
                  className={`${
                    "stores" +
                    el?._id +
                    new Date(el?.expiryDate || Date.now()).getMilliseconds()
                  } table-cell   w-auto relative  align-middle md:*:text-lg text-[12px] md:font-medium font-light  capitalize`}
                >
                  <div
                    className={`  w-full h-full flex justify-center items-center`}
                  >
                    <TableMenuModal>
                      <Menus>
                        <Menus.Menu>
                          <Menus.Toggle id={el?._id} />
                          <Menus.List
                            parent={
                              "stores" +
                              el?._id +
                              new Date(
                                el?.expiryDate || Date.now()
                              ).getMilliseconds()
                            }
                            id={el?._id}
                            className="bg-white rounded-lg shadow-xl"
                          >
                            <Menus.Button
                              icon={<HiSquare2Stack />}
                              onClick={() => {
                                setSelectedData(el);
                                setShow(true);
                              }}
                            >
                              نمایش
                            </Menus.Button>
                            {el?.quantity > 0 && (
                              <Menus.Button
                                icon={<BiTransferAlt size={24} />}
                                onClick={() => {
                                  setSelectedData(el);
                                  setShowTransfer(true);
                                }}
                              >
                                انتقال
                              </Menus.Button>
                            )}
                            <Menus.Button
                              icon={<HiTrash />}
                              onClick={() => {
                                setSelectedData(el);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              حذف
                            </Menus.Button>
                          </Menus.List>
                        </Menus.Menu>
                      </Menus>
                    </TableMenuModal>
                  </div>
                </span>
              </TableColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <GloableModal open={show} setOpen={setShow}>
        {selectedData && (
          <div
            dir="rtl"
            className="w-[500px] mx-auto bg-white rounded-sm shadow-sm overflow-hidden"
          >
            <div className=" p-6 text-slate-800 flex  items-center  gap-3 ">
              <p className="text-2xl  font-black">
                {selectedData?._id?.slice(-6)}#
              </p>
              <h2 className="text-2xl font-bold text-palm-500">
                {selectedData?.location === "store"
                  ? "فروشگاه"
                  : selectedData?.location}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                {/* Unit */}
                <div className=" flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm  font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <Package className=" text-2xl text-palm-500" />
                    <span className="text-lg text-palm-500">واحد</span>
                  </h3>
                  <p className="text-lg font-semibold text-palm-400">
                    {selectedData?.unit?.name || selectedData?.unit}
                  </p>
                </div>

                {/* Min Quantity */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <ClipboardList className="text-2xl text-palm-500" />
                    <span className="ext-lg text-palm-500">محصول</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedData?.product?.name || selectedData?.product}
                  </p>
                </div>

                {/* Tracker */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <ImPriceTag className="text-2xl text-palm-500" />
                    <span className="ext-lg text-palm-500">قیمت</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedData?.purchasePricePerBaseUnit}
                  </p>
                </div>

                {/* Date */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <CalendarDays className="text-2xl text-palm-500" />
                    <span className="ext-lg text-palm-500">تاریخ انقضا</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedData?.expiryDate
                      ? new Date(selectedData.expiryDate).toLocaleDateString(
                          "fa-IR"
                        )
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              <div className="flex flex-col  items-start gap-x-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center justify-end gap-1">
                  <Info className="text-2xl text-palm-500" />
                  <span className="ext-[16px] text-palm-500">نمبر ردیابی</span>
                </h3>
                <p className="text-gray-800 leading-relaxed text-right">
                  {selectedData?.batchNumber || "DEFAULT"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
              <Button onClick={() => setShow(false)}>بسته کردن</Button>
            </div>
          </div>
        )}
      </GloableModal>
      <GloableModal open={showDeleteConfirm} setOpen={setShowDeleteConfirm}>
        <Confirmation
          type="delete"
          handleClick={() => {
            deleteStore(selectedData._id);
            setShowDeleteConfirm(false);
          }}
          handleCancel={() => setShowDeleteConfirm(false)}
          close={() => setShowDeleteConfirm(false)}
          message="آیا مطمئن هستید که این آیتم را حذف کنید؟"
        />
      </GloableModal>
      <GloableModal open={showTransfer} setOpen={setShowTransfer}>
        <form
          noValidate
          className="bg-white rounded-lg shadow-sm w-[600px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">انتقال موجودی</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <span>محصول: </span>
              <span className="font-bold">
                {selectedData?.product?.name || selectedData?.product}
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <label className="flex-1">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  نوع انتقال
                </span>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  {...register("transferType")}
                >
                  <option value="store-warehouse">فروشگاه ↔ گدام</option>
                  <option value="store-employee">فروشگاه → کارمند</option>
                </select>
              </label>
              {needsEmployee && (
                <label className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    کارمند
                  </span>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    {...register("employee")}
                  >
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
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  از:{" "}
                </span>
                <span className="inline-block border rounded-md px-3 py-2 bg-gray-50">
                  {fromLocation === "warehouse"
                    ? "گدام"
                    : fromLocation === "store"
                    ? "فروشگاه"
                    : "کارمند"}
                </span>
              </label>
              <label className="flex-1">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  به:{" "}
                </span>
                <span className="inline-block border rounded-md px-3 py-2 bg-gray-50">
                  {toLocation === "warehouse"
                    ? "گدام"
                    : toLocation === "store"
                    ? "فروشگاه"
                    : "کارمند"}
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تعداد (واحد پایه)
              </label>
              <input
                className="w-full border rounded-md px-3 py-2"
                type="number"
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
              className="bg-green-600 text-white px-4 py-2 rounded-md"
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

export default Store;
