import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
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
  createSale,
  updateSale,
  deleteSale,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
} from "./apiUtiles";

// ✅ Get all inventory items
export const useProduct = () => {
  return useQuery({
    queryKey: ["product"],
    queryFn: fetchProduct,
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

// AUTHENTICATION HOOKS

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Store user data in query cache
      queryClient.setQueryData(["user"], data.user);
      // Invalidate user queries to refetch
      queryClient.invalidateQueries(["user"]);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // Remove user data
      queryClient.removeQueries(["user"]);
    },
  });
};

// Get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized)
      if (error?.status === 401) return false;
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Refresh token mutation
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      // Update user data with new token info
      queryClient.setQueryData(["user"], data.user);
    },
  });
};
