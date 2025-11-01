import { CiTrash } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { BsEye } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
// import { motion } from "framer-motion";
import {
  CalendarDays,
  ClipboardList,
  Info,
  Package,
  TrashIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Button from "../components/Button";
import Confirmation from "../components/Confirmation";
import EditProduct from "../components/EditProduct";
import GloableModal from "../components/GloableModal";
import Menus from "../components/Menu";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";
import Table from "../components/Table";
import TableBody from "../components/TableBody";
import TableColumn from "../components/TableColumn";
import TableHeader from "../components/TableHeader";
import TableMenuModal from "../components/TableMenuModal";
import TableRow from "../components/TableRow";
import { useDeleteProdcut } from "../services/useApi";
const headers = [
  { title: "اسم جنس" },
  { title: "واحد پایه" },
  { title: "ردیابی بچ" },
  { title: "عملیات" },
];

import { useProduct } from "../services/useApi";
import { formatNumber } from "../utilies/helper";

function Product() {
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProdcut();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: productList, isLoading } = useProduct({ search, page, limit });

  const [isEditable, setIsEditable] = useState(false);
  const [showData, setShowData] = useState(false);
  const [show, setShow] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPro, setSelectedPro] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Handle delete product
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  // Confirm delete product
  const confirmDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete._id, {});
      setShowDeleteConfirm(false);
    }
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setSelectedPro(product);
    setIsEditable(true);
  };

  // Handle view product
  const handleViewProduct = (product) => {
    setSelectedPro(product);
    setShowData(true);
  };

  // Handle close modals
  const handleCloseEdit = () => {
    setIsEditable(false);
    setSelectedPro(null);
  };

  const handleCloseView = () => {
    setShowData(false);
    setSelectedPro(null);
  };
  // Show loading state if data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">در حال بارگذاری...</div>
      </div>
    );
  }
  return (
    <section className="w-full">
      <Table
        firstRow={
          <div className=" w-full flex  justify-between ">
            <div className=" w-[300px]">
              <SearchInput
                placeholder="جستجو بر اساس نام جنس..."
                value={search}
                onChange={(e) => setSearch(e?.target ? e.target.value : e)}
              />
            </div>
          </div>
        }
      >
        <TableHeader headerData={headers} />
        <TableBody>
          {productList?.data?.length > 0 ? (
            productList?.data?.map((el) => (
              <TableRow key={el._id}>
                <TableColumn>{el?.name}</TableColumn>
                <TableColumn>{el?.baseUnit?.name || "نامشخص"}</TableColumn>

                <TableColumn>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      el?.trackByBatch
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {el?.trackByBatch ? "فعال" : "غیرفعال"}
                  </span>
                </TableColumn>
                <TableColumn>
                  <div className=" flex items-center justify-center  gap-x-2">
                    <BsEye
                      className=" text-[14px] text-yellow-500"
                      onClick={() => handleViewProduct(el)}
                    />
                    <CiTrash
                      className=" text-[14px] text-red-500"
                      onClick={() => handleDeleteProduct(el)}
                    />
                    <FaRegEdit
                      className=" text-[14px] text-green-500"
                      onClick={() => handleEditProduct(el)}
                    />
                  </div>
                </TableColumn>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableColumn
                colSpan={7}
                className="text-center py-8 text-gray-500"
              >
                هیچ محصولی یافت نشد
              </TableColumn>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-2 w-full items-center justify-center">
        <Pagination
          page={page}
          limit={limit}
          total={productList?.total || 0}
          totalPages={productList?.totalPages || 0}
          onPageChange={setPage}
          onRowsPerPageChange={setLimit}
        />
      </div>
      <GloableModal open={isEditable} setOpen={handleCloseEdit}>
        <EditProduct productId={selectedPro?._id} onClose={handleCloseEdit} />
      </GloableModal>

      <GloableModal open={show} setOpen={setShow}>
        {selectedPro && (
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Product Details
              </h2>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button onClick={() => setShow(false)}>بسته کردن</Button>
            </div>
          </div>
        )}
      </GloableModal>
      <GloableModal open={showData} setOpen={handleCloseView}>
        {selectedPro && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            dir="rtl"
            className="w-[500px] mx-auto bg-white rounded-sm shadow-sm overflow-hidden"
          >
            <div className=" p-6 text-slate-800 flex  items-center  gap-3 ">
              <p className="text-2xl  font-black">
                {selectedPro._id?.slice(-6)}#
              </p>
              <h2 className="text-2xl font-bold text-palm-500">
                {selectedPro.name}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                {/* Base Unit */}
                <div className=" flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm  font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <Package className=" text-2xl text-palm-500" />
                    <span className="text-lg text-palm-500">واحد پایه</span>
                  </h3>
                  <p className="text-lg font-semibold text-palm-400">
                    {selectedPro.baseUnit?.name || "نامشخص"}
                  </p>
                </div>

                {/* Min Level */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <ClipboardList className="text-2xl text-palm-500" />
                    <span className="text-lg text-palm-500">حداقل سطح</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro.minLevel || 0} عدد
                  </p>
                </div>

                {/* Latest Purchase Price */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <User className="text-2xl text-palm-500" />
                    <span className="text-lg text-palm-500">
                      آخرین قیمت خرید
                    </span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro.latestPurchasePrice
                      ? `${formatNumber(
                          selectedPro.latestPurchasePrice
                        )} افغانی`
                      : "نامشخص"}
                  </p>
                </div>

                {/* Track by Batch */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <CalendarDays className="text-2xl text-palm-500" />
                    <span className="text-lg text-palm-500">ردیابی بچ</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPro.trackByBatch ? "فعال" : "غیرفعال"}
                  </p>
                </div>

                {/* Created Date */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <CalendarDays className="text-2xl text-palm-500" />
                    <span className="text-lg text-palm-500">تاریخ ایجاد</span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedPro.createdAt).toLocaleDateString(
                      "fa-IR"
                    )}
                  </p>
                </div>

                {/* Updated Date */}
                <div className="flex flex-col  items-start gap-x-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center justify-end gap-1">
                    <CalendarDays className="text-2xl text-palm-500" />
                    <span className="text-lg text-palm-500">
                      آخرین بروزرسانی
                    </span>
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedPro.updatedAt).toLocaleDateString(
                      "fa-IR"
                    )}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              <div className="flex flex-col  items-start gap-x-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center justify-end gap-1">
                  <Info className="text-2xl text-palm-500" />
                  <span className="text-[16px] text-palm-500">توضیحات</span>
                </h3>
                <p className="text-gray-800 leading-relaxed text-right">
                  {selectedPro.description || "هیچ توضیحی در دسترس نیست."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
              <Button onClick={handleCloseView}>بسته کردن</Button>
            </div>
          </motion.div>
        )}
      </GloableModal>

      {/* Delete Confirmation Modal */}
      <GloableModal
        open={showDeleteConfirm}
        setOpen={setShowDeleteConfirm}
        isClose={true}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">تأیید حذف</h3>
            </div>
            <p className="text-gray-600 mb-6">
              آیا مطمئن هستید که می‌خواهید این خرید را حذف کنید؟ این عمل قابل
              بازگشت نیست.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                لغو
              </button>
              <button
                onClick={() => {
                  confirmDeleteProduct();
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "در حال حذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      </GloableModal>
    </section>
  );
}

export default Product;
