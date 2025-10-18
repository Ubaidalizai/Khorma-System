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
  console.log(updatedItem);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/product/${id}`, {
    method: "PATCH",
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

export const fetchUnits = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/unit`);

  if (!res.ok) throw new Error("Failed to fetch unit");
  return res.json();
};

// Customer

export const fetchCustomers = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/customer`);
  if (!res.ok) throw new Error("Failed to fetch customer");
  return res.json();
};
export const fetchCustomer = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/customer/${id}`);
  if (!res.ok) throw new Error("Failed to fetch customer");
  return res.json();
};

// Create customer
export const createCustomer = async (newCustomer) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCustomer),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return res.json();
};

// Update customer
export const updateCustomer = async ({ id, updatedCustomer }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/customer/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedCustomer),
  });
  if (!res.ok) throw new Error("Failed to update customer");
  return res.json();
};

// Delete customer
export const deleteCustomer = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/customer/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete customer");
  return res.json();
};

// Employee
export const fetchEmployees = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/employee`);
  if (!res.ok) throw new Error("Failed to fetch employee");
  return res.json();
};
export const fetchEmployee = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/${id}`);
  if (!res.ok) throw new Error("Failed to fetch employee");
  return res.json();
};

// Create Empoyee
export const createEmployee = async (newEmployee) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/employee`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEmployee),
  });
  if (!res.ok) throw new Error("Failed to create employee");
  return res.json();
};

// Update Empoyee
export const updateEmployee = async ({ id, updatedEmployee }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedEmployee),
  });
  if (!res.ok) throw new Error("Failed to update employee");
  return res.json();
};

// Delete Empoyee
export const deleteEmployee = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/employee/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete employee");
  return res.json();
};

// Company

export const fetchCompanies = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/company`);
  if (!res.ok) throw new Error("Failed to fetch companies");
  return res.json();
};
export const fetchCompany = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/company/${id}`);
  if (!res.ok) throw new Error("Failed to fetch compnay");
  return res.json();
};

// Create COMPNAY
export const createCompnay = async (newCompany) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/company`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCompany),
  });
  if (!res.ok) throw new Error("Failed to create employee");
  return res.json();
};

// Update COMPNAY
export const updateCompany = async ({ id, updatedEmployee }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/company/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedEmployee),
  });
  if (!res.ok) throw new Error("Failed to update company");
  return res.json();
};

// Delete COMPNAY
export const deleteCompany = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/company/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete compnay");
  return res.json();
};
