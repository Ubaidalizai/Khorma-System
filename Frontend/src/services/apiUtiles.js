// ✅ Fetch all items
export const fetchProduct = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/product`);
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
};

// ✅ Fetch single item by ID
export const fetchProductyById = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/product/${id}`);

  if (!res.ok) throw new Error("Failed to fetch item");
  return res.json();
};

// ✅ Create a new item
export const createProductItem = async (newItem) => {
  console.log(newItem);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  });
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
};

// ✅ Update an item
export const updateProductItem = async ({ id, updatedItem }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/product/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedItem),
  });
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
};

// ✅ Delete an item
export const deleteProductItem = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/product/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete item");
  return true;
};

// INEVENTORY DATA CRUD OPERATION

export const fetchInventory = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory`);

  if (!res.ok) throw new Error("خطا در گرفتن معلومات انبار");
  return res.json();
};

// 📖 Read one by ID
export const fetchInventoryById = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/${id}`);
  if (!res.ok) throw new Error("کالا پیدا نشد");
  return res.json();
};

// ➕ Create
export const createInventoryItem = async (newItem) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...newItem,
      lastUpdated: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error("خطا در ایجاد کالا");
  return res.json();
};

// ✏️ Update
export const updateInventoryItem = async ({ id, updatedItem }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...updatedItem,
      lastUpdated: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error("خطا در به‌روزرسانی کالا");
  return res.json();
};

// 🗑️ Delete
export const deleteInventoryItem = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/inventory/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("خطا در حذف کالا");
  return true;
};
