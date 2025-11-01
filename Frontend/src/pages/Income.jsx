import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, API_ENDPOINTS } from "../services/apiConfig";
import { toast } from "react-toastify";
import { formatNumber } from "../utilies/helper";

const fetchIncome = async ({ page, limit, category, startDate, endDate, search }) => {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  if (category) params.set("category", category);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  if (search) params.set("search", search);
  const res = await apiRequest(`${API_ENDPOINTS.INCOME.LIST}?${params.toString()}`);
  return res;
};

const fetchCategories = async () => {
  const res = await apiRequest(`${API_ENDPOINTS.CATEGORIES.LIST}?type=income&isActive=true`);
  return res;
};

const fetchAccounts = async () => {
  // Only system money accounts: cashier, safe, saraf
  const res = await apiRequest(API_ENDPOINTS.ACCOUNTS.SYSTEM);
  return res;
};

const createIncomeApi = async (payload) => {
  return apiRequest(API_ENDPOINTS.INCOME.CREATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

const updateIncomeApi = async ({ id, payload }) => {
  return apiRequest(API_ENDPOINTS.INCOME.UPDATE(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

const deleteIncomeApi = async (id) => {
  return apiRequest(API_ENDPOINTS.INCOME.DELETE(id), { method: "DELETE" });
};

export default function Income() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [category, setCategory] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const { data: incomeRes, isLoading } = useQuery({
    queryKey: ["income", { page, limit, category, dateRange, search }],
    queryFn: () =>
      fetchIncome({
        page,
        limit,
        category: category || undefined,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
        search: search || undefined,
      }),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["income-categories"],
    queryFn: fetchCategories,
  });

  const { data: accountsRes } = useQuery({
    queryKey: ["money-accounts"],
    queryFn: fetchAccounts,
  });

  const createMutation = useMutation({
    mutationFn: createIncomeApi,
    onSuccess: () => {
      toast.success("درآمد ثبت شد");
      queryClient.invalidateQueries({ queryKey: ["income"] });
      setIsModalOpen(false);
    },
    onError: (e) => toast.error(e.message || "ثبت درآمد ناموفق بود"),
  });

  const updateMutation = useMutation({
    mutationFn: updateIncomeApi,
    onSuccess: () => {
      toast.success("درآمد ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["income"] });
      setIsModalOpen(false);
      setEditingIncome(null);
    },
    onError: (e) => toast.error(e.message || "ویرایش درآمد ناموفق بود"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIncomeApi,
    onSuccess: () => {
      toast.success("حذف شد");
      queryClient.invalidateQueries({ queryKey: ["income"] });
    },
    onError: (e) => toast.error(e.message || "حذف ناموفق بود"),
  });

  const income = incomeRes?.data || [];
  const pagination = incomeRes?.pagination || { currentPage: 1, totalPages: 1 };
  const categories = categoriesRes?.data || [];
  const accounts = accountsRes?.accounts || accountsRes?.data || [];

  const onCreate = (form) => {
    createMutation.mutate(form);
  };

  const onUpdate = (id, form) => {
    updateMutation.mutate({ id, payload: form });
  };

  const onDelete = (id) => {
    if (window.confirm("آیا از حذف این درآمد مطمئن هستید؟")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4" style={{ color: "var(--text-dark)" }}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ color: "var(--primary-brown)" }}>درآمد‌ها</h1>
        <button className="btn-primary" onClick={() => { setEditingIncome(null); setIsModalOpen(true); }}>افزودن درآمد</button>
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
            <input type="text" className="form-input" placeholder="منبع یا توضیحات..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <th>منبع</th>
              <th>قرار داده شده در</th>
              <th>توضیحات</th>
              <th>اقدامات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="7" className="text-center py-6">در حال بارگذاری...</td></tr>
            ) : income.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-6">موردی یافت نشد</td></tr>
            ) : (
              income.map((i) => (
                <tr key={i._id}>
                  <td>{new Date(i.date).toLocaleDateString()}</td>
                  <td>{i.category?.name || "-"}</td>
                  <td>{formatNumber(i.amount || 0)} افغانی</td>
                  <td>{i.source || "-"}</td>
                  <td>{i.placedInAccount?.name || "-"}</td>
                  <td>{i.description || "-"}</td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      <button className="btn-secondary" onClick={() => { setEditingIncome(i); setIsModalOpen(true); }}>ویرایش</button>
                      <button className="btn-secondary" onClick={() => onDelete(i._id)}>حذف</button>
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
          صفحه {formatNumber(pagination.currentPage)} از {formatNumber(pagination.totalPages)}
        </span>
        <button className="btn-secondary" disabled={pagination.currentPage >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>بعدی</button>
      </div>

      {isModalOpen && (
        <IncomeModal
          onClose={() => { setIsModalOpen(false); setEditingIncome(null); }}
          onSubmit={(form) => (
            editingIncome ? onUpdate(editingIncome._id, form) : onCreate(form)
          )}
          categories={categories}
          accounts={accounts}
          initial={editingIncome}
        />
      )}
    </div>
  );
}

function IncomeModal({ onClose, onSubmit, categories, accounts, initial }) {
  const [form, setForm] = useState({
    category: initial?.category?._id || initial?.category || "",
    amount: initial?.amount || "",
    placedInAccount: initial?.placedInAccount?._id || initial?.placedInAccount || "",
    date: initial?.date ? new Date(initial.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    description: initial?.description || "",
  });

  const canSubmit = form.category && form.amount && form.placedInAccount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <div className="relative w-full max-w-lg card">
        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--primary-brown)" }}>
          {initial ? "ویرایش درآمد" : "افزودن درآمد"}
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
            <input className="form-input" name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-2" style={{ color: "var(--text-medium)" }}>قرار داده شده در</label>
            <select className="form-input" name="placedInAccount" value={form.placedInAccount} onChange={handleChange}>
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
            <textarea className="form-input" name="description" value={form.description} onChange={handleChange} rows="3" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button className="btn-secondary" onClick={onClose}>لغو</button>
          <button className="btn-primary" disabled={!canSubmit} onClick={() => onSubmit({
            category: form.category,
            amount: Number(form.amount),
            placedInAccount: form.placedInAccount,
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

