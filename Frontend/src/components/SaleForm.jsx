import { CgClose } from "react-icons/cg";
import React, { useState } from "react";
import {
  useProductsFromStock,
  useAccounts,
  useSystemAccounts,
  useUnits,
  useBatchesByProduct,
} from "../services/useApi";

// Searchable Select Component
const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "انتخاب کنید...",
  searchPlaceholder = "جستجو...",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = (Array.isArray(options) ? options : []).filter(
    (option) =>
      option.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = (Array.isArray(options) ? options : []).find(
    (option) => option._id === value || option.value === value
  );

  return (
    <div className="relative">
      <button
        type="button"
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-right flex justify-between items-center ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption
            ? selectedOption.name || selectedOption.label
            : placeholder}
        </span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-right"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                نتیجه‌ای یافت نشد
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option._id || option.value}
                  type="button"
                  className="w-full px-3 py-2 text-right hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => {
                    onChange(option._id || option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {option.name || option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function SaleForm({
  register,
  handleSubmit,
  watch,
  setValue,
  onClose,
  onSubmit,
}) {
  const [items, setItems] = useState([
    { product: "", unit: "", batchNumber: "", quantity: 0, unitPrice: 0 },
  ]);
  const [saleType, setSaleType] = useState("customer"); // "customer", "employee", "walkin"
  const [loading, setLoading] = useState(false);

  // API hooks
  const { data: stockData, isLoading: productsLoading } =
    useProductsFromStock("store");
  // People accounts (customers/employees) instead of raw people
  const { data: customerAccResp, isLoading: customersLoading } = useAccounts({
    type: "customer",
    page: 1,
    limit: 1000,
  });
  const { data: employeeAccResp, isLoading: employeesLoading } = useAccounts({
    type: "employee",
    page: 1,
    limit: 1000,
  });
  const { data: accountsData, isLoading: accountsLoading } =
    useSystemAccounts();
  const { data: units, isLoading: unitsLoading } = useUnits();

  // Extract accounts array from the response
  const accounts = accountsData?.accounts || accountsData || [];

  // Extract customer/employee accounts arrays
  const customerAccounts =
    customerAccResp?.accounts || customerAccResp?.data || customerAccResp || [];
  const employeeAccounts =
    employeeAccResp?.accounts || employeeAccResp?.data || employeeAccResp || [];

  // Get unique products from stock data
  const products = React.useMemo(() => {
    if (!stockData || !Array.isArray(stockData)) return [];

    // Group by product ID to get unique products
    const productMap = new Map();
    stockData.forEach((stock) => {
      if (stock.product && !productMap.has(stock.product._id)) {
        productMap.set(stock.product._id, {
          _id: stock.product._id,
          name: stock.product.name,
        });
      }
    });

    return Array.from(productMap.values());
  }, [stockData]);

  // Get batches for selected product - only fetch when product is selected
  const selectedProductId = items[0]?.product;
  const { data: batchesData, isLoading: batchesLoading } = useBatchesByProduct(
    selectedProductId,
    "store"
  );
  const batches = Array.isArray(batchesData) ? batchesData : [];

  const addItem = () => {
    setItems([
      ...items,
      { product: "", unit: "", batchNumber: "", quantity: 0, unitPrice: 0 },
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // If product changes, reset unit, batch, and price
    if (field === "product") {
      newItems[index].unit = "";
      newItems[index].batchNumber = "";
      newItems[index].unitPrice = 0;
    }

    // If batch changes, update price
    if (field === "batchNumber") {
      const batch = batches?.find((b) => b.batchNumber === value);
      if (batch) {
        newItems[index].unitPrice = batch.purchasePricePerBaseUnit || 0;
      }
    }

    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemTotal =
        parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0);
      return total + itemTotal;
    }, 0);
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      const saleData = {
        customer: saleType === "customer" ? data.customer : null,
        employee: saleType === "employee" ? data.employee : null,
        saleDate: new Date().toISOString(),
        items: items
          .filter((item) => item.product && item.quantity > 0)
          .map((item) => ({
            product: item.product,
            unit: item.unit,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
          })),
        paidAmount: data.paidAmount || 0,
        placedIn: data.placedIn || accounts?.[0]?._id,
        invoiceType: data.invoiceType || "small",
      };

      if (onSubmit) {
        await onSubmit(saleData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debug logging
  console.log("SaleForm Debug:", {
    accounts,
    accountsLoading,
    customerAccounts,
    employeeAccounts,
    products,
    productsLoading,
    batches,
    selectedProductId,
    // Raw API responses
    customerAccResp,
    employeeAccResp,
    customersLoading,
    employeesLoading,
  });

  // Show loading state if data is being fetched
  if (
    productsLoading ||
    customersLoading ||
    employeesLoading ||
    accountsLoading ||
    unitsLoading
  ) {
    return (
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
          <p className="text-sm text-gray-500 mt-2">
            Loading: Products={productsLoading ? "Yes" : "No"}, Customers=
            {customersLoading ? "Yes" : "No"}, Employees=
            {employeesLoading ? "Yes" : "No"}, Accounts=
            {accountsLoading ? "Yes" : "No"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white w-full"
    >
      <div className="p-6 relative  border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          اضافه کردن فروش جدید
        </h2>
        <div className=" ">
          <CgClose className=" text-[20px]" onClick={onClose} />
        </div>
      </div>
      <div className="p-6">
        {/* Sale Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            نوع فروش
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="customer"
                checked={saleType === "customer"}
                onChange={(e) => setSaleType(e.target.value)}
                className="ml-2"
              />
              <span className="mr-2 text-sm">مشتری</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="employee"
                checked={saleType === "employee"}
                onChange={(e) => setSaleType(e.target.value)}
                className="ml-2"
              />
              <span className="mr-2 text-sm">کارمند</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="walkin"
                checked={saleType === "walkin"}
                onChange={(e) => setSaleType(e.target.value)}
                className="ml-2"
              />
              <span className="mr-2 text-sm">مشتری عابر</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Customer/Employee Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {saleType === "customer"
                ? "مشتری"
                : saleType === "employee"
                ? "کارمند"
                : "مشتری عابر"}
            </label>
            {saleType === "customer" && (
              <div>
                <SearchableSelect
                  options={customerAccounts.map((acc) => ({
                    _id: acc.refId,
                    name: acc.name,
                  }))}
                  value={watch("customer")}
                  onChange={(value) => setValue("customer", value)}
                  placeholder="انتخاب مشتری (حساب)"
                  searchPlaceholder="جستجو حساب مشتری..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Found {customerAccounts.length} customer accounts
                </p>
              </div>
            )}
            {saleType === "employee" && (
              <div>
                <SearchableSelect
                  options={employeeAccounts.map((acc) => ({
                    _id: acc.refId,
                    name: acc.name,
                  }))}
                  value={watch("employee")}
                  onChange={(value) => setValue("employee", value)}
                  placeholder="انتخاب کارمند (حساب)"
                  searchPlaceholder="جستجو حساب کارمند..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Found {employeeAccounts.length} employee accounts
                </p>
              </div>
            )}
            {saleType === "walkin" && (
              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 text-center">
                مشتری عابر
              </div>
            )}
          </div>

          {/* Invoice Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع فاکتور
            </label>
            <select
              {...register("invoiceType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="small">کوچک</option>
              <option value="large">بزرگ</option>
            </select>
          </div>

          {/* Account Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حساب دریافت
            </label>
            <SearchableSelect
              options={accounts || []}
              value={watch("placedIn")}
              onChange={(value) =>
                register("placedIn").onChange({ target: { value } })
              }
              placeholder="انتخاب حساب"
              searchPlaceholder="جستجو حساب..."
            />
          </div>

          {/* Paid Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مبلغ پرداخت شده
            </label>
            <input
              type="number"
              step="0.01"
              {...register("paidAmount", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">اقلام فروش</h3>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              اضافه کردن قلم
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    محصول *
                  </label>
                  <SearchableSelect
                    options={products || []}
                    value={item.product}
                    onChange={(value) => updateItem(index, "product", value)}
                    placeholder="انتخاب محصول"
                    searchPlaceholder="جستجو محصول..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    واحد *
                  </label>
                  <SearchableSelect
                    options={units?.data || []}
                    value={item.unit}
                    onChange={(value) => updateItem(index, "unit", value)}
                    placeholder="انتخاب واحد"
                    searchPlaceholder="جستجو واحد..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شماره بچ (اختیاری - برای وضوح)
                  </label>
                  <SearchableSelect
                    options={
                      batches?.map((batch) => ({
                        _id: batch.batchNumber,
                        name: `${batch.batchNumber} (موجودی: ${batch.quantity})`,
                        batchNumber: batch.batchNumber,
                        quantity: batch.quantity,
                      })) || []
                    }
                    value={item.batchNumber}
                    onChange={(value) =>
                      updateItem(index, "batchNumber", value)
                    }
                    placeholder="انتخاب بچ (اختیاری)"
                    searchPlaceholder="جستجو بچ..."
                  />
                  {batchesLoading && selectedProductId && (
                    <p className="text-xs text-gray-500 mt-1">
                      در حال بارگذاری بچ‌ها...
                    </p>
                  )}
                  {!batchesLoading &&
                    batches.length === 0 &&
                    selectedProductId && (
                      <p className="text-xs text-gray-500 mt-1">
                        هیچ بچ موجودی برای این محصول یافت نشد
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مقدار *
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    قیمت واحد *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "unitPrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    required
                  />
                </div>

                <div className="flex items-end col-span-5">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sale Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            خلاصه فروش
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">مجموع:</span>
              <span className="font-semibold text-gray-900">
                {calculateTotal().toFixed(2)} افغانی
              </span>
            </div>
            <div className="pt-2 border-t border-gray-300">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">مجموع نهایی:</span>
                <span className="text-xl font-bold text-amber-600">
                  {calculateTotal().toFixed(2)} افغانی
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          لغو
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          disabled={loading}
        >
          {loading ? "در حال بارگذاری..." : "اضافه کردن فروش"}
        </button>
      </div>
    </form>
  );
}

export default SaleForm;
