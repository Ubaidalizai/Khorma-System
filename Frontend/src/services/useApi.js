import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";
import {
  fetchProducts,
  fetchProductyById,
  createProductItem,
  updateProductItem,
  deleteProductItem,
  fetchInventory,
  fetchInventoryById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  fetchStores,
  fetchStore,
  createStore,
  updateStore,
  deleteStore,
  fetchPurchases,
  fetchPurchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getSuppliers,
  fetchSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  fetchSales,
  fetchSale,
  fetchDashboardStats,
  fetchRecentTransactions,
  fetchLowStockItems,
  fetchDashboardSummary,
  createSale,
  updateSale,
  deleteSale,
  fetchStock,
  fetchInventoryStock,
  fetchStoreStock,
  fetchInventoryStats,
  fetchUnits,
  fetchUnit,
  createUnit,
  updateUnit,
  deleteUnit,
  fetchCustomer,
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  fetchEmployee,
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  fetchCompanies,
  createCompnay,
  updateCompany,
  deleteCompany,
  loginUser,
  logoutUser,
  refreshUserToken,
  getUserProfile,
  fetchAccounts,
  fetchSystemAccounts,
  fetchAccountLedger,
  createAccount,
  updateAccount,
  deleteAccount,
  fetchBatchesByProduct,
  fetchProductsFromStock,
  createStockTransfer,
  fetchStockTransfers,
  deleteStockTransfer,
} from "./apiUtiles";

// Authentication hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    mutationKey: ["login"],
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    mutationKey: ["logout"],
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshUserToken,
    mutationKey: ["refreshToken"],
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    enabled: false, // Only fetch when explicitly called
  });
};

// ✅ Get all inventory items
export const useProduct = (opts = {}) => {
  const { search, includeDeleted } = opts;
  return useQuery({
    queryKey: [
      "product",
      { search: search || "", includeDeleted: !!includeDeleted },
    ],
    queryFn: () => fetchProducts({ search, includeDeleted }),
    keepPreviousData: true,
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["allProducts"],
    queryFn: fetchProducts,
  });
};

// ✅ Get single item by ID
export const useProdcutItem = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductyById(id),
    enabled: !!id,
  });
};

// ✅ Create item mutation
export const useCreateProdcut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductItem,
    mutationKey: ["newProduct"],
    onSuccess: () => {
      queryClient.invalidateQueries(["product"]);
    },
  });
};

// ✅ Update item mutation
export const useUpdateProdcut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProductItem,
    mutationKey: ["productupdate"],
    onSuccess: () => {
      queryClient.invalidateQueries(["product"]);
    },
  });
};

// ✅ Delete item mutation
export const useDeleteProdcut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductItem,
    mutationKey: ["productRemove"],
    onSuccess: () => {
      queryClient.invalidateQueries(["product"]);
    },
  });
};

// INVENTORY USE CONT..
export const useInventory = () => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  });
};

// 🔍 Get single item
export const useInventoryItem = (id) => {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: () => fetchInventoryById(id),
    enabled: !!id,
  });
};

// ➕ Add item
export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => queryClient.invalidateQueries(["inventory"]),
  });
};

// ✏️ Update item
export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: () => queryClient.invalidateQueries(["inventory"]),
  });
};

// 🗑️ Delete item
export const useDeleteInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => queryClient.invalidateQueries(["inventory"]),
  });
};
// use store

export const useStores = () => {
  return useQuery({
    queryKey: ["allstores"],
    queryFn: fetchStores,
  });
};

export const useStore = (id) =>
  useQuery({
    queryKey: ["store", id],
    queryFn: fetchStore,
  });

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  return useMutation(createStore, {
    onSuccess: () => queryClient.invalidateQueries(["createStore"]),
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteStore"],
    mutationFn: () => updateStore,
    onSuccess: () => queryClient.invalidateQueries(["allstores"]),
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["storedelete"],
    mutationFn: deleteStore,
    onSuccess: () => queryClient.invalidateQueries(["allstores"]),
  });
};

// Purchases

export const usePurchases = (params = {}) => {
  return useQuery({
    queryKey: ["allPurchases", params],
    queryFn: () => fetchPurchases(params),
  });
};

export const usePurchase = (id) =>
  useQuery({
    queryKey: ["purchase", id],
    queryFn: () => fetchPurchase(id),
    enabled: !!id, // Only run query if id exists
  });

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPurchase,
    mutationKey: ["newPurchase"],
    onSuccess: () => queryClient.invalidateQueries(["allPurchases"]),
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updatePurchase"],
    mutationFn: ({ id, ...purchaseData }) => updatePurchase(id, purchaseData),
    onSuccess: () => queryClient.invalidateQueries(["allPurchases"]),
  });
};

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["purchaseDelete"],
    mutationFn: deletePurchase,
    onSuccess: () => queryClient.invalidateQueries(["allPurchases"]),
  });
};

// Stock (backend-powered lists)
export const useStocks = () => {
  return useQuery({
    queryKey: ["stocks"],
    queryFn: fetchStock,
  });
};

export const useWarehouseStocks = (opts = {}) => {
  const { search } = opts;
  return useQuery({
    queryKey: ["stocks", "warehouse", { search: search || "" }],
    queryFn: () => fetchInventoryStock({ search }),
    keepPreviousData: true,
  });
};

export const useStoreStocks = (opts = {}) => {
  const { search } = opts;
  return useQuery({
    queryKey: ["stocks", "store", { search: search || "" }],
    queryFn: () => fetchStoreStock({ search }),
    keepPreviousData: true,
  });
};

export const useInventoryStats = () => {
  return useQuery({
    queryKey: ["inventoryStats"],
    queryFn: fetchInventoryStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBatchesByProduct = (productId, location = 'store') => {
  return useQuery({
    queryKey: ["batches", productId, location],
    queryFn: () => fetchBatchesByProduct(productId, location),
    enabled: !!productId, // Only run query if productId exists
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};


// Supplier CRUD operations

export const useSuppliers = () => {
  return useQuery({
    queryKey: ["allSuppliers"],
    queryFn: getSuppliers,
  });
};

export const useSupplier = (id) =>
  useQuery({
    queryKey: ["supplier", id],
    queryFn: fetchSupplier,
  });

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplier,
    mutationKey: ["newSupplier"],
    onSuccess: () => queryClient.invalidateQueries(["allSuppliers"]),
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateSupplier"],
    mutationFn: ({ id, supplierData }) => updateSupplier(id, supplierData),
    onSuccess: () => queryClient.invalidateQueries(["allSuppliers"]),
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteSupplier"],
    mutationFn: deleteSupplier,
    onSuccess: () => queryClient.invalidateQueries(["allSupplier"]),
  });
};

// USE THE SALE

export const useSales = (params = {}) => {
  return useQuery({
    queryKey: ["allSales", params],
    queryFn: () => fetchSales(params),
    keepPreviousData: true,
  });
};

export const useSale = (id) =>
  useQuery({
    queryKey: ["sale", id],
    queryFn: fetchSale,
  });

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    mutationKey: ["newSale"],
    onSuccess: () => queryClient.invalidateQueries(["allSales"]),
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateSale"],
    mutationFn: () => updateSale,
    onSuccess: () => queryClient.invalidateQueries(["allSales"]),
  });
};

export const useDeleteSales = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteSale"],
    mutationFn: deleteSale,
    onSuccess: () => queryClient.invalidateQueries(["allSales"]),
  });
};

// CUSTOMER USE

// export const useSuppliers = () => {
//   return useQuery({
//     queryKey: ["allSuppliers"],
//     queryFn: fetchSuppliers,
//   });
// };

// export const useSupplier = (id) =>
//   useQuery({
//     queryKey: ["supplier", id],
//     queryFn: fetchSupplier,
//   });

// export const useCreateSupplier = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: createSupplier,
//     mutationKey: ["newSupplier"],
//     onSuccess: () => queryClient.invalidateQueries(["allSuppliers"]),
//   });
// };

// export const useUpdateSupplier = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationKey: ["updateSupplier"],
//     mutationFn: () => updateSupplier,
//     onSuccess: () => queryClient.invalidateQueries(["allSuppliers"]),
//   });
// };

// export const useDeleteSupplier = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationKey: ["deleteSupplier"],
//     mutationFn: deleteSupplier,
//     onSuccess: () => queryClient.invalidateQueries(["allSupplier"]),
//   });
// };

// USE THE SALE

export const useCustomers = () => {
  return useQuery({
    queryKey: ["allCustomers"],
    queryFn: fetchCustomers,
  });
};

export const useCustomer = (id) =>
  useQuery({
    queryKey: ["customer", id],
    queryFn: fetchCustomer,
  });

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    mutationKey: ["newCustomer"],
    onSuccess: () => queryClient.invalidateQueries(["allCustomers"]),
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateCustomer"],
    mutationFn: ({ id, customerData }) => updateCustomer(id, customerData),
    onSuccess: () => queryClient.invalidateQueries(["allCustomers"]),
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteCustomer"],
    mutationFn: deleteCustomer,
    onSuccess: () => queryClient.invalidateQueries(["allCustomers"]),
  });
};

// USE COMPNAY

export const useCompanies = () => {
  return useQuery({
    queryKey: ["allCompanies"],
    queryFn: fetchCompanies,
  });
};

export const useCompany = (id) =>
  useQuery({
    queryKey: ["company", id],
    queryFn: fetchSupplier,
  });

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCompnay,
    mutationKey: ["newCompany"],
    onSuccess: () => queryClient.invalidateQueries(["allCompanies"]),
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateCompany"],
    mutationFn: () => updateCompany,
    onSuccess: () => queryClient.invalidateQueries(["allCompanies"]),
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteCompany"],
    mutationFn: deleteCompany,
    onSuccess: () => queryClient.invalidateQueries(["allCompanies"]),
  });
};

export const useAccounts = (opts = {}) => {
  const { type, search, page = 1, limit = 10 } = opts;
  return useQuery({
    queryKey: [
      "accounts",
      { type: type || "", search: search || "", page, limit },
    ],
    queryFn: () => fetchAccounts({ type, search, page, limit }),
    keepPreviousData: true,
  });
};

export const useSystemAccounts = () => {
  return useQuery({
    queryKey: ["systemAccounts"],
    queryFn: fetchSystemAccounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProductsFromStock = (location = 'store') => {
  return useQuery({
    queryKey: ["productsFromStock", location],
    queryFn: () => fetchProductsFromStock(location),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccount,
    mutationKey: ["newAccount"],
    onSuccess: () => queryClient.invalidateQueries(["accounts"]),
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateAccount"],
    mutationFn: ({ id, accountData }) => updateAccount(id, accountData),
    onSuccess: () => queryClient.invalidateQueries(["accounts"]),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: deleteAccount,
    onSuccess: () => queryClient.invalidateQueries(["accounts"]),
  });
};

export const useAccountLedger = (accountId, params = {}) => {
  return useQuery({
    queryKey: ["accountLedger", accountId, params],
    queryFn: () => fetchAccountLedger(accountId, params),
    enabled: !!accountId,
  });
};
// USE THE employee

export const useEmployees = () => {
  return useQuery({
    queryKey: ["allEmployees"],
    queryFn: fetchEmployees,
  });
};

export const useEmployee = (id) =>
  useQuery({
    queryKey: ["employee", id],
    queryFn: fetchEmployee,
  });

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    mutationKey: ["newEmployee"],
    onSuccess: () => queryClient.invalidateQueries(["allEmployees"]),
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateEmployee"],
    mutationFn: ({ id, employeeData }) => updateEmployee(id, employeeData),
    onSuccess: () => queryClient.invalidateQueries(["allEmployees"]),
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteEmployee"],
    mutationFn: deleteEmployee,
    onSuccess: () => queryClient.invalidateQueries(["allEmployees"]),
  });
};

// Units
export const useUnits = () => {
  return useQuery({
    queryKey: ["allUnits"],
    queryFn: fetchUnits,
  });
};

export const useUnit = (id) => {
  return useQuery({
    queryKey: ["unit", id],
    queryFn: () => fetchUnit(id),
    enabled: !!id,
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUnit,
    mutationKey: ["newUnit"],
    onSuccess: () => queryClient.invalidateQueries(["allUnits"]),
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateUnit"],
    mutationFn: ({ id, unitData }) => updateUnit(id, unitData),
    onSuccess: () => queryClient.invalidateQueries(["allUnits"]),
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteUnit"],
    mutationFn: deleteUnit,
    onSuccess: () => queryClient.invalidateQueries(["allUnits"]),
  });
};

// Dashboard Hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecentTransactions = (limit = 10) => {
  return useQuery({
    queryKey: ["recentTransactions", limit],
    queryFn: () => fetchRecentTransactions(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLowStockItems = () => {
  return useQuery({
    queryKey: ["lowStockItems"],
    queryFn: fetchLowStockItems,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
export const useStockTransfers = () => {
  return useQuery({
    queryKey: ["stockTransfers"],
    queryFn: fetchStockTransfers,
  });
};
export const useStockTransferDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteStockTransfer"],
    mutationFn: deleteStockTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries(["stockTransfers"]);
      toast.success(" شما با موفقیت موجودی را حذف کردید ", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    },
    onError: () => {
      toast.error(" عملیه غیر موفق بود", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    },
  });
};

export const useCreateStockTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStockTransfer,
    mutationKey: ["newTransfer"],
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["stockTransfers"]);
      toast.success("انتقال موفقانه بود", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    },
    onError: () => {
      toast.error("نتقال موفقانه نبود", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    },
  });
};
