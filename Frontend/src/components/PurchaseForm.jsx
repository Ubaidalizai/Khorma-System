import React, { useState, useEffect } from "react";
import { useSuppliers, useUnits } from "../services/useApi";
import { inputStyle } from "./ProductForm";
import { BiTrashAlt } from "react-icons/bi";
import Table from "./Table";
import TableBody from "./TableBody";
import TableColumn from "./TableColumn";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { formatCurrency } from "../utilies/helper";
import {
  fetchSuppliers,
  fetchProducts,
  fetchUnits,
  fetchAccounts,
} from "../services/apiUtiles";

const productHeader = [
  { title: "محصول" },
  { title: "واحد" },
  { title: "Batch" },
  { title: "تعداد" },
  { title: "قیمت یک" },
  { title: "مجموع" },
  { title: "عملیات" },
];

function PurchaseForm({
  register,
  handleSubmit,
  watch,
  reset,
  createPurchase,
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
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    setItems([
      ...items,
      { ...currentItem, total: currentItem.unitPrice * currentItem.quantity },
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
  const onSubmit = (data) => {
    const totals = calculatePurchaseTotals();
    console.log(data);
    createPurchase({
      ...data,
      purchaseDate: data.purchaseDate ? data.purchaseDate : Date.now(),
      items: [...items],
      subtotal: parseFloat(totals.subtotal),
      taxAmount: parseFloat(totals.taxAmount),
      totalAmount: totals.total,
      paidAmount:
        watch("paymentStatus") === "paid" ? parseFloat(totals.total) : 0,
      dueAmount:
        watch("paymentStatus") === "paid" ? 0 : parseFloat(totals.total),
      paymentStatus:
        watch("paymentStatus") === "paid" ? "completed" : "pending",
      createdBy: "Admin",
      lastUpdated: new Date().toISOString(),
    });
    reset();
    setItems([]);
    setCurrentItem({
      product: "",
      unit: "",
      batchNumber: "",
      quantity: 0,
      unitPrice: 0,
    });
    close && close();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className='bg-white rounded-lg shadow-xl max-w-4xl w-[700px] max-h-[90vh] overflow-y-auto'
    >
      <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-900'>ایجاد یک خرید جدید</h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              تاریخ خرید *
            </label>
            <input
              type='date'
              {...register("purchaseDate", {
                required: "تاریخ خرید را انتخاب کنید",
              })}
              className={inputStyle}
            />
            {errors?.purchaseDate && (
              <p className='text-red-500 text-sm mt-1'>
                {errors?.purchaseDate.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              تهیه کننده *
            </label>
            <select
              {...register("supplier", {
                required: "تامین کننده را انتخاب کنید",
              })}
              className={inputStyle}
            >
              <option value=''>انتخاب تامین کننده</option>
              {suppliers?.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {errors?.supplier && (
              <p className='text-red-500 text-sm mt-1'>
                {errors?.supplier.message}
              </p>
            )}
          </div>
          <div className='border col-start-1 col-end-3 border-gray-300 rounded-lg p-4 mb-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                خرید اجناس
              </h3>
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={handleAddItem}
                  className='px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700'
                >
                  اضافه کردن
                </button>
              </div>
            </div>
            <div className='grid grid-cols-4 grid-rows-2 gap-4 w-full   p-6 rounded-lg  '>
              <div className='col-span-2'>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  اسم محصول
                </label>
                <input
                  text='text'
                  className={inputStyle}
                  value={currentItem?.product}
                  onChange={(e) =>
                    setCurrentItem((s) => ({ ...s, product: e.target.value }))
                  }
                />
              </div>
              <div className='col-span-2 col-start-3'>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  واحد اندازه گیری
                </label>
                <select
                  value={currentItem?.unit}
                  onChange={(e) =>
                    setCurrentItem((s) => ({ ...s, unit: e.target.value }))
                  }
                  className={inputStyle}
                >
                  <option value=''>Unit</option>
                  {units?.map((u, index) => (
                    <option key={index} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col-span-2 col-start-3 row-start-2'>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Batch #
                </label>
                <input
                  type='text'
                  value={currentItem?.batchNumber || ""}
                  onChange={(e) =>
                    setCurrentItem((s) => ({
                      ...s,
                      batchNumber: e.target.value,
                    }))
                  }
                  className={inputStyle}
                  placeholder='Optional batch #'
                />
              </div>
              <div className='col-start-2 row-start-2'>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  تعداد
                </label>
                <input
                  type='number'
                  value={currentItem?.quantity}
                  onChange={(e) =>
                    setCurrentItem((s) => ({ ...s, quantity: e.target.value }))
                  }
                  className={inputStyle}
                />
              </div>
              <div className='col-start-1 row-start-2'>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  قیمت یک
                </label>
                <input
                  type='number'
                  step='0.01'
                  value={currentItem?.unitPrice}
                  onChange={(e) =>
                    setCurrentItem((s) => ({ ...s, unitPrice: e.target.value }))
                  }
                  className={inputStyle}
                />
              </div>
            </div>
            {items?.length > 0 && (
              <div className='overflow-auto'>
                <Table className='w-full text-sm'>
                  <TableHeader headerData={productHeader} />
                  <TableBody>
                    {items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableColumn>{item.product}</TableColumn>
                        <TableColumn>{item.unit}</TableColumn>
                        <TableColumn>{item.quantity}</TableColumn>
                        <TableColumn>{item.batchNumber}</TableColumn>
                        <TableColumn>{item.unitPrice}</TableColumn>
                        <TableColumn>{item.total}</TableColumn>
                        <TableColumn>
                          <button
                            onClick={() => handleRemove(index)}
                            className=' p-1 '
                          >
                            <BiTrashAlt className=' text-warning-orange' />
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
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              مالیه (%)
            </label>
            <input
              type='number'
              step='0.01'
              {...register("tax")}
              className={inputStyle}
              placeholder='0'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              تخفیف ($)
            </label>
            <input
              type='number'
              step='0.01'
              {...register("discount")}
              className={inputStyle}
              placeholder='0.00'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              قیمت نقل مکان ($)
            </label>
            <input
              type='number'
              step='0.01'
              {...register("shippingCost")}
              className={inputStyle}
              placeholder='0.00'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              وضعیت پرداخت *
            </label>
            <select
              {...register("paymentStatus", {
                required: "وضعیت پرداخت را انتخاب کنید",
              })}
              className={inputStyle}
            >
              <option value=''>انتخاب وضعیت پرداخت</option>
              <option value='pending'>Pending</option>
              <option value='partial'>Partial Payment</option>
              <option value='paid'>Paid</option>
            </select>
            {errors?.paymentStatus && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.paymentStatus.message}
              </p>
            )}
          </div>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              یاداشت
            </label>
            <textarea
              {...register("notes")}
              rows='3'
              className={inputStyle}
              placeholder='Additional notes...'
            ></textarea>
          </div>
        </div>

        {/* Purchase Summary */}
      </div>
      {items?.length > 0 && (
        <div className='bg-gray-50 rounded-lg p-4 mb-4'>
          <h3 className='text-lg font-semibold text-gray-900 mb-3'>
            خلاصه خرید
          </h3>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>مجموعه نسبی:</span>
              <span className='font-semibold text-gray-900'>
                {formatCurrency(calculatePurchaseTotals().subtotal)}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>مالیه ({watch("tax")}%):</span>
              <span className='font-semibold text-gray-900'>
                {formatCurrency(calculatePurchaseTotals().taxAmount)}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>تخفیف:</span>
              <span className='font-semibold text-red-600'>
                {formatCurrency(watch("discount"))}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>قیمت نقل مکان</span>
              <span className='font-semibold text-gray-900'>
                {formatCurrency(watch("shippingCost"))}
              </span>
            </div>
            <div className='pt-2 border-t border-gray-300'>
              <div className='flex justify-between'>
                <span className='font-bold text-gray-900'>مجموعه:</span>
                <span className='text-xl font-bold text-amber-600'>
                  {formatCurrency(calculatePurchaseTotals().total.toFixed(2))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='p-6 border-t border-gray-200 flex justify-end gap-4'>
        <button
          type='button'
          onClick={() => {
            close && close();
          }}
          className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
        >
          لغو
        </button>
        <button
          type='submit'
          className='px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700'
        >
          {loading ? "در حال بارگذاری..." : "اضافه کردن خرید"}
        </button>
      </div>
    </form>
  );
}

export default PurchaseForm;
