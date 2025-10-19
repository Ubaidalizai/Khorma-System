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
            <div className=" flex justify-end flex-2">
              <div className=" w-[50%]">
                <Select
                  defaultSelected="فلتر کنید"
                  id=""
                  options={[
                    { value: "همه" },
                    { value: "گدام" },
                    { value: "جنس" },
                    { value: "حالت" },
                  ]}
                ></Select>
              </div>
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
          <div className="bg-white rounded-sm shadow-sm  w-[600px]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Transfer Stock
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedPro.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available in Warehouse</p>
                <p className="text-2xl font-bold text-purple-600">
                  {selectedPro.warehouseStock} units
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity to Transfer *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedPro.warehouseStock}
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
                  setSelectedPro(null);
                  setTransferQuantity("");
                  setShowTransfer(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {}}
                disabled={
                  !transferQuantity ||
                  transferQuantity <= 0 ||
                  transferQuantity > selectedPro.warehouseStock
                }
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Transfer Stock
              </button>
            </div>
          </div>
        )}
      </GloableModal>
    </section>
  );
}

export default Warehouse;
