import Button from "./Button";
import Modal from "./Modal";
import SearchInput from "./SearchInput";
import Select from "./Select";
import Table from "./Table";
import React, { useState } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableRow from "./TableRow";
import TableColumn from "./TableColumn";
import TableMenuModal from "./TableMenuModal";
import Menus from "./Menu";
import {
  useCreateSupplier,
  useDeletePurchase,
  usePurchases,
  useUpdatePurchase,
} from "../services/useApi";
import Spinner from "./Spinner";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Confirmation from "./Confirmation";
import { useForm } from "react-hook-form";
import GloableModal from "./GloableModal";
const tableHeader = [
  { title: "نمبر فاکتور" },
  { title: "تاریخ" },
  { title: "تهیه کننده" },
  { title: "جنس" },
  { title: "مقدار" },
  { title: "قیمت مجموعی" },
  { title: "پرداخت شده" },
  { title: "باقی مانده" },
  { title: "پرداخت" },
  { title: "حالت" },
  { title: "عملیات" },
];
function Purchase({ getPaymentStatusColor }) {
  const { data: filteredPurchases, isLoading } = usePurchases();
  const { mutate: deletePurchase } = useDeletePurchase();
  const { mutate: updatePurchase } = useUpdatePurchase();
  const { register, handleSubmit } = useForm();
  const { mutate: createSupplier } = useCreateSupplier();
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const onSubmit = (data) => {
    createSupplier({
      totalPurchases: 0,
      totalAmount: 0,
      amountOwed: 0,
      amountPaid: 0,
      status: "active",
      lastPurchase: null,
      ...data,
    });
  };
  if (isLoading) return <Spinner />;
  return (
    <section>
      <Table
        firstRow={
          <div className=" w-full flex gap-1 justify-around  ">
            <div className="flex-1 flex items-center justify-start">
              <SearchInput placeholder="لطفا جستجو کنید" />
            </div>
            <div className="flex-1">
              <Select
                placeholder="تهیه کننده"
                options={[
                  { value: " تمام تهیه کننده" },
                  { value: "غذا ها" },
                  { value: "انواع" },
                  { value: "تعداد" },
                  { value: "نان" },
                ]}
              />
            </div>
            <div className="flex-1">
              <Select
                placeholder=" تمام حالات"
                options={[
                  { value: "پرداخت شده ها" },
                  { value: " پرداخت ها نسبی" },
                  { value: "پرداخت ها معلق" },
                ]}
              />
            </div>
            <div className="flex-1 flex items-center">
              <Modal>
                <Modal.Toggle>
                  <Button className="py-[14px] bg-success-green">
                    اضافه کردن تهیه کننده
                  </Button>
                </Modal.Toggle>
                <Modal.Window>
                  <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh]  overflow-y-auto"
                  >
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900">
                        اضافه کردن تهیه کننده جدید
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Name *
                          </label>
                          <input
                            type="text"
                            {...register("name")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="Ahmed Hassan"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            {...register("company")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="Company Name Ltd"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            {...register("email")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="email@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            {...register("phone")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="+93 700 123 456"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <input
                            type="text"
                            {...register("address")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="City, Country"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax ID
                          </label>
                          <input
                            type="text"
                            {...register("taxId")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="TIN-12345"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Account
                          </label>
                          <input
                            type="text"
                            {...register("bankaccount")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="Account number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Credit Limit ($)
                          </label>
                          <input
                            type="number"
                            {...register("creditLimit")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Terms (days)
                          </label>
                          <select
                            {...register("paymentTerms")}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          >
                            <option value="15">15 days</option>
                            <option value="30">30 days</option>
                            <option value="45">45 days</option>
                            <option value="60">60 days</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                          </label>
                          <textarea
                            {...register("notes")}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="Additional notes..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
                      <button
                        onClick={() => {}}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        لغو کردن
                      </button>
                      <button
                        onClick={() => {}}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                      >
                        اضافه کردن تهیه کننده
                      </button>
                    </div>
                  </form>
                </Modal.Window>
              </Modal>
            </div>
          </div>
        }
      >
        <TableHeader headerData={tableHeader} />
        <TableBody>
          {filteredPurchases.length === 0 ? (
            <tr>
              <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-lg font-medium">No purchases found</p>
                  <p className="text-sm">
                    Try adjusting your search or filters
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            filteredPurchases.map((purchase) => (
              <TableRow key={purchase.invoiceNumber}>
                <TableColumn>{purchase.invoiceNumber}</TableColumn>
                <TableColumn>
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </TableColumn>
                <TableColumn>{purchase.supplier}</TableColumn>
                <TableColumn>{purchase.product}</TableColumn>
                <TableColumn>{purchase.quantity}</TableColumn>
                <TableColumn>{purchase.totalAmount.toFixed(2)}</TableColumn>
                <TableColumn>{purchase.amountPaid.toFixed(2)}</TableColumn>
                <TableColumn>{purchase.amountOwed.toFixed(2)}</TableColumn>
                <TableColumn>{purchase.paymentMethod}</TableColumn>
                <TableColumn className={getPaymentStatusColor(purchase.status)}>
                  {purchase.status}
                </TableColumn>
                <TableColumn
                  className={` relative ${
                    "pur234chase" +
                    purchase?.invoiceNumber +
                    new Date(purchase?.paymentDate).getMilliseconds()
                  }`}
                >
                  <TableMenuModal>
                    <Menus>
                      <Menus.Menu>
                        <Menus.Toggle id={purchase?.invoiceNumber} />
                        <Menus.List
                          parent={
                            "pur234chase" +
                            purchase?.invoiceNumber +
                            new Date(purchase?.paymentDate).getMilliseconds()
                          }
                          id={purchase?.invoiceNumber}
                          className="bg-white rounded-lg shadow-xl"
                        >
                          <Menus.Button
                            icon={<HiSquare2Stack />}
                            onClick={() => {
                              setSelectedPurchase(purchase);
                              setShowModal(true);
                            }}
                          >
                            نمایش
                          </Menus.Button>

                          <Menus.Button
                            icon={<HiPencil />}
                            onClick={() => {
                              setOpenEdit(true);
                            }}
                          >
                            ویرایش
                          </Menus.Button>

                          <TableMenuModal.Open opens="delete">
                            <Menus.Button icon={<HiTrash />}>حذف</Menus.Button>
                          </TableMenuModal.Open>
                        </Menus.List>
                      </Menus.Menu>

                      <TableMenuModal.Window name="delete" className={""}>
                        <Confirmation
                          type="delete"
                          handleClick={() => deletePurchase(purchase?.id)}
                          handleCancel={() => {}}
                        />
                      </TableMenuModal.Window>
                    </Menus>
                  </TableMenuModal>
                </TableColumn>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <GloableModal open={showModal} setOpen={setShowModal}>
        {selectedPurchase && (
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Purchase Details
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Invoice Number
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPurchase.invoiceNumber}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Purchase Date
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(
                      selectedPurchase.purchaseDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Supplier
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPurchase.supplier}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Product
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPurchase.product}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Quantity
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPurchase.quantity} units
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Unit Price
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedPurchase.unitPrice}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Subtotal
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedPurchase.subtotal.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Tax
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedPurchase.tax.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Discount
                  </h3>
                  <p className="text-lg font-semibold text-red-600">
                    -${selectedPurchase.discount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Shipping Cost
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${selectedPurchase.shippingCost.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Total Amount
                  </h3>
                  <p className="text-2xl font-bold text-amber-600">
                    ${selectedPurchase.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Payment Status
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                      selectedPurchase.paymentStatus
                    )}`}
                  >
                    {selectedPurchase.paymentStatus}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Amount Paid
                  </h3>
                  <p className="text-lg font-semibold text-green-600">
                    ${selectedPurchase.amountPaid.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Amount Owed
                  </h3>
                  <p className="text-lg font-semibold text-red-600">
                    ${selectedPurchase.amountOwed.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Payment Method
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {selectedPurchase.paymentMethod.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Created By
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPurchase.createdBy}
                  </p>
                </div>
                {selectedPurchase.notes && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Notes
                    </h3>
                    <p className="text-gray-900">{selectedPurchase.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </GloableModal>
      <GloableModal open={openEdit} setOpen={setOpenEdit}></GloableModal>
    </section>
  );
}

export default Purchase;
