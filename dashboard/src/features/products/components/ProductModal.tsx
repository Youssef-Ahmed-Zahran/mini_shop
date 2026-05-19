import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  type ProductFormValues,
  type ProductFormInput,
} from "../schemas/product.schema";
import {
  useCategories,
  useCreateProduct,
  useUpdateProduct,
} from "../hooks/useProducts";
import type { Product } from "../types";
import { Loader2, ImagePlus, X, Trash2 } from "lucide-react";

export type ProductModalRef = {
  open: (product?: Product | null) => void;
  close: () => void;
};

// ─── helpers ────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── inner form ─────────────────────────────────────────────────────────────

function ProductModalInner({
  product,
  onClose,
}: {
  product?: Product;
  onClose: () => void;
}) {
  const { data: categories } = useCategories();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const fileRef = useRef<HTMLInputElement>(null);

  // New images picked by the user (base64 previews)
  const [newImages, setNewImages] = useState<
    { base64: string; name: string }[]
  >([]);

  // Existing images to be removed on submit
  const [removeUrls, setRemoveUrls] = useState<string[]>([]);

  // Existing images still shown (not yet flagged for removal)
  const existingUrls: string[] = product?.image_urls?.length
    ? product.image_urls
    : product?.image_url
      ? [product.image_url]
      : [];

  const visibleExisting = existingUrls.filter((u) => !removeUrls.includes(u));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.category_id,
          is_active: product.is_active,
        }
      : undefined,
  });

  // Pick multiple files
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const converted = await Promise.all(
      files.map(async (f) => ({ base64: await fileToBase64(f), name: f.name })),
    );
    setNewImages((prev) => [...prev, ...converted]);
    // Reset input so same file can be re-picked
    e.target.value = "";
  };

  const removeNewImage = (idx: number) =>
    setNewImages((prev) => prev.filter((_, i) => i !== idx));

  const flagExistingForRemoval = (url: string) =>
    setRemoveUrls((prev) => [...prev, url]);

  const onSubmit = (values: ProductFormValues) => {
    const payload: Record<string, unknown> = { ...values };

    if (newImages.length === 1) {
      payload.image_base64 = newImages[0].base64;
    } else if (newImages.length > 1) {
      payload.image_base64 = newImages.map((i) => i.base64);
    }

    if (removeUrls.length) {
      payload.remove_image_urls = removeUrls;
    }

    if (product) {
      update.mutate(
        { id: product.id, ...payload } as Parameters<typeof update.mutate>[0],
        { onSuccess: onClose },
      );
    } else {
      create.mutate(payload as Parameters<typeof create.mutate>[0], {
        onSuccess: onClose,
      });
    }
  };

  const isPending = create.isPending || update.isPending;
  const totalImages = visibleExisting.length + newImages.length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 overflow-y-auto"
        >
          {/* ── Images section ─────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Images
                <span className="ml-1 text-gray-400 font-normal">
                  ({totalImages} total)
                </span>
              </label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                Add images
              </button>
            </div>

            {/* Image grid */}
            {totalImages > 0 ? (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {/* Existing images */}
                {visibleExisting.map((url, i) => (
                  <div
                    key={url}
                    className="relative group rounded-xl overflow-hidden aspect-square border border-gray-100 dark:border-gray-700"
                  >
                    <img
                      src={url}
                      alt={`existing-${i}`}
                      className="w-full h-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => flagExistingForRemoval(url)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* New images */}
                {newImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative group rounded-xl overflow-hidden aspect-square border border-indigo-200 dark:border-indigo-800"
                  >
                    <img
                      src={img.base64}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add more tile */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-indigo-400 flex flex-col items-center justify-center gap-1 text-gray-300 dark:text-gray-500 hover:text-indigo-400 transition cursor-pointer"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Add</span>
                </button>
              </div>
            ) : (
              /* Empty state drop zone */
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 transition"
              >
                <ImagePlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Click to upload images</p>
                <p className="text-xs text-gray-300 mt-0.5">
                  You can select multiple files
                </p>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
            />

            {/* Removed images notice */}
            {removeUrls.length > 0 && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠ {removeUrls.length} image{removeUrls.length > 1 ? "s" : ""}{" "}
                will be deleted on save.
                <button
                  type="button"
                  onClick={() => setRemoveUrls([])}
                  className="ml-2 underline hover:text-amber-800"
                >
                  Undo
                </button>
              </p>
            )}
          </div>

          {/* ── Name ──────────────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Name
            </label>
            <input
              {...register("name")}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* ── Description ───────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ── Price + Category ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category
              </label>
              <select
                {...register("category_id")}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select...</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.category_id.message}
                </p>
              )}
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────────────────── */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white rounded-xl transition text-sm font-medium flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── exported wrapper ────────────────────────────────────────────────────────

export const ProductModal = forwardRef<ProductModalRef>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useImperativeHandle(ref, () => ({
    open: (p) => {
      setProduct(p || undefined);
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
  }));

  if (!isOpen) return null;

  return (
    <ProductModalInner product={product} onClose={() => setIsOpen(false)} />
  );
});
