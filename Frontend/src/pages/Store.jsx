import { ImPriceTag } from "react-icons/im";
import SearchInput from "../components/SearchInput";
import Select from "../components/Select";
import Table from "../components/Table";
import React, { useState } from "react";
import TableBody from "../components/TableBody";
import TableRow from "../components/TableRow";
import TableColumn from "../components/TableColumn";
import TableMenuModal from "../components/TableMenuModal";
import Menus from "../components/Menu";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Confirmation from "../components/Confirmation";
import { useDeleteStore, useStores, useUpdateStore } from "../services/useApi";
import GloableModal from "../components/GloableModal";
import TableHeader from "../components/TableHeader";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { CalendarDays, ClipboardList, Info, Package, User } from "lucide-react";
const storeHeader = [
  { title: "نمبر ردیابی" },
  { title: "موقعیت" },
  { title: "محصول" },
  { title: "تاریخ انقضا" },
  { title: "قیمت خرید" },
  { title: "واحد" },
  { title: "عملیات" },
];
function Store() {
  const { data: storelist } = useStores();
  const { mutate: deleteStore } = useDeleteStore();
  const { mutate: updateStore } = useUpdateStore();
  const [selectedData, setSelectedData] = useState(null);
  const [editForm, setEditForm] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <section>
      <Table
        firstRow={
          <div className=" w-full flex  justify-between ">
            <div className=" w-[300px]">
              <SearchInput placeholder="جستجو کنید" />
            </div>
            <div className=" w-[300px]">
              <Select
                id="sort"
                name="sort"
                options={[
                  { value: "نام جنس" },
                  { value: "واحد جنس" },
                  { value: "همه" },
                  { value: "واحد" },
                ]}
              />
            </div>
          </div>
        }
      >
        <TableHeader headerData={storeHeader} />
        <TableBody>
          {storelist?.map((el) => (
            <TableRow key={el.id}>
              <TableColumn>{el?.trackingNumber}</TableColumn>
              <TableColumn>{el?.location}</TableColumn>
              <TableColumn>{el?.product}</TableColumn>
              <TableColumn>{el?.expiryDate}</TableColumn>
              <TableColumn>{el?.purchasePrice}</TableColumn>
              <TableColumn>{el?.unit}</TableColumn>
              <TableColumn>
                <span
                  className={`${
                    "stores" +
                    el?.id +
                    new Date(el?.expiryDate).getMilliseconds()
                  } table-cell   w-auto relative  align-middle md:*:text-lg text-[12px] md:font-medium font-light  capitalize`}
                >
                  <div
                    className={`  w-full h-full flex justify-center items-center`}
                  >
                    <TableMenuModal>
                      <Menus>
                        <Menus.Menu>
                          <Menus.Toggle id={el?.id} />
                          <Menus.List
                            parent={
                              "stores" +
                              el?.id +
                              new Date(el?.expiryDate).getMilliseconds()
                            }
                            id={el?.id}
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
                          <Confirmation
                            type="delete"
                            handleClick={() => deleteStore(el?.id)}
                            handleCancel={() => {}}
                          />
                        </TableMenuModal.Window>

                        <TableMenuModal.Window name="edit" className={``}>
                          <Confirmation
                            type="edit"
                            handleClick={() => {
                              setSelectedData(el);
                              setEditForm(true);
                            }}
                            handleCancel={() => {}}
                          />
                        </TableMenuModal.Window>
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
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            dir="rtl"
            className="w-[500px] mx-auto bg-white rounded-sm shadow-sm overflow-hidden"
          >
            <div className=" p-6 text-slate-800 flex  items-center  gap-3 ">
              <p className="text-2xl  font-black">{selectedData.id}#</p>
              <h2 className="text-2xl font-bold text-palm-500">
                {selectedData.location}
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
                    {selectedData.unit}
                  </p>
                </div>

                {/* Min Quantity */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <ClipboardList className="text-2xl text-palm-500" />
                    <span className="ext-lg text-palm-500">محصول</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedData.product}
                  </p>
                </div>

                {/* Tracker */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <ImPriceTag className="text-2xl text-palm-500" />
                    <span className="ext-lg text-palm-500">قیمت</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedData.purchasePrice}
                  </p>
                </div>

                {/* Date */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <CalendarDays className="text-2xl text-palm-500" />
                    <span className="ext-lg text-palm-500">تاریخ انقضا</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedData.expiryDate}
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
                  {selectedData.trackingNumber}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
              <Button onClick={() => setShow(false)}>بسته کردن</Button>
            </div>
          </motion.div>
        )}
      </GloableModal>
    </section>
  );
}

export default Store;
