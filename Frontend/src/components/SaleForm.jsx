import { CgClose } from "react-icons/cg";
import { BiTrashAlt } from "react-icons/bi";
import React, { useState, useEffect } from "react";
import {
  useProductsFromStock,
  useAccounts,
  useSystemAccounts,
  useUnits,
  useBatchesByProduct,
  useEmployeeStocks,
} from "../services/useApi";
import Table from "./Table";
import { formatCurrency } from "../utilies/helper";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableRow from "./TableRow";
import TableColumn from "./TableColumn";
import Select from "./Select";

const productHeader = [
  { title: "محصول" },
  { title: "واحد" },
  { title: "نمبر بچ" },
  { title: "تاریخ انقضا" },
  { title: "تعداد" },
  { title: "قیمت واحد" },
  { title: "قیمت مجموعی" },
  { title: "عملیات" },
];

function SaleForm({
  register,
  handleSubmit,
  watch,
  setValue,
  onClose,
  onSubmit,
  editMode = false,
  saleToEdit = null,
}) {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    product: "",
    unit: "",
    batchNumber: "",
    quantity: 0,
    unitPrice: 0,
    expiryDate: "",
  });
  const [saleType, setSaleType] = useState("customer"); // "customer", "employee", "walkin"
  const [loading, setLoading] = useState(false);

  // Get selected employee from form
  const selectedEmployee = watch("employee");

  // Fetch employee stock if employee is selected
  const { data: employeeStockData } = useEmployeeStocks({
    employeeId: selectedEmployee || null,
  });

  // API hooks
  const { data: stockData, isLoading: productsLoading } = useProductsFromStock(
    "store",
    false
  ); // false = exclude products with zero quantity
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

  console.log("SaleForm - Form state debug:");
  console.log("- saleType:", saleType);
  console.log("- selectedEmployee from watch:", selectedEmployee);
  console.log("- employeeAccounts length:", employeeAccounts.length);

  // Get unique products from stock data or employee stock data
  const products = React.useMemo(() => {
    // Use employee stock if employee is selected
    const dataSource =
      selectedEmployee && employeeStockData
        ? employeeStockData.data || employeeStockData
        : stockData;

    if (!dataSource || !Array.isArray(dataSource)) return [];

    // Group by product ID to get unique products
    const productMap = new Map();
    dataSource.forEach((stock) => {
      if (stock.product && !productMap.has(stock.product._id)) {
        productMap.set(stock.product._id, {
          value: stock.product._id,
          label: stock.product.name,
        });
      }
    });

    const result = Array.from(productMap.values());
    console.log("- products result:", result);
    return result;
  }, [stockData, employeeStockData, selectedEmployee]);

  // Get batches for selected product - only fetch when product is selected
  // Use employee location if employee is selected
  const selectedProductId = currentItem?.product;
  const locationForBatches = selectedEmployee ? "employee" : "store";
  const { data: batchesData } = useBatchesByProduct(
    selectedProductId,
    locationForBatches
  );
  const batches = Array.isArray(batchesData) ? batchesData : [];

  // Populate form when editing
  useEffect(() => {
    if (editMode && saleToEdit) {
      // Set sale type based on customer/employee
      if (saleToEdit.customer) {
        setSaleType("customer");
        setValue("customer", saleToEdit.customer._id || saleToEdit.customer);
      } else if (saleToEdit.employee) {
        setSaleType("employee");
        setValue("employee", saleToEdit.employee._id || saleToEdit.employee);
      }

      // Set items from sale
      if (saleToEdit.items && saleToEdit.items.length > 0) {
        const formattedItems = saleToEdit.items.map((item) => ({
          product: item.product?._id || item.product || "",
          unit: item.unit?._id || item.unit || "",
          batchNumber: item.batchNumber || "",
          expiryDate: item.expiryDate || "",
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
        }));
        setItems(formattedItems);
      }

      // Set other fields
      if (saleToEdit.placedIn) {
        setValue("placedIn", saleToEdit.placedIn._id || saleToEdit.placedIn);
      }
      if (saleToEdit.invoiceType) {
        setValue("invoiceType", saleToEdit.invoiceType);
      }
      if (saleToEdit.paidAmount !== undefined) {
        setValue("paidAmount", saleToEdit.paidAmount);
      }
    }
  }, [editMode, saleToEdit, setValue]);

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    if (currentItem.product && currentItem.quantity > 0) {
      setItems([...items, currentItem]);
      setCurrentItem({
        product: "",
        unit: "",
        batchNumber: "",
        quantity: 0,
        unitPrice: 0,
        expiryDate: "",
      });
    }
  };

  const handleRemove = (index) => {
    removeItem(index);
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
      <div className="p-3 relative  border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">
          اضافه کردن فروش جدید
        </h2>
        <div className=" ">
          <CgClose className=" text-[20px]" onClick={onClose} />
        </div>
      </div>
      <div className="p-4">
        {/* Sale Type Selection */}
        <div className="mb-3">
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

        <div className="grid grid-cols-4 gap-4 mb-6">
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
                <Select
                  label=""
                  options={customerAccounts.map((acc) => ({
                    value: acc.refId,
                    label: acc.name,
                  }))}
                  value={watch("customer")}
                  onChange={(value) => setValue("customer", value)}
                  defaultSelected="انتخاب مشتری (حساب)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Found {customerAccounts.length} customer accounts
                </p>
              </div>
            )}
            {saleType === "employee" && (
              <div>
                <Select
                  label=""
                  options={employeeAccounts.map((acc) => ({
                    value: acc.refId,
                    label: acc.name,
                  }))}
                  value={watch("employee")}
                  onChange={(value) => setValue("employee", value)}
                  defaultSelected="انتخاب کارمند (حساب)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Found {employeeAccounts.length} employee accounts
                </p>
              </div>
            )}
            {saleType === "walkin" && (
              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-sm text-gray-500 text-center">
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
              className={
                "w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-sm px-3 py-2.5 transition duration-300 ease focus:outline-none  hover:border-slate-300 focus:border-slate-300  shadow-sm"
              }
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
            <Select
              label=""
              options={accounts.map((acc) => ({
                value: acc._id,
                label: acc.name,
              }))}
              value={watch("placedIn")}
              onChange={(value) => setValue("placedIn", value)}
              defaultSelected="انتخاب حساب"
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
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-sm px-3 py-2.5 transition duration-300 ease focus:outline-none  hover:border-slate-300 focus:border-slate-300  shadow-sm"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="border col-start-1 col-end-4 border-gray-100 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">خرید اجناس</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-2 bg-green-600 text-white rounded-sm text-sm hover:bg-green-700"
              >
                اضافه کردن
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6  gap-4 w-full rounded-lg ">
            <div className="col-span-1">
              <Select
                id={"product"}
                label={" اسم محصول "}
                value={currentItem?.product}
                onChange={(value) =>
                  setCurrentItem((s) => ({ ...s, product: value }))
                }
                options={products}
              ></Select>
            </div>
            <div className=" col-span-1">
              <Select
                id={"unit"}
                label={" واحد اندازه گیری "}
                value={currentItem?.unit}
                onChange={(value) =>
                  setCurrentItem((s) => ({ ...s, unit: value }))
                }
                options={
                  units?.data?.map((u) => ({
                    value: u._id,
                    label: u.name,
                  })) || []
                }
              />
            </div>
            <div className="col-span-1">
              <Select
                label={"  نمبر بچ     "}
                id="batch"
                value={currentItem?.batchNumber || ""}
                onChange={(value) =>
                  setCurrentItem((s) => ({
                    ...s,
                    batchNumber: value,
                  }))
                }
                options={batches.map((batch) => ({
                  value: batch.batchNumber,
                  label: batch.batchNumber,
                }))}
                placeholder="اختیاری"
              />
            </div>
            <div className=" col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاریخ انقضا
              </label>
              <input
                type="date"
                value={currentItem?.expiryDate || ""}
                onChange={(e) =>
                  setCurrentItem((s) => ({
                    ...s,
                    expiryDate: e.target.value,
                  }))
                }
                className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-sm px-3 py-2.5 transition duration-300 ease focus:outline-none  hover:border-slate-300 focus:border-slate-300  shadow-sm`}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تعداد
              </label>
              <input
                type="number"
                value={currentItem?.quantity}
                onChange={(e) =>
                  setCurrentItem((s) => ({ ...s, quantity: e.target.value }))
                }
                className={
                  "w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-sm px-3 py-2.5 transition duration-300 ease focus:outline-none  hover:border-slate-300 focus:border-slate-300  shadow-sm"
                }
              />
            </div>
            <div className="-col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                قیمت یک
              </label>
              <input
                type="number"
                step="0.01"
                value={currentItem?.unitPrice}
                onChange={(e) =>
                  setCurrentItem((s) => ({ ...s, unitPrice: e.target.value }))
                }
                className={
                  "w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-sm px-3 py-2.5 transition duration-300 ease focus:outline-none  hover:border-slate-300 focus:border-slate-300  shadow-sm"
                }
              />
            </div>
          </div>
          {items?.length > 0 && (
            <div className="overflow-auto mt-3">
              <Table className="w-full text-sm">
                <TableHeader headerData={productHeader} />
                <TableBody>
                  {items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableColumn>
                        {products.find((p) => p.value === item.product)
                          ?.label || item.product}
                      </TableColumn>
                      <TableColumn>
                        {units?.data?.find((u) => u._id === item.unit)?.name ||
                          item.unit}
                      </TableColumn>
                      <TableColumn>{item.batchNumber}</TableColumn>
                      <TableColumn>{item.expiryDate}</TableColumn>
                      <TableColumn>{item.quantity}</TableColumn>
                      <TableColumn>
                        {formatCurrency(item.unitPrice)}
                      </TableColumn>
                      <TableColumn>
                        {formatCurrency(
                          (item.quantity || 0) * (item.unitPrice || 0)
                        )}
                      </TableColumn>
                      <TableColumn>
                        <button
                          type="button"
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

        {/* Sale Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className=" border-gray-300">
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
          {loading
            ? "در حال بارگذاری..."
            : editMode
            ? "ویرایش فروش"
            : "اضافه کردن فروش"}
        </button>
      </div>
    </form>
  );
}

export default SaleForm;
