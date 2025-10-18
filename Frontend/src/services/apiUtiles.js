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
  console.log(res);
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

// STORE API
export const fetchStores = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/store`);
  if (!res.ok) throw new Error("Failed to fetch stores");
  return res.json();
};

// Fetch single store
export const fetchStore = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/store/${id}`);
  if (!res.ok) throw new Error("Failed to fetch store");
  return res.json();
};

// Create store
export const createStore = async (newStore) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStore),
  });
  if (!res.ok) throw new Error("Failed to create store");
  return res.json();
};

// Update store
export const updateStore = async ({ id, updatedStore }) => {
  console.log(updatedStore);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/store/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedStore),
  });
  if (!res.ok) throw new Error("Failed to update store");
  return res.json();
};

// Delete store
export const deleteStore = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/store/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete store");
  return res.json();
};

// API FOR PURCHASE

export const fetchPurchases = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/purchase`);
  if (!res.ok) throw new Error("Failed to fetch purchase");
  return res.json();
};

// Fetch single store
export const fetchPurchase = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/puchase/${id}`);
  if (!res.ok) throw new Error("Failed to fetch purchase");
  return res.json();
};

// Create store
export const createPurchase = async (newStore) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStore),
  });
  if (!res.ok) throw new Error("Failed to create purchase");
  return res.json();
};

// Update store
export const updatePurchase = async ({ id, updatedPurchase }) => {
  console.log(updatedPurchase);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/purchase/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPurchase),
  });
  if (!res.ok) throw new Error("Failed to update store");
  return res.json();
};

// Delete store
export const deletePurchase = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/purchase/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete purchase");
  return res.json();
};

// SUPPLIERS API

export const fetchSuppliers = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/supplier`);
  if (!res.ok) throw new Error("Failed to fetch supplier");
  return res.json();
};

// Fetch single store
export const fetchSupplier = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/supplier/${id}`);
  if (!res.ok) throw new Error("Failed to fetch supplier");
  return res.json();
};

// Create store
export const createSupplier = async (newStore) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/supplier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStore),
  });
  if (!res.ok) throw new Error("Failed to create supplier");
  return res.json();
};

// Update store
export const updateSupplier = async ({ id, updatedPurchase }) => {
  console.log(updatedPurchase);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/supplier/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPurchase),
  });
  if (!res.ok) throw new Error("Failed to update supplier");
  return res.json();
};

// Delete store
export const deleteSupplier = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/supplier/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete supplier");
  return res.json();
};

// STORE

export const fetchSales = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/sale`);

  if (!res.ok) throw new Error("Failed to fetch sale");
  return res.json();
};

// Fetch single store
export const fetchSale = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/sale/${id}`);
  if (!res.ok) throw new Error("Failed to fetch supplier");
  return res.json();
};

// Create store
export const createSale = async (newStore) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/sale`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStore),
  });
  if (!res.ok) throw new Error("Failed to create sale");
  return res.json();
};

// Update store
export const updateSale = async ({ id, updatedPurchase }) => {
  console.log(updatedPurchase);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/sale/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPurchase),
  });
  if (!res.ok) throw new Error("Failed to update sale");
  return res.json();
};

// Delete store
export const deleteSale = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/sale/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete sale");
  return res.json();
};
