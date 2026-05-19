import { query } from "../../../lib/db.js";
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
} from "../../../utils/cloudinaryStorage.js";
import { ApiError } from "../../../utils/ApiError.js";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductQuery,
} from "../schema/products.schema.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Upload one or many base64 images.
 * Returns [primaryUrl, ...rest] always as an array.
 */
async function uploadImages(input: string | string[]): Promise<string[]> {
  if (Array.isArray(input)) {
    return uploadMultipleToCloudinary(input);
  }
  return [await uploadToCloudinary(input)];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const productsService = {
  async getAll(filters: ProductQuery) {
    const { search, category_id, is_active, page, limit } = filters;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    if (is_active !== undefined) {
      conditions.push(`p.is_active = $${i}`);
      params.push(is_active);
      i++;
    }
    if (search) {
      conditions.push(`(p.name ILIKE $${i} OR p.description ILIKE $${i})`);
      params.push(`%${search}%`);
      i++;
    }
    if (category_id) {
      conditions.push(`p.category_id = $${i}::uuid`);
      params.push(category_id);
      i++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM products p ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    params.push(limit, offset);
    const result = await query(
      `SELECT p.id, p.name, p.description, p.price,
              p.image_url, p.image_urls,
              p.is_active, p.created_at,
              c.id as category_id, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${where}
      ORDER BY p.created_at DESC
      LIMIT $${i} OFFSET $${i + 1}`,
      params
    );

    return {
      data: result.rows,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  },

  async getById(id: string) {
    const result = await query(
      `SELECT p.id, p.name, p.description, p.price,
              p.image_url, p.image_urls,
              p.is_active, p.created_at,
              c.id as category_id, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1`,
      [id]
    );
    if (!result.rows[0]) throw new ApiError(404, "Product not found");
    return result.rows[0];
  },

  async create(input: CreateProductInput) {
    let imageUrl: string | null = null;
    let imageUrls: string[] = [];

    if (input.image_base64) {
      imageUrls = await uploadImages(input.image_base64);
      imageUrl = imageUrls[0] ?? null; // first image = primary
    }

    const result = await query(
      `INSERT INTO products (name, description, price, category_id, image_url, image_urls, is_active)
      VALUES ($1, $2, $3, $4::uuid, $5, $6, true)
       RETURNING *`,
      [input.name, input.description, input.price, input.category_id, imageUrl, imageUrls]
    );

    return result.rows[0];
  },

  async update(id: string, input: UpdateProductInput) {
    // Verify product exists and fetch current images
    const existing = await query<{
      id: string;
      image_url: string | null;
      image_urls: string[];
    }>(
      `SELECT id, image_url, image_urls FROM products WHERE id = $1`,
      [id]
    );
    if (!existing.rows[0]) throw new ApiError(404, "Product not found");

    let imageUrl = existing.rows[0].image_url;
    let imageUrls: string[] = existing.rows[0].image_urls ?? [];

    // ── Handle selective deletions first ──────────────────────────────────────
    if (input.remove_image_urls?.length) {
      await deleteMultipleFromCloudinary(input.remove_image_urls);
      imageUrls = imageUrls.filter((u) => !input.remove_image_urls!.includes(u));
      // If the primary was removed, promote the next one
      if (imageUrl && input.remove_image_urls.includes(imageUrl)) {
        imageUrl = imageUrls[0] ?? null;
      }
    }

    // ── Upload new images and append ──────────────────────────────────────────
    if (input.image_base64) {
      const newUrls = await uploadImages(input.image_base64);
      imageUrls = [...imageUrls, ...newUrls];
      // First new image becomes the primary if there was none
      imageUrl = imageUrl ?? newUrls[0];
    }

    // ── Build dynamic SET clause ───────────────────────────────────────────────
    const setClauses: string[] = ["updated_at = NOW()"];
    const params: unknown[] = [];
    let i = 1;

    if (input.name !== undefined)        { setClauses.push(`name = $${i}`);               params.push(input.name);        i++; }
    if (input.description !== undefined) { setClauses.push(`description = $${i}`);        params.push(input.description); i++; }
    if (input.price !== undefined)       { setClauses.push(`price = $${i}`);              params.push(input.price);       i++; }
    if (input.category_id !== undefined) { setClauses.push(`category_id = $${i}::uuid`); params.push(input.category_id); i++; }
    if (input.is_active !== undefined)   { setClauses.push(`is_active = $${i}`);          params.push(input.is_active);   i++; }

    // Always persist image columns if they changed
    setClauses.push(`image_url = $${i}`);   params.push(imageUrl);   i++;
    setClauses.push(`image_urls = $${i}`);  params.push(imageUrls);  i++;

    params.push(id);
    const result = await query(
      `UPDATE products SET ${setClauses.join(", ")} WHERE id = $${i} RETURNING *`,
      params
    );

    return result.rows[0];
  },

  async delete(id: string) {
    // Fetch images before deleting so we can clean up Cloudinary
    const existing = await query<{ image_urls: string[] }>(
      `SELECT image_urls FROM products WHERE id = $1`,
      [id]
    );
    if (!existing.rows[0]) throw new ApiError(404, "Product not found");

    // Delete images from Cloudinary (non-blocking — never throws)
    const urls = existing.rows[0].image_urls ?? [];
    if (urls.length) await deleteMultipleFromCloudinary(urls);

    // Hard delete from DB
    await query(`DELETE FROM products WHERE id = $1`, [id]);

    return { message: "Product deleted successfully" };
  },

  async getAllCategories() {
    const result = await query(
      `SELECT id, name, slug FROM categories ORDER BY name ASC`
    );
    return result.rows;
  },
};
