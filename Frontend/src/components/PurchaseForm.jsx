import React from "react";
import { useSuppliers, useUnits } from "../services/useApi";
import { inputStyle } from "./ProductForm";
import { BiTrashAlt } from "react-icons/bi";
import Table from "./Table";
import TableBody from "./TableBody";
import TableColumn from "./TableColumn";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { formatCurrency } from "../utilies/helper";
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
  calculatePurchaseTotals,
  currentItem,
  setCurrentItem,
  items,
  setItems,
  summary,
  onCancel,
}) {
  const { data: suppliers } = useSuppliers();
  const { data: units } = useUnits();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Date *
            </label>
            <input
              type="date"
              {...register("purchaseDate")}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier *
            </label>
            <select {...register("supplier")} className={inputStyle}>
              {suppliers?.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div className="border col-start-1 col-end-3 border-gray-300 rounded-lg p-4 mb-4">
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
            <div className="grid grid-cols-4 grid-rows-2 gap-4 w-full   p-6 rounded-lg  ">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  اسم محصول
                </label>
                <input
                  text="text"
                  className={inputStyle}
                  value={currentItem?.product}
                  onChange={(e) =>
                    setCurrentItem((s) => ({ ...s, product: e.target.value }))
                  }
                />
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
                  {units?.map((u, index) => (
                    <option key={index} value={u.id}>
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
                    setCurrentItem((s) => ({
                      ...s,
                      batchNumber: e.target.value,
                    }))
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
            {items?.length > 0 && (
              <div className="overflow-auto">
                <Table className="w-full text-sm">
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
              Tax (%)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("tax")}
              className={inputStyle}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("discount")}
              className={inputStyle}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("shippingCost")}
              className={inputStyle}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status *
            </label>
            <select {...register("paymentStatus")} className={inputStyle}>
              <option value="pending">Pending</option>
              <option value="partial">Partial Payment</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              {...register("notes")}
              rows="3"
              className={inputStyle}
              placeholder="Additional notes..."
            ></textarea>
          </div>
        </div>

        {/* Purchase Summary */}
        {watch("quantity") > 0 && watch("unitPrice") > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Purchase Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  ${calculatePurchaseTotals().subtotal}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax ({watch("tax")}%):</span>
                <span className="font-semibold text-gray-900">
                  ${calculatePurchaseTotals().taxAmount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-semibold text-red-600">
                  -${watch("discount")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold text-gray-900">
                  ${watch("shippingCost")}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-300">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total Amount:</span>
                  <span className="text-xl font-bold text-amber-600">
                    ${calculatePurchaseTotals().total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {items?.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            خلاصه خرید
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="font-semibold">{summary().subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Discount:</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(watch("discount"))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Tax ({watch("tax")}%):
              </span>
              <span className="font-semibold">
                {formatCurrency(summary().taxAmount)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total:</span>
                <span className="text-2xl font-bold text-amber-600">
                  {formatCurrency(summary().total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
        <button
          onClick={() => {}}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onCancel && onCancel();
          }}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Add Purchase
        </button>
      </div>
    </form>
  );
}

export default PurchaseForm;
