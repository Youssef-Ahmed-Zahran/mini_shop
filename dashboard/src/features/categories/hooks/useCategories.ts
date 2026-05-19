import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { categoriesApi } from "../api/categories.api";

const CATEGORIES_KEY = "categories";

export const useCategories = () =>
  useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: categoriesApi.getAll,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Category created successfully");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const msg = err.response?.data?.message || "Failed to create category";
      toast.error(msg);
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; name?: string; slug?: string }) =>
      categoriesApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Category updated successfully");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const msg = err.response?.data?.message || "Failed to update category";
      toast.error(msg);
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Category deleted successfully");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const msg = err.response?.data?.message || "Failed to delete category";
      toast.error(msg);
    },
  });
};
