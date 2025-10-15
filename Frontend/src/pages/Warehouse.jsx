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
const tableHeader = [
  { title: "جنس" },
  { title: "نمبر ردیابی" },
  { title: "واحد" },
  { title: "گدام" },
  { title: "فروشگاه" },
  { title: "تاریخ انقضا" },
  { title: "تعداد" },
  { title: "حالت" },
  { title: "عملیات" },
];
function Warehouse({ warehouses, getStatusColor, isLoading }) {
  const { control, handleSubmit, reset } = useForm();
  const { mutate: updateInventory } = useUpdateStore();
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
          {warehouses?.map((filter) => (
            <TableRow key={filter.id}>
              <TableColumn>{filter.name}</TableColumn>
              <TableColumn>{filter.sku}</TableColumn>
              <TableColumn>{filter.category}</TableColumn>
              <TableColumn className="text-purple-600">
                {filter.warehouseStock}
              </TableColumn>
              <TableColumn className="text-green-600">
                {filter.storeStock}
              </TableColumn>
              <TableColumn>
                {filter.warehouseStock + filter.storeStock}
              </TableColumn>
              <TableColumn>{filter.unitPrice}</TableColumn>
              <TableColumn>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    filter.status
                  )}`}
                >
                  {filter.status}
                </span>
              </TableColumn>
              <TableColumn
                className={`${
                  "itemavs" +
                  new Date(filter.expiryDate).getMilliseconds() +
                  filter?.id
                } relative`}
              >
                <span>
                  <TableMenuModal>
                    <Menus>
                      <Menus.Menu>
                        <Menus.Toggle id={filter?.id} />
                        <Menus.List
                          parent={
                            "itemavs" +
                            new Date(filter.expiryDate).getMilliseconds() +
                            filter?.id
                          }
                          id={filter?.id}
                          className="bg-white rounded-lg shadow-xl"
                        >
                          <Menus.Button
                            icon={<HiSquare2Stack />}
                            onClick={() => {
                              setSelectedPro(filter);
                              setShow(true);
                            }}
                          >
                            نمایش
                          </Menus.Button>

                          <Menus.Button
                            icon={<HiPencil />}
                            onClick={() => {
                              setSelectedPro(filter);
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
                    نام گدام
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro.name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    کُد محصول (SKU)
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro.sku}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    دسته‌بندی
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro.category}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    قیمت واحد
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedPro.unitPrice}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    موجودی در انبار
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedPro.warehouseStock} عدد
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    موجودی در فروشگاه
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedPro.storeStock} عدد
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    مجموع موجودی
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedPro.warehouseStock + selectedPro.storeStock} عدد
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    وضعیت
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedPro.status
                    )}`}
                  >
                    {selectedPro.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    حداقل سطح موجودی
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro.minStockLevel} عدد
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    تاریخ انقضا
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro.expiryDate || "در دسترس نیست"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    ارزش کل
                  </h3>
                  <p className="text-lg font-semibold text-amber-600">
                    $
                    {(
                      (selectedPro.warehouseStock + selectedPro.storeStock) *
                      selectedPro.unitPrice
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    آخرین به‌روزرسانی
                  </h3>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedPro.lastUpdated).toLocaleString()}
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
    </section>
  );
}

export default Warehouse;
