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
