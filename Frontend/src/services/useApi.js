import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProduct,
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
  fetchSuppliers,
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
  fetchUnits,
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
  createCompnay,
  updateCompany,
  deleteCompany,
  loginUser,
  logoutUser,
  refreshUserToken,
  getUserProfile,
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
export const useProduct = () => {
  return useQuery({
    queryKey: ["product"],
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

export const usePurchases = () => {
  return useQuery({
    queryKey: ["allPurchases"],
    queryFn: fetchPurchases,
  });
};

export const usePurchase = (id) =>
  useQuery({
    queryKey: ["purchase", id],
    queryFn: fetchPurchase,
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
    mutationFn: () => updatePurchase,
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

// Supplier CRUD operations

export const useSuppliers = () => {
  return useQuery({
    queryKey: ["allSuppliers"],
    queryFn: fetchSuppliers,
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
    mutationFn: () => updateSupplier,
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

export const useSales = () => {
  return useQuery({
    queryKey: ["allSales"],
    queryFn: fetchSales,
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

export const useUnits = () => {
  return useQuery({
    queryKey: ["units"],
    queryFn: fetchUnits,
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
    mutationFn: () => updateCustomer,
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
    queryFn: fetchSuppliers,
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
    mutationFn: () => updateEmployee,
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
