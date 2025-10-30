import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, API_ENDPOINTS } from "../services/apiConfig";
import { toast } from "react-toastify";

const fetchExpenses = async ({ page, limit, category, startDate, endDate, search }) => {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  if (category) params.set("category", category);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (search) params.set("search", search);
  const res = await apiRequest(`${API_ENDPOINTS.EXPENSES.LIST}?${params.toString()}`);
  return res;
};

const fetchCategories = async () => {
  const res = await apiRequest(`${API_ENDPOINTS.CATEGORIES.LIST}?type=expense&isActive=true`);
  return res;
};

const fetchAccounts = async () => {
  // Only money accounts: cashier, safe, saraf
  const res = await apiRequest(`/accounts?types=cashier,safe,saraf&isDeleted=false&limit=100`);
  return res;
};

const createExpenseApi = async (payload) => {
  return apiRequest(API_ENDPOINTS.EXPENSES.CREATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

const updateExpenseApi = async ({ id, payload }) => {
  return apiRequest(API_ENDPOINTS.EXPENSES.UPDATE(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

const deleteExpenseApi = async (id) => {
  return apiRequest(API_ENDPOINTS.EXPENSES.DELETE(id), { method: "DELETE" });
};

export default function Expenses() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [category, setCategory] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const { data: expensesRes, isLoading } = useQuery({
    queryKey: ["expenses", { page, limit, category, dateRange, search }],
    queryFn: () =>
      fetchExpenses({
        page,
        limit,
        category: category || undefined,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
        search: search || undefined,
      }),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["expense-categories"],
    queryFn: fetchCategories,
  });

  const { data: accountsRes } = useQuery({
    queryKey: ["money-accounts"],
    queryFn: fetchAccounts,
  });

  const createMutation = useMutation({
    mutationFn: createExpenseApi,
    onSuccess: () => {
      toast.success("هزینه ثبت شد");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setIsModalOpen(false);
    },
    onError: (e) => toast.error(e.message || "ثبت هزینه ناموفق بود"),
  });

  const updateMutation = useMutation({
    mutationFn: updateExpenseApi,
    onSuccess: () => {
      toast.success("هزینه ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setIsModalOpen(false);
      setEditingExpense(null);
    },
    onError: (e) => toast.error(e.message || "ویرایش هزینه ناموفق بود"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpenseApi,
    onSuccess: () => {
      toast.success("حذف شد");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (e) => toast.error(e.message || "حذف ناموفق بود"),
  });

  const expenses = expensesRes?.data || [];
  const pagination = expensesRes?.pagination || { currentPage: 1, totalPages: 1 };
  const categories = categoriesRes?.data || [];
  const accounts = accountsRes?.data || [];

  const onCreate = (form) => {
    createMutation.mutate(form);
  };

  const onUpdate = (id, form) => {
    updateMutation.mutate({ id, payload: form });
  };

  const onDelete = (id) => {
    if (window.confirm("آیا از حذف این هزینه مطمئن هستید؟")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4" style={{ color: "var(--text-dark)" }}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ color: "var(--primary-brown)" }}>هزینه‌ها</h1>
        <button className="btn-primary" onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}>افزودن هزینه</button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block mb-2" style={{ color: "var(--text-medium)" }}>دسته‌بندی</label>
            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">همه</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2" style={{ color: "var(--text-medium)" }}>از تاریخ</label>
            <input type="date" className="form-input" value={dateRange.start} onChange={(e) => setDateRange((d) => ({ ...d, start: e.target.value }))} />
          </div>
          <div>
            <label className="block mb-2" style={{ color: "var(--text-medium)" }}>تا تاریخ</label>
            <input type="date" className="form-input" value={dateRange.end} onChange={(e) => setDateRange((d) => ({ ...d, end: e.target.value }))} />
          </div>
          <div>
            <label className="block mb-2" style={{ color: "var(--text-medium)" }}>جستجو</label>
            <input type="text" className="form-input" placeholder="توضیحات..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>تاریخ</th>
              <th>دسته‌بندی</th>
              <th>مبلغ</th>
              <th>پرداخت از</th>
              <th>توضیحات</th>
              <th>اقدامات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="text-center py-6">در حال بارگذاری...</td></tr>
            ) : expenses.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-6">موردی یافت نشد</td></tr>
            ) : (
              expenses.map((e) => (
                <tr key={e._id}>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                  <td>{e.category?.name || "-"}</td>
                  <td>{e.amount?.toLocaleString()} افغانی</td>
                  <td>{e.paidFromAccount?.name || "-"}</td>
                  <td>{e.description || "-"}</td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      <button className="btn-secondary" onClick={() => { setEditingExpense(e); setIsModalOpen(true); }}>ویرایش</button>
                      <button className="btn-secondary" onClick={() => onDelete(e._id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <button className="btn-secondary" disabled={pagination.currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>قبلی</button>
        <span>
          صفحه {pagination.currentPage} از {pagination.totalPages}
        </span>
        <button className="btn-secondary" disabled={pagination.currentPage >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>بعدی</button>
      </div>

      {isModalOpen && (
        <ExpenseModal
          onClose={() => { setIsModalOpen(false); setEditingExpense(null); }}
          onSubmit={(form) => (
            editingExpense ? onUpdate(editingExpense._id, form) : onCreate(form)
          )}
          categories={categories}
          accounts={accounts}
          initial={editingExpense}
        />
      )}
    </div>
  );
}

function ExpenseModal({ onClose, onSubmit, categories, accounts, initial }) {
  const [form, setForm] = useState({
    category: initial?.category?._id || initial?.category || "",
    amount: initial?.amount || "",
    paidFromAccount: initial?.paidFromAccount?._id || initial?.paidFromAccount || "",
    date: initial?.date ? new Date(initial.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    description: initial?.description || "",
  });

  const canSubmit = form.category && form.amount && form.paidFromAccount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <div className="relative w-full max-w-lg card">
        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--primary-brown)" }}>
          {initial ? "ویرایش هزینه" : "افزودن هزینه"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-2" style={{ color: "var(--text-medium)" }}>دسته‌بندی</label>
            <select className="form-input" name="category" value={form.category} onChange={handleChange}>
              <option value="">انتخاب کنید</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2" style={{ color: "var(--text-medium)" }}>مبلغ</label>
            <input className="form-input" name="amount" type="number" min="0" value={form.amount} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-2" style={{ color: "var(--text-medium)" }}>پرداخت از</label>
            <select className="form-input" name="paidFromAccount" value={form.paidFromAccount} onChange={handleChange}>
              <option value="">انتخاب حساب</option>
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2" style={{ color: "var(--text-medium)" }}>تاریخ</label>
            <input className="form-input" name="date" type="date" value={form.date} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-2" style={{ color: "var(--text-medium)" }}>توضیحات</label>
            <textarea className="form-input" name="description" value={form.description} onChange={handleChange} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button className="btn-secondary" onClick={onClose}>لغو</button>
          <button className="btn-primary" disabled={!canSubmit} onClick={() => onSubmit({
            category: form.category,
            amount: Number(form.amount),
            paidFromAccount: form.paidFromAccount,
            date: form.date,
            description: form.description,
          })}>
            {initial ? "ذخیره تغییرات" : "ثبت"}
          </button>
        </div>
      </div>
    </div>
  );
}


