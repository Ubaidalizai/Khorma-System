import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import {
  useSuppliers,
  useProducts,
  useUnits,
  useSystemAccounts,
  useCreatePurchase,
} from "../services/useApi";
import { formatCurrency } from "../utilies/helper";
import GloableModal from "./GloableModal";
import { toast } from "react-toastify";
import { useSubmitLock } from "../hooks/useSubmitLock";

const PurchaseModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, watch, reset } = useForm();
  const { data: suppliers } = useSuppliers();
  const { data: products } = useProducts();
  const { data: units } = useUnits();
  const { data: systemAccounts } = useSystemAccounts();
  const {
    mutate: createPurchase,
    isPending: isCreatingPurchase,
  } = useCreatePurchase();
  const { isSubmitting, wrapSubmit } = useSubmitLock();

  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    product: "",
    unit: "",
    quantity: 0,
    unitPrice: 0,
    batchNumber: "",
    expiryDate: "",
  });

  const watchedValues = watch();

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const paidAmount = Number(watchedValues.paidAmount) || 0;
  const dueAmount = Math.max(subtotal - paidAmount, 0);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset();
      setItems([]);
      setCurrentItem({
        product: "",
        unit: "",
        quantity: 0,
        unitPrice: 0,
        batchNumber: "",
        expiryDate: "",
      });
    }
  }, [isOpen, reset]);

  const addItem = () => {
    if (
      !currentItem.product ||
      !currentItem.unit ||
      currentItem.quantity <= 0 ||
      currentItem.unitPrice <= 0
    ) {
      toast.error("لطفاً تمام فیلدهای مورد نیاز را پر کنید");
      return;
    }

    const newItem = {
      ...currentItem,
      id: Date.now(), // temporary ID for frontend
    };

    setItems([...items, newItem]);
    setCurrentItem({
      product: "",
      unit: "",
      quantity: 0,
      unitPrice: 0,
      batchNumber: "",
      expiryDate: "",
    });
  };

  const removeItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const runMutation = (mutateFn, payload, callbacks = {}) =>
    new Promise((resolve, reject) => {
      mutateFn(payload, {
        onSuccess: (...args) => {
          callbacks.onSuccess?.(...args);
          resolve(...args);
        },
        onError: (error) => {
          callbacks.onError?.(error);
          reject(error);
        },
      });
    });

  const onSubmit = wrapSubmit(async (data) => {
    if (items.length === 0) {
      toast.error("لطفاً حداقل یک جنس اضافه کنید");
      return;
    }

    const purchaseData = {
      supplier: data.supplier,
      purchaseDate: data.purchaseDate || new Date().toISOString(),
      paidAmount: Number(data.paidAmount) || 0,
      paymentAccount: data.paymentAccount,
      items: items.map((item) => ({
        product: item.product,
        unit: item.unit,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        batchNumber: item.batchNumber || null,
        expiryDate:
          item.expiryDate && item.expiryDate !== "" ? item.expiryDate : null,
      })),
    };

    await runMutation(createPurchase, purchaseData, {
      onSuccess: () => {
        onClose();
        reset();
        setItems([]);
      },
      onError: (error) => {
        toast.error(error.message || "خطا در ایجاد خرید");
      },
    });
  });

  if (!isOpen) return null;

  return (
    <GloableModal isClose={true} open={isOpen}>
      <div className="bg-white rounded-lg shadow-xl w-[750px]  lg:w-[900px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ShoppingCartIcon className="h-6 w-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">خرید جدید</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Purchase Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تهیه کننده *
              </label>
              <select
                {...register("supplier", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">انتخاب تهیه کننده</option>
                {suppliers?.data?.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاریخ خرید
              </label>
              <input
                type="date"
                {...register("purchaseDate")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حساب پرداخت *
              </label>
              <select
                {...register("paymentAccount", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">انتخاب حساب</option>
                {systemAccounts?.accounts?.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مبلغ پرداخت شده
              </label>
              <input
                type="number"
                step="0.01"
                {...register("paidAmount")}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Add Item Form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              اضافه کردن جنس
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  محصول *
                </label>
                <select
                  value={currentItem.product}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, product: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">انتخاب محصول</option>
                  {products?.data?.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  واحد *
                </label>
                <select
                  value={currentItem.unit}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, unit: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">انتخاب واحد</option>
                  {units?.data?.map((unit) => (
                    <option key={unit._id} value={unit._id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تعداد *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  قیمت واحد *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentItem.unitPrice}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      unitPrice: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شماره بچ
                </label>
                <input
                  type="text"
                  value={currentItem.batchNumber}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      batchNumber: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="اختیاری"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاریخ انقضا
                </label>
                <input
                  type="date"
                  value={currentItem.expiryDate}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      expiryDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full flex text-[12px] items-center justify-center gap-2 px-3 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  اضافه کردن
                </button>
              </div>
            </div>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                اجناس انتخاب شده
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        محصول
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        واحد
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        تعداد
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        قیمت واحد
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        مجموع
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => {
                      const product = products?.data?.find(
                        (p) => p._id === item.product
                      );
                      const unit = units?.data?.find(
                        (u) => u._id === item.unit
                      );
                      const total = item.quantity * item.unitPrice;

                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {product?.name || "نامشخص"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {unit?.name || "نامشخص"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-purple-600">
                            {formatCurrency(total)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold text-gray-900">
                مجموع کل: {formatCurrency(subtotal)}
              </div>
              <div className="text-sm text-gray-600">
                پرداخت شده: {formatCurrency(paidAmount)} | باقی مانده:{" "}
                {formatCurrency(dueAmount)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={isCreatingPurchase || isSubmitting}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreatingPurchase || isSubmitting
                ? "در حال ایجاد..."
                : "ایجاد خرید"}
            </button>
          </div>
        </form>
      </div>
    </GloableModal>
    // <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

    // </div>
  );
};

export default PurchaseModal;
