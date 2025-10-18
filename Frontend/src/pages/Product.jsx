import { motion } from "framer-motion";
import { CalendarDays, ClipboardList, Info, Package, User } from "lucide-react";
import { useState } from "react";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Button from "../components/Button";
import Confirmation from "../components/Confirmation";
import EditProduct from "../components/EditProduct";
import GloableModal from "../components/GloableModal";
import Menus from "../components/Menu";
import SearchInput from "../components/SearchInput";
import Select from "../components/Select";
import Table from "../components/Table";
import TableBody from "../components/TableBody";
import TableColumn from "../components/TableColumn";
import TableHeader from "../components/TableHeader";
import TableMenuModal from "../components/TableMenuModal";
import TableRow from "../components/TableRow";
import { useDeleteProdcut } from "../services/useApi";
const headers = [
  { title: "نمبر مسلسل" },
  { title: "تاریخ" },
  { title: "اسم جنس" },
  { title: "واحد موردنظر" },
  { title: "کمترین اندازه" },
  { title: "توضیحات" },
  { title: "عملیات" },
];

function Product({ properties: productList }) {
  const { mutate: deleteProduct } = useDeleteProdcut();
  const [isEditable, setIsEditable] = useState(false);
  const [showData, setShowData] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedPro, setSelectedPro] = useState(null);

  return (
    <section className="w-full">
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
        <TableHeader headerData={headers} />
        <TableBody>
          {productList?.map((el) => (
            <TableRow key={el.id}>
              <TableColumn>{el?.id}</TableColumn>
              <TableColumn>{el?.date}</TableColumn>
              <TableColumn>{el?.itemName}</TableColumn>
              <TableColumn>{el?.unit}</TableColumn>
              <TableColumn>{el?.minQuantity}</TableColumn>
              <TableColumn>{el?.description}</TableColumn>
              <TableColumn>
                <span
                  className={`${
                    "itemavs" + el?.id + new Date(el?.date).getMilliseconds()
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
                              "itemavs" +
                              el?.id +
                              new Date(el?.date).getMilliseconds()
                            }
                            id={el?.id}
                            className="bg-white rounded-lg shadow-xl"
                          >
                            <Menus.Button
                              icon={<HiSquare2Stack />}
                              onClick={() => {
                                setSelectedPro(el);
                                setShowData(true);
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
                            handleClick={() => deleteProduct(el?.id)}
                            handleCancel={() => {}}
                          />
                        </TableMenuModal.Window>

                        <TableMenuModal.Window name="edit" className={``}>
                          <Confirmation
                            type="edit"
                            handleClick={() => {
                              setSelectedPro(el);
                              setIsEditable(true);
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
      <GloableModal open={isEditable} setOpen={setIsEditable}>
        <EditProduct productId={selectedPro?.id} />
      </GloableModal>

      <GloableModal open={show} setOpen={setShow}>
        {selectedPro && (
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Product Details
              </h2>
            </div>
            {/* <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Product Name
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro?.name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    SKU
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro?.sku}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Category
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro?.category}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Unit Price
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedPro?.unitPrice}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Warehouse Stock
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedPro?.warehouseStock} units
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Store Stock
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedPro?.storeStock} units
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Total Stock
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedPro?.warehouseStock + selectedPro?.storeStock}{" "}
                    units
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Status
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedPro?.status
                    )}`}
                  >
                    {selectedPro?.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Minimum Stock Level
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro?.minStockLevel} units
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Expiry Date
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro?.expiryDate || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Total Value
                  </h3>
                  <p className="text-lg font-semibold text-amber-600">
                    $
                    {(
                      (selectedPro?.warehouseStock + selectedPro?.storeStock) *
                      selectedPro?.unitPrice
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Last Updated
                  </h3>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedPro?.lastUpdated).toLocaleString()}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Description
                  </h3>
                  <p className="text-gray-900">
                    {selectedPro?.description || "No description available"}
                  </p>
                </div>
              </div>
            </div> */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button onClick={() => setShow(false)}>بسته کردن</Button>
            </div>
          </div>
        )}
      </GloableModal>
      <GloableModal open={showData} setOpen={setShowData}>
        {selectedPro && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            dir="rtl"
            className="w-[500px] mx-auto bg-white rounded-sm shadow-sm overflow-hidden"
          >
            <div className=" p-6 text-slate-800 flex  items-center  gap-3 ">
              <p className="text-2xl  font-black">{selectedPro.id}#</p>
              <h2 className="text-2xl font-bold text-palm-500">
                {selectedPro.itemName}
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
                    {selectedPro.unit}
                  </p>
                </div>

                {/* Min Quantity */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <ClipboardList className="text-2xl text-palm-500" />
                    <span className="ext-lg text-palm-500">حداقل مقدار</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro.minQuantity} عدد
                  </p>
                </div>

                {/* Tracker */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <User className="text-2xl text-palm-500" />
                    <span className="ext-lg text-palm-500">مسئول پیگیری</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro.tracker}
                  </p>
                </div>

                {/* Date */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <CalendarDays className="text-2xl text-palm-500" />
                    <span className="ext-lg text-palm-500">تاریخ ثبت</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro.date}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              <div className="flex flex-col  items-start gap-x-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center justify-end gap-1">
                  <Info className="text-2xl text-palm-500" />
                  <span className="ext-[16px] text-palm-500">توضیحات</span>
                </h3>
                <p className="text-gray-800 leading-relaxed text-right">
                  {selectedPro.description || "هیچ توضیحی در دسترس نیست."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
              <Button onClick={() => setShowData(false)}>بسته کردن</Button>
            </div>
          </motion.div>
        )}
      </GloableModal>
    </section>
  );
}

export default Product;
