import { BiTransferAlt } from "react-icons/bi";
import { BiLoaderAlt } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import SearchInput from "../components/SearchInput";
import Select from "../components/Select";
import TableHeader from "../components/TableHeader";
import TableBody from "../components/TableBody";
import TableColumn from "../components/TableColumn";
import TableMenuModal from "../components/TableMenuModal";
import Menus from "../components/Menu";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Confirmation from "../components/Confirmation";
import TableRow from "../components/TableRow";
import Table from "../components/Table";
import GloableModal from "../components/GloableModal";
import Button from "../components/Button";
import WarehouseForm from "../components/WarehouseForm";
import { useForm } from "react-hook-form";
import { useUpdateStore } from "../services/useApi";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEmployees } from "../services/useApi";
// Headers aligned with Backend stock.model.js
const tableHeader = [
  { title: "محصول" },
  { title: "نمبر بچ" },
  { title: "واحد" },
  { title: "موقعیت" },
  { title: "تاریخ انقضا" },
  { title: "قیمت خرید/واحد" },
  { title: "تعداد" },
  { title: "عملیات" },
];
function Warehouse({ warehouses, getStatusColor, isLoading }) {
  const [transferQuantity, setTransferQuantity] = useState(null);
  const { control, handleSubmit, reset } = useForm();
  const { mutate: updateInventory } = useUpdateStore();
  const [showTransfer, setShowTransfer] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedPro, setSelectedPro] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
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
      <div className=" w-full h-full flex justify-center items-center">
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
              <TableColumn>{row?.location === "warehouse" ? "گدام" : row?.location}</TableColumn>
              <TableColumn>{row?.expiryDate ? new Date(row.expiryDate).toLocaleDateString('fa-IR') : "—"}</TableColumn>
              <TableColumn>{row?.purchasePricePerBaseUnit?.toLocaleString?.() || row?.purchasePricePerBaseUnit}</TableColumn>
              <TableColumn className="font-semibold">{row?.quantity}</TableColumn>
              <TableColumn
                className={`${
                  "itemavs" +
                  (row?.expiryDate ? new Date(row.expiryDate).getMilliseconds() : "0") +
                  row?._id
                } relative`}
              >
                <span>
                  <TableMenuModal>
                    <Menus>
                      <Menus.Menu>
                        <Menus.Toggle id={row?._id} />
                        <Menus.List
                          parent={
                            "itemavs" +
                            (row?.expiryDate ? new Date(row.expiryDate).getMilliseconds() : "0") +
                            row?._id
                          }
                          id={row?._id}
                          className="bg-white rounded-lg shadow-xl"
                        >
                          <Menus.Button
                            icon={<HiSquare2Stack />}
                            onClick={() => {
                              setSelectedPro(row);
                              setShow(true);
                            }}
                          >
                            نمایش
                          </Menus.Button>
                          <Menus.Button
                            icon={<BiTransferAlt size={24} />}
                            onClick={() => {
                              setSelectedPro(row);
                              setShowTransfer(true);
                            }}
                          >
                            انتقال
                          </Menus.Button>

                          <Menus.Button
                            icon={<HiPencil />}
                            onClick={() => {
                              setSelectedPro(row);
                              setShowEdit(true);
                            }}
                          >
                            ویرایش
                          </Menus.Button>
                        </Menus.List>
                      </Menus.Menu>
                    </Menus>
                  </TableMenuModal>
                </span>
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
                    {selectedPro?.batchNumber || 'DEFAULT'}
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
                    {selectedPro?.location === 'warehouse' ? selectedPro?.quantity : 0} عدد
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    موجودی در فروشگاه
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedPro?.location === 'store' ? selectedPro?.quantity : 0} عدد
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
                      selectedPro?.expiryDate ? 'موجود' : '—'
                    )}`}
                  >
                    {selectedPro?.expiryDate ? 'موجود' : '—'}
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
                    {selectedPro?.expiryDate ? new Date(selectedPro.expiryDate).toLocaleDateString('fa-IR') : "در دسترس نیست"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    ارزش کل
                  </h3>
                  <p className="text-lg font-semibold text-amber-600">
                    $
                    {(
                      selectedPro?.quantity * selectedPro?.purchasePricePerBaseUnit
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    آخرین به‌روزرسانی
                  </h3>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedPro.updatedAt || selectedPro.createdAt).toLocaleString('fa-IR')}
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
        {showTransfer && (
          <StockTransferModal 
            stock={selectedPro} 
            onClose={() => { setShowTransfer(false); setTransferQuantity(""); setSelectedPro(null); }} 
          />
        )}
      </GloableModal>
    </section>
  );
}

export default Warehouse;

function StockTransferModal({ stock, onClose }) {
  const [transferType, setTransferType] = React.useState("warehouse-store");
  const [quantity, setQuantity] = React.useState("");
  const [employee, setEmployee] = React.useState("");
  const { data: employees } = useEmployees();
  // Example fromLocation/toLocation logic
  let fromLocation = stock?.location;
  let toLocation = transferType === "warehouse-store" ?
      (fromLocation === "warehouse" ? "store" : "warehouse") :
      transferType === "warehouse-employee" ? "employee" :
      transferType === "employee-warehouse" ? "warehouse" :
      transferType === "store-employee" ? "employee" :
      transferType === "employee-store" ? "store" :
      "unknown";

  const needsEmployee = ["warehouse-employee", "employee-warehouse", "store-employee", "employee-store"].includes(transferType);

  function handleSubmit(e) {
    e.preventDefault();
    if (!quantity || quantity <= 0) return;
    // fake mutation, replace with your real endpoint later
    const stockTransfer = {
      product: stock.product?._id || stock.product,
      fromLocation: fromLocation,
      toLocation: toLocation,
      employee: needsEmployee ? employee : undefined,
      quantity: Number(quantity),
      transferDate: new Date(),
      transferredBy: 'currentUserId', // replace if you have user context
    };
    alert("Would submit: " + JSON.stringify(stockTransfer, null, 2));
    onClose();
  }

  return (
    <form className="bg-white rounded-lg shadow-sm w-[600px]" onSubmit={handleSubmit}>
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">انتقال موجودی</h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <span>محصول: </span>
          <span className="font-bold">{stock?.product?.name || stock?.product}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex-1">
            <span className="block text-sm font-medium text-gray-700 mb-2">نوع انتقال</span>
            <select className="w-full border rounded-md px-3 py-2" value={transferType} onChange={e => setTransferType(e.target.value)}>
              <option value="warehouse-store">انبار ↔ فروشگاه</option>
              <option value="warehouse-employee">انبار → کارمند</option>
              <option value="employee-warehouse">کارمند → انبار</option>
              <option value="store-employee">فروشگاه → کارمند</option>
              <option value="employee-store">کارمند → فروشگاه</option>
            </select>
          </label>
          {needsEmployee && (
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-2">کارمند</span>
              <select className="w-full border rounded-md px-3 py-2" value={employee} onChange={e => setEmployee(e.target.value)}>
                <option value="">کارمند را انتخاب کنید</option>
                {employees?.data?.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex-1">
            <span className="block text-sm font-medium text-gray-700 mb-2">از: </span>
            <span className="inline-block border rounded-md px-3 py-2 bg-gray-50">{fromLocation === 'warehouse' ? 'انبار' : fromLocation === 'store' ? 'فروشگاه' : 'کارمند'}</span>
          </label>
          <label className="flex-1">
            <span className="block text-sm font-medium text-gray-700 mb-2">به: </span>
            <span className="inline-block border rounded-md px-3 py-2 bg-gray-50">{toLocation === 'warehouse' ? 'انبار' : toLocation === 'store' ? 'فروشگاه' : 'کارمند'}</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">تعداد (واحد پایه)</label>
          <input className="w-full border rounded-md px-3 py-2" type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        </div>
      </div>
      <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
        <Button onClick={onClose} type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md">بستن</Button>
        <Button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md" disabled={!quantity || quantity<=0 || (needsEmployee && !employee)}>
          انتقال موجودی
        </Button>
      </div>
    </form>
  );
}
