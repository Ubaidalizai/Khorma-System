import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  BanknotesIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
  useSuppliers,
  useCustomers,
  useEmployees,
} from "../services/useApi";
import { createManualTransaction } from "../services/apiUtiles";

const Accounts = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("supplier");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const { register, handleSubmit, reset, watch } = useForm();

  const { data: accountsResp, isLoading } = useAccounts({
    type,
    search,
    page,
    limit,
  });
  const accounts = accountsResp?.accounts || accountsResp?.data || [];
  const total = accountsResp?.total || accounts.length || 0;
  const totalPages =
    accountsResp?.pages || Math.max(1, Math.ceil(total / limit));

  // Fetch entities for reference selection
  const { data: suppliersData } = useSuppliers();
  const { data: customersData } = useCustomers();
  const { data: employeesData } = useEmployees();

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  // Helper functions
  const isSystemAccount = (accountType) => {
    return ["cashier", "safe", "saraf"].includes(accountType);
  };

  const getReferenceOptions = (accountType) => {
    switch (accountType) {
      case "supplier":
        return suppliersData?.data || [];
      case "customer":
        return customersData?.data || [];
      case "employee":
        return employeesData?.data || [];
      default:
        return [];
    }
  };

  const onSubmitAccount = async (data) => {
    try {
      const accountData = {
        ...data,
        refId: isSystemAccount(data.type) ? null : data.refId,
      };

      if (editingAccount) {
        await updateAccountMutation.mutateAsync({
          id: editingAccount._id,
          accountData,
        });
      } else {
        await createAccountMutation.mutateAsync(accountData);
      }
      setShowAccountModal(false);
      setEditingAccount(null);
      reset();
    } catch (error) {
      console.error("Failed to save account:", error);
    }
  };

  const handleEdit = (acc) => {
    setEditingAccount(acc);
    setShowAccountModal(true);
    reset({
      type: acc.type,
      refId: acc.refId || "",
      name: acc.name,
      openingBalance: acc.openingBalance || 0,
      currency: acc.currency || "AFN",
    });
  };

  const handleDelete = async (acc) => {
    if (!acc?._id) return;
    if (confirm("آیا از حذف این حساب مطمئن هستید؟")) {
      try {
        await deleteAccountMutation.mutateAsync(acc._id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleAddTransaction = (acc) => {
    setSelectedAccount(acc);
    setShowTransactionModal(true);
    reset({
      transactionType: "Credit",
      amount: "",
      description: "",
    });
  };

  const onSubmitTransaction = async (data) => {
    try {
      const transactionData = {
        accountId: selectedAccount._id,
        transactionType: data.transactionType,
        amount: parseFloat(data.amount),
        description:
          data.description || `Manual ${data.transactionType} transaction`,
      };

      await createManualTransaction(transactionData);
      setShowTransactionModal(false);
      setSelectedAccount(null);
      reset();

      // Show success message
      alert("تراکنش با موفقیت اضافه شد!");

      // Refresh accounts data
      window.location.reload();
    } catch (error) {
      console.error("Failed to create transaction:", error);
      alert("خطا در ایجاد تراکنش: " + error.message);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">مدیریت حسابات</h1>
          <p className="text-gray-600 mt-1">ایجاد و مدیریت حساب های سیستم</p>
        </div>
        <button
          onClick={() => {
            setEditingAccount(null);
            reset({
              type,
              refId: "",
              name: "",
              openingBalance: 0,
              currency: "AFN",
            });
            setShowAccountModal(true);
          }}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          حساب جدید
        </button>
      </div>

      {/* Type filter and search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "supplier", label: "تهیه‌کننده", icon: BuildingOfficeIcon },
              { id: "customer", label: "مشتری", icon: UserIcon },
              { id: "employee", label: "کارمند", icon: UserIcon },
              { id: "cashier", label: "صندوق", icon: BanknotesIcon },
              { id: "safe", label: "صندوق امانات", icon: CurrencyDollarIcon },
              { id: "saraf", label: "صراف", icon: CurrencyDollarIcon },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setType(t.id);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  type === t.id
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="جستجو بر اساس نام حساب..."
              className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  نام
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  نوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  موجودی اولیه
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  موجودی فعلی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  ارز
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  تاریخ ایجاد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    در حال بارگذاری...
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    حسابی یافت نشد
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {acc.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {acc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {acc.openingBalance?.toLocaleString?.() ??
                        acc.openingBalance}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {acc.currentBalance?.toLocaleString?.() ??
                        acc.currentBalance}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {acc.currency || "AFN"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(acc.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => navigate(`/accounts/${acc._id}`)}
                          title="مشاهده جزئیات"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleAddTransaction(acc)}
                          title="افزودن تراکنش"
                        >
                          <ArrowUpIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleEdit(acc)}
                          title="ویرایش"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(acc)}
                          title="حذف"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              صفحه {page} از {totalPages} (مجموع {total} حساب)
            </div>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                قبلی
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingAccount ? "ویرایش حساب" : "ایجاد حساب جدید"}
              </h2>
              <button
                onClick={() => {
                  setShowAccountModal(false);
                  setEditingAccount(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit(onSubmitAccount)}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع حساب *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  defaultValue={type}
                  {...register("type", { required: true })}
                >
                  <option value="supplier">تهیه‌کننده</option>
                  <option value="customer">مشتری</option>
                  <option value="employee">کارمند</option>
                  <option value="cashier">صندوق</option>
                  <option value="safe">صندوق امانات</option>
                  <option value="saraf">صراف</option>
                </select>
              </div>

              {/* Reference field - only show for entity accounts */}
              {!isSystemAccount(watch("type")) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مرجع *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    {...register("refId", {
                      required: !isSystemAccount(watch("type")),
                    })}
                  >
                    <option value="">انتخاب مرجع</option>
                    {getReferenceOptions(watch("type")).map((entity) => (
                      <option key={entity._id} value={entity._id}>
                        {entity.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام حساب *
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="نام حساب"
                  {...register("name", { required: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  موجودی اولیه
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  defaultValue={0}
                  {...register("openingBalance", { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ارز
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  defaultValue="AFN"
                  {...register("currency")}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAccountModal(false);
                    setEditingAccount(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  {editingAccount ? "ذخیره تغییرات" : "ایجاد حساب"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Transaction Modal */}
      {showTransactionModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                افزودن تراکنش دستی
              </h2>
              <button
                onClick={() => {
                  setShowTransactionModal(false);
                  setSelectedAccount(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form
              onSubmit={handleSubmit(onSubmitTransaction)}
              className="p-6 space-y-4"
            >
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  حساب: {selectedAccount.name}
                </h3>
                <p className="text-sm text-blue-700">
                  موجودی فعلی:{" "}
                  {selectedAccount.currentBalance?.toLocaleString?.() ??
                    selectedAccount.currentBalance}{" "}
                  AFN
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع تراکنش *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  {...register("transactionType", { required: true })}
                >
                  <option value="Credit">
                    اعتبار (موجودی حساب افزایش می‌یابد)
                  </option>
                  <option value="Debit">بدهی (موجودی حساب کاهش می‌یابد)</option>
                  <option value="Expense">
                    مصرف (هزینه - موجودی کاهش می‌یابد)
                  </option>
                </select>
                <div className="mt-2 p-3 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    مثال‌های کاربردی:
                  </p>
                  <div className="text-xs text-gray-600 space-y-1">
                    {watch("transactionType") === "Credit" && (
                      <>
                        <p>
                          • مشتری پول پرداخت کرد → موجودی حساب مشتری افزایش
                          می‌یابد
                        </p>
                        <p>
                          • شما به تهیه‌کننده پول پرداخت کردید → موجودی حساب
                          تهیه‌کننده کاهش می‌یابد (بدهی شما کم شد)
                        </p>
                        <p>
                          • حقوق کارمند پرداخت شد → موجودی حساب کارمند افزایش
                          می‌یابد
                        </p>
                      </>
                    )}
                    {watch("transactionType") === "Debit" && (
                      <>
                        <p>
                          • شما به مشتری پول پرداخت کردید → موجودی حساب مشتری
                          کاهش می‌یابد
                        </p>
                        <p>
                          • تهیه‌کننده پول برگشت داد → موجودی حساب تهیه‌کننده
                          کاهش می‌یابد
                        </p>
                        <p>
                          • کارمند پول برگشت داد → موجودی حساب کارمند کاهش
                          می‌یابد
                        </p>
                      </>
                    )}
                    {watch("transactionType") === "Expense" && (
                      <>
                        <p>
                          • خرید ملزومات اداری → موجودی حساب صندوق کاهش می‌یابد
                        </p>
                        <p>• پرداخت اجاره → موجودی حساب صندوق کاهش می‌یابد</p>
                        <p>• هزینه تعمیرات → موجودی حساب صندوق کاهش می‌یابد</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  مبلغ *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="مبلغ به AFN"
                  {...register("amount", { required: true, min: 0.01 })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  توضیحات
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  rows={3}
                  placeholder="توضیح کوتاه در مورد این تراکنش..."
                  {...register("description")}
                />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>نکته:</strong>
                  {watch("transactionType") === "Credit" &&
                    " این تراکنش موجودی حساب را افزایش می‌دهد."}
                  {watch("transactionType") === "Debit" &&
                    " این تراکنش موجودی حساب را کاهش می‌دهد."}
                  {watch("transactionType") === "Expense" &&
                    " این تراکنش موجودی حساب را کاهش می‌دهد."}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTransactionModal(false);
                    setSelectedAccount(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  افزودن تراکنش
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
