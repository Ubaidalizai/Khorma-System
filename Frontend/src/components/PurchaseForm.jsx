import React from "react";
import { BiTrashAlt } from "react-icons/bi";
import { useSuppliers, useUnits, useProduct, useAccounts } from "../services/useApi";
import { formatCurrency } from "../utilies/helper";
import { inputStyle } from "./ProductForm";
import Table from "./Table";
import TableBody from "./TableBody";
import TableColumn from "./TableColumn";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

const productHeader = [
  { title: "محصول" },
  { title: "واحد" },
  { title: "نمبر بچ" },
  { title: "تعداد" },
  { title: "قیمت واحد" },
  { title: "قیمت مجموعی" },
  { title: "عملیات" },
];

function PurchaseForm({
  register,
  handleSubmit,
  watch,

  calculatePurchaseTotals,
  currentItem,
  setCurrentItem,
  items,
  setItems,
  close,
  errors,
}) {
  const { data: suppliers } = useSuppliers();
  const { data: units } = useUnits();
  const { data: products } = useProduct();
  const {data: paymentAccount} = useAccounts()
  const handleAddItem = () => {
    const quantity = Number(currentItem.quantity) || 0;
    const unitPrice = Number(currentItem.unitPrice) || 0;
    const totalPrice = quantity * unitPrice;
    setItems([
      ...items,
      {
        product: currentItem.product,
        unit: currentItem.unit,
        batchNumber: currentItem.batchNumber || null,
        quantity,
        unitPrice,
        totalPrice,
      },
    ]);
    setCurrentItem({
      product: "",
      unit: "",
      batchNumber: "",
      quantity: 0,
      unitPrice: 0,
    });
  };
  const handleRemove = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-xl max-w-4xl w-[700px] max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">ایجاد یک خرید جدید</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاریخ خرید *
            </label>
            <input
              type="date"
              {...register("purchaseDate", {
                required: "تاریخ خرید را انتخاب کنید",
              })}
              className={inputStyle}
            />
            {errors?.purchaseDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.purchaseDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تهیه کننده *
            </label>
            <select
              {...register("supplier", {
                required: "تامین کننده را انتخاب کنید",
              })}
              className={inputStyle}
            >
              <option value="">انتخاب تامین کننده</option>
              {suppliers?.data?.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {errors?.supplier && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.supplier.message}
              </p>
            )}
          </div>
          <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
              حساب پرداخت کننده*
            </label>
            <select
              {...register("AccountPayment", {
                required: "حساب پرداخت کننده را باید انتخاب کنید",
              })}
              className={inputStyle}
            >
              <option value="">
                حساب پرداخت کننده را انتخاب کنید
              </option>
              {paymentAccount?.accounts?.map((payment) => (
                <option key={payment._id} value={payment._id}>
                  {payment.name}
                </option>
              ))}
            </select>
            {errors?.paymentAccount  && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.paymentAccount.message}
              </p>
            )}
            </div>
          
          <div className="border col-start-1 col-end-4 border-gray-300 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                خرید اجناس
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  اضافه کردن
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 grid-rows-2 gap-4 w-full p-6 rounded-lg bg-gray-50">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  اسم محصول
                </label>
                <select
                  value={currentItem?.product}
                  onChange={(e) =>
                    setCurrentItem((s) => ({ ...s, product: e.target.value }))
                  }
                  className={inputStyle}
                >
                  <option value="">انتخاب محصول</option>
                  {products?.products?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 col-start-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  واحد اندازه گیری
                </label>
                <select
                  value={currentItem?.unit}
                  onChange={(e) =>
                    setCurrentItem((s) => ({ ...s, unit: e.target.value }))
                  }
                  className={inputStyle}
                >
                  <option value="">Unit</option>
                  {units?.data?.map((u) => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 col-start-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  نمبر بچ
                </label>
                <input
                  type="text"
                  value={currentItem?.batchNumber || ""}
                  onChange={(e) =>
                    setCurrentItem((s) => ({
                      ...s,
                      batchNumber: e.target.value,
                    }))
                  }
                  className={inputStyle}
                  placeholder="اختیاری"
                />
              </div>
              <div className=" row-start-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  تعداد
                </label>
                <input
                  type="number"
                  value={currentItem?.quantity}
                  onChange={(e) =>
                    setCurrentItem((s) => ({ ...s, quantity: e.target.value }))
                  }
                  className={inputStyle}
                />
              </div>
              <div className=" row-start-2 col-start-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  قیمت یک
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentItem?.unitPrice}
                  onChange={(e) =>
                    setCurrentItem((s) => ({ ...s, unitPrice: e.target.value }))
                  }
                  className={inputStyle}
                />
              </div>
            </div>
            {items?.length > 0 && (
              <div className="overflow-auto">
                <Table className="w-full text-sm">
                  <TableHeader headerData={productHeader} />
                  <TableBody>
                    {items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableColumn>{products?.data?.find((p) => p._id === item.product)?.name || item.product}</TableColumn>
                        <TableColumn>{units?.data?.find((u) => u._id === item.unit)?.name || item.unit}</TableColumn>
                        <TableColumn>{item.batchNumber}</TableColumn>
                        <TableColumn>{item.quantity}</TableColumn>
                        <TableColumn>{formatCurrency(item.unitPrice)}</TableColumn>
                        <TableColumn>{formatCurrency(item.totalPrice)}</TableColumn>
                        <TableColumn>
                          <button
                            onClick={() => handleRemove(index)}
                            className=" p-1 "
                          >
                            <BiTrashAlt className=" text-warning-orange" />
                          </button>
                        </TableColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مبلغ پرداخت شده (اختیاری)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("paidAmount")}
              className={inputStyle}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Purchase Summary */}
      </div>
      {items?.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            خلاصه خرید
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">قیمت مجموعی خرید:</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(items.reduce((s, it) => s + (Number(it.totalPrice)||0), 0))}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-300">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">مجموعه:</span>
                <span className="text-xl font-bold text-amber-600">
                  {formatCurrency(items.reduce((s, it) => s + (Number(it.totalPrice)||0), 0))}
                </span>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-600">پرداخت شده:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(watch("paidAmount") || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">باقی مانده:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency((items.reduce((s, it) => s + (Number(it.totalPrice)||0), 0) - (Number(watch("paidAmount"))||0)))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => {
            close && close();
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          لغو
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          اضافه کردن خرید
        </button>
      </div>
    </form>
  );
}

export default PurchaseForm;
