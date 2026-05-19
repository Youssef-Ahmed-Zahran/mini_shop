import { useRef } from "react";
import { useCategories, useDeleteCategory } from "../hooks/useCategories";
import { Plus, Pencil, Trash2, ListTree } from "lucide-react";

import {
  CategoryModal,
  type CategoryModalRef,
} from "../components/CategoryModal";

export default function CategoriesPage() {
  const modalRef = useRef<CategoryModalRef>(null);
  const deleteCategory = useDeleteCategory();

  const { data: categories, isLoading } = useCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {categories?.length ?? 0} categories total
          </p>
        </div>
        <button
          onClick={() => modalRef.current?.open()}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : categories?.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <ListTree className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">
              No categories found
            </p>
            <p className="text-sm">Get started by creating a new category.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Category Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Slug
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {categories?.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <ListTree className="w-4 h-4" />
                      </div>
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                      {category.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => modalRef.current?.open(category)}
                        className="p-2 text-gray-400 hover:text-indigo-500 transition"
                        title="Edit category"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Delete this category? Products in this category will prevent deletion.",
                            )
                          ) {
                            deleteCategory.mutate(category.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CategoryModal ref={modalRef} />
    </div>
  );
}
