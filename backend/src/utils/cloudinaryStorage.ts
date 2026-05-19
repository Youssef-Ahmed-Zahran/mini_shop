import cloudinary from "../lib/cloudinary.js";

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload a single base64 image to Cloudinary.
 * Accepts raw base64 or a data URI (data:image/...;base64,...).
 */
export const uploadToCloudinary = async (
  base64Image: string,
  folder = "products"
): Promise<string> => {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    resource_type: "auto",
    transformation: [
      { width: 1000, height: 1000, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });

  return result.secure_url;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Returns true if the URL looks like a valid Cloudinary upload URL.
 */
const isCloudinaryUrl = (url: string): boolean =>
  typeof url === "string" &&
  url.includes("cloudinary.com") &&
  url.includes("/upload/");

/**
 * Delete a single image from Cloudinary by its public URL.
 * Never throws — logs and returns a result descriptor instead.
 */
export const deleteFromCloudinary = async (
  imageUrl: string
): Promise<{ result: string; reason?: string; error?: string }> => {
  if (!isCloudinaryUrl(imageUrl)) {
    console.warn(`Skipping non-Cloudinary URL: ${imageUrl}`);
    return { result: "skipped", reason: "invalid_url" };
  }

  try {
    const parts = imageUrl.split("/upload/");
    if (parts.length < 2) return { result: "skipped", reason: "invalid_format" };

    // Strip the version segment (v1234567890/) and file extension
    const afterUpload = parts[1];
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

    if (!publicId) return { result: "skipped", reason: "no_public_id" };

    const res = await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary delete — public_id: ${publicId}`, res);
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Cloudinary delete error (${imageUrl}):`, message);
    return { result: "error", error: message };
  }
};

// ─── Bulk helpers ─────────────────────────────────────────────────────────────

/**
 * Upload multiple base64 images to Cloudinary in parallel.
 */
export const uploadMultipleToCloudinary = async (
  base64Images: string[],
  folder = "products"
): Promise<string[]> => {
  const results = await Promise.all(
    base64Images.map((img) => uploadToCloudinary(img, folder))
  );
  return results;
};

/**
 * Delete multiple images from Cloudinary.
 * Skips invalid/non-Cloudinary URLs gracefully.
 * Never throws — always returns a results array.
 */
export const deleteMultipleFromCloudinary = async (
  imageUrls: string[]
): Promise<PromiseSettledResult<{ result: string; reason?: string; error?: string }>[]> => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    console.log("deleteMultipleFromCloudinary: no images provided");
    return [];
  }

  const validUrls = imageUrls.filter(isCloudinaryUrl);

  if (validUrls.length === 0) {
    console.warn("deleteMultipleFromCloudinary: no valid Cloudinary URLs found");
    return [];
  }

  console.log(
    `deleteMultipleFromCloudinary: deleting ${validUrls.length} / ${imageUrls.length} images`
  );

  const results = await Promise.allSettled(
    validUrls.map((url) => deleteFromCloudinary(url))
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  console.log(`deleteMultipleFromCloudinary: ${succeeded} succeeded, ${failed} failed`);

  return results;
};
