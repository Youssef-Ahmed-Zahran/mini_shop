import { query } from "../../../lib/db.js";
import { ApiError } from "../../../utils/ApiError.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "../schema/categories.schema.js";

export const categoriesService = {
  async getAll() {
    const result = await query(
      `SELECT id, name, slug FROM categories ORDER BY name ASC`
    );
    return result.rows;
  },

  async create(input: CreateCategoryInput) {
    try {
      const result = await query(
        `INSERT INTO categories (name, slug)
        VALUES ($1, $2)
        RETURNING id, name, slug`,
        [input.name, input.slug]
      );
      return result.rows[0];
    } catch (err: any) {
      if (err.code === "23505") { // unique_violation
        throw new ApiError(409, "A category with this slug already exists.");
      }
      throw err;
    }
  },

  async update(id: string, input: UpdateCategoryInput) {
    const setClauses: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    if (input.name !== undefined) {
      setClauses.push(`name = $${i}`);
      params.push(input.name);
      i++;
    }
    if (input.slug !== undefined) {
      setClauses.push(`slug = $${i}`);
      params.push(input.slug);
      i++;
    }

    if (setClauses.length === 0) return { id }; // Nothing to update

    params.push(id);
    try {
      const result = await query(
        `UPDATE categories SET ${setClauses.join(", ")} WHERE id = $${i} RETURNING id, name, slug`,
        params
      );

      if (!result.rows[0]) throw new ApiError(404, "Category not found");
      return result.rows[0];
    } catch (err: any) {
      if (err.code === "23505") {
        throw new ApiError(409, "A category with this slug already exists.");
      }
      throw err;
    }
  },

  async delete(id: string) {
    try {
      const result = await query(
        `DELETE FROM categories WHERE id = $1 RETURNING id`,
        [id]
      );
      if (!result.rows[0]) throw new ApiError(404, "Category not found");
      return { message: "Category deleted successfully" };
    } catch (err: any) {
      if (err.code === "23503") { // foreign_key_violation
        throw new ApiError(409, "Cannot delete category because it contains products.");
      }
      throw err;
    }
  },
};
