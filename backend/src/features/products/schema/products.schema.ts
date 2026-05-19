import { z } from "zod";

// Accept either a single base64 string OR an array of base64 strings
const imageBase64Field = z
  .union([z.string(), z.array(z.string())])
  .optional();

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be a positive number"),
  category_id: z.string().uuid("Invalid category ID"),
  // One image or multiple images (base64)
  image_base64: imageBase64Field,
});

export const updateProductSchema = createProductSchema.partial().extend({
  is_active: z.boolean().optional(),
  // Allow explicit list of URLs to remove (by Cloudinary URL)
  remove_image_urls: z.array(z.string()).optional(),
});

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category_id: z.string().uuid().optional(),
  is_active: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(20),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
