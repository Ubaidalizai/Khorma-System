import { BiTrashAlt } from "react-icons/bi";
import { formatCurrency, normalizeDateToIso } from "../utilies/helper";
import {
  useCustomers,
  useEmployees,
  useProduct,
  useUnits,
} from "./../services/useApi";
import { inputStyle } from "./ProductForm";
import Spinner from "./Spinner";
import Table from "./Table";
import TableBody from "./TableBody";
import TableColumn from "./TableColumn";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { useSubmitLock } from "../hooks/useSubmitLock.js";
import JalaliDatePicker from "./JalaliDatePicker";
const productHeader = [
  { title: "محصول" },
  { title: "واحد" },
  { title: "نمبر بچ" },
  { title: "تعداد" },
  { title: "قیمت واحد" },
  { title: "قیمت مجموعی" },
  { title: "عملیات" },
];
export default function SalesForm({
  items,
  setItems,
  currentItem,
  summary,
  setCurrentItem,
  reset,
  createSale,
  close,
  register,
  setValue,
  handleSubmit,
  watch,
  errors,
}) {
  const { data: products, isLoading: isLoadingProduct } = useProduct();
  const { data: units, isLoading: isLoadingUnits } = useUnits();
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();
  const { data: employees, isLoading: isLoadingEmployees } = useEmployees();
  const { isSubmitting, wrapSubmit } = useSubmitLock();
  const saleDateValue = watch("saleDate") || "";
  const formSetValue =
    setValue ||
    (() => {
      /* no-op */
    });

  const getProductName = (id) => {
    return products?.data?.find((p) => p._id === id)?.name || id;
  };

  const getUnitName = (id) => {
    return units?.data?.find((u) => u._id === id)?.name || id;
  };
  const handleAddItem = () => {
    const quantity = Number(currentItem.quantity) || 0;
    const unitPrice = Number(currentItem.unitPrice) || 0;
    const totalPrice = quantity * unitPrice;
    setItems([
      ...items,
      {
        product: currentItem.product,
        unit: currentItem.unit,
        batchNumber: currentItem.batchNumber || "",
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

  const onSubmit = wrapSubmit(async (data) => {
    const totals = summary();
    await Promise.resolve(
      createSale({
      ...data,
      saleDate: normalizeDateToIso(data.saleDate) || new Date().toISOString().slice(0, 10),
      items: [...items],
      subtotal: parseFloat(totals.subtotal),
      taxAmount: parseFloat(totals.taxAmount),
      totalAmount: totals.total,
      amountPaid: data.saleType === "cash" ? parseFloat(totals.total) : 0,
      amountOwed: data.saleType === "cash" ? 0 : parseFloat(totals.total),
      paymentStatus: data.saleType === "cash" ? "paid" : "pending",
      createdBy: "Admin",
      lastUpdated: new Date().toISOString(),
      })
    );
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
  });

  if (
    isLoadingCustomers ||
    isLoadingEmployees ||
    isLoadingProduct ||
    isLoadingUnits
  )
    return (
      <div className="g-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex justify-center items-center">
        <Spinner />
      </div>
    );
  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">فروش جدید:</h2>
      </div>

      <div className="p-6">
        {/* Header fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاریخ فروش *
            </label>
            <JalaliDatePicker
              name="saleDate"
              value={saleDateValue}
              onChange={(nextValue) =>
                formSetValue(
                  "saleDate",
                  normalizeDateToIso(nextValue) ||
                    new Date().toISOString().slice(0, 10),
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                )
              }
              placeholder="انتخاب تاریخ"
              clearable={false}
            />
            <input
              type="hidden"
              value={saleDateValue}
              readOnly
              {...register("saleDate", {
                required: "تاریخ فروش را انتخاب کنید",
              })}
            />
            {errors?.saleDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.saleDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مشتری *
            </label>
            <select
              {...register("customer", { required: "مشتری را انتخاب کنید" })}
              className={inputStyle}
            >
              <option value="">انتخاب مشتری</option>
              {customers?.data?.map((c) => {
                const id = c._id || c.id;
                return (
                  <option key={id} value={id}>
                    {c.name}
                  </option>
                );
              })}
            </select>
            {errors?.customer && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.customer.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              کارمند *
            </label>
            <select
              {...register("employee", { required: "کارمند را انتخاب کنید" })}
              className={inputStyle}
            >
              <option value="">انتخاب کارمند</option>
              {employees?.data?.map((e) => {
                const id = e._id || e.id;
                return (
                  <option key={id} value={id}>
                    {e.name}
                  </option>
                );
              })}
            </select>
            {errors?.employee && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.employee.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوعیت فروش*
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="cash"
                  {...register("saleType", {
                    required: "نوعیت فروش را انتخاب کنید",
                  })}
                  className="ml-2"
                />
                <span className="mr-2 text-sm">نقد</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="credit"
                  {...register("saleType", {
                    required: "نوعیت فروش را انتخاب کنید",
                  })}
                  className="ml-2"
                />
                <span className="mr-2 text-sm">نسیه</span>
              </label>
            </div>
            {errors?.saleType && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.saleType.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوعیت فاکتور*
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="small"
                  {...register("billType", {
                    required: "نوعیت فاکتور را انتخاب کنید",
                  })}
                  className="ml-2"
                />
                <span className="mr-2 text-sm">کوچک</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="large"
                  {...register("billType", {
                    required: "نوعیت فاکتور را انتخاب کنید",
                  })}
                  className="ml-2"
                />
                <span className="mr-2 text-sm">بزرگ</span>
              </label>
            </div>
            {errors?.billType && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.billType.message}
              </p>
            )}
          </div>
        </div>

        {/* Sale Items area */}
        <div className="border border-gray-300 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">فروش اجناس</h3>
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

          {/* Inline item editor */}

          <div className="grid grid-cols-4 grid-rows-2 gap-4">
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
                <option value="">Select product</option>
                {products?.data?.map((p, index) => (
                  <option key={index} value={p._id}>
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
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 col-start-3 row-start-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Batch #
              </label>
              <input
                type="text"
                value={currentItem?.batchNumber || ""}
                onChange={(e) =>
                  setCurrentItem((s) => ({ ...s, batchNumber: e.target.value }))
                }
                className={inputStyle}
                placeholder="Optional batch #"
              />
            </div>
            <div className="col-start-2 row-start-2">
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
            <div className="col-start-1 row-start-2">
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

          {/* Items table */}
          {items?.length > 0 && (
            <div className="overflow-auto">
              <Table className="w-full text-sm">
                <TableHeader headerData={productHeader} />
                <TableBody>
                  {items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableColumn>{getProductName(item.product)}</TableColumn>
                      <TableColumn>{getUnitName(item.unit)}</TableColumn>
                      <TableColumn>{item.quantity}</TableColumn>
                      <TableColumn>{item.batchNumber}</TableColumn>
                      <TableColumn>
                        {formatCurrency(item.unitPrice)}
                      </TableColumn>
                      <TableColumn>
                        {formatCurrency(item.totalPrice)}
                      </TableColumn>
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

        {/* Discount / Tax / Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تخفیف ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("discount", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مالیه (%)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("tax", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              یاداشت
            </label>
            <input
              type="text"
              {...register("notes")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Additional notes"
            />
          </div>
        </div>

        {/* Summary */}
        {items?.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              خلاصه فروش
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">مجموع نسبی:</span>
                <span className="font-semibold">
                  {formatCurrency(summary().subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">تخفیف:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(watch("discount"))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  مالیه ({watch("tax")}):
                </span>
                <span className="font-semibold">
                  {formatCurrency(summary().taxAmount)}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">مجموعه کلی:</span>
                  <span className="text-2xl font-bold text-amber-600">
                    {formatCurrency(summary().total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t flex justify-end gap-4">
        <button
          type="button"
          onClick={() => close && close()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 ${
            isSubmitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Saving..." : "Create Sale"}
        </button>
      </div>
    </form>
  );
}
