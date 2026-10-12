"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { toast } from "sonner";

import {
  getAdminProduct,
  updateAdminProduct,
} from "@/services/api";

// ======================================
// API URL
// ======================================

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5001";

const API_URL = RAW_API_URL
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

// ======================================
// Product Type
// ======================================

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  images?: string[];
}

// ======================================
// Image URL Helper
// ======================================

function getImageUrl(image?: string) {
  if (!image) {
    return "/images/products/default.jpg";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/images/")) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    const filename = image.replace(/^\/uploads\/(?:products\/)?/, "");
    return `/images/products/${filename}`;
  }

  if (image.startsWith("uploads/")) {
    const filename = image.replace(/^uploads\/(?:products\/)?/, "");
    return `/images/products/${filename}`;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `${API_URL}/${image}`;
}

// ======================================
// Edit Product Page
// ======================================

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params.id === "string"
      ? params.id
      : "";

  // ======================================
  // State
  // ======================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  });

  // Existing gallery images
  const [currentImages, setCurrentImages] =
    useState<string[]>([]);

  // New uploaded images
  const [images, setImages] =
    useState<File[]>([]);

  // Preview URLs
  const [previews, setPreviews] =
    useState<string[]>([]);

  // ======================================
  // Load Product
  // ======================================

  async function loadProduct() {
    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        router.replace("/login");
        return;
      }

      const product: Product =
        await getAdminProduct(
          token,
          id
        );

      setForm({
        name: product.name || "",
        description:
          product.description || "",
        category:
          product.category || "",
        price:
          product.price !== undefined
            ? String(product.price)
            : "",
        stock:
          product.stock !== undefined
            ? String(product.stock)
            : "",
      });

      const existingImages =
        product.images &&
        product.images.length > 0
          ? product.images
          : product.image
          ? [product.image]
          : [];

      setCurrentImages(
        existingImages
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load product.";

      if (
        message
          .toLowerCase()
          .includes("token") ||
        message
          .toLowerCase()
          .includes("unauthorized") ||
        message
          .toLowerCase()
          .includes("session") ||
        message
          .toLowerCase()
          .includes("expired")
      ) {
        localStorage.removeItem(
          "silkverse-token"
        );

        toast.error(
          "Your session has expired."
        );

        router.replace("/login");
        return;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  // ======================================
  // Load Product Hook
  // ======================================

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    loadProduct();
  }, [id]);

  // ======================================
  // Form Change
  // ======================================

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ======================================
  // Image Selection
  // ======================================

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    // Maximum 6 images
    if (files.length > 6) {
      toast.warning(
        "Maximum 6 images allowed."
      );

      event.target.value = "";
      return;
    }

    // Validate image type
    const invalidFile = files.find(
      (file) =>
        !file.type.startsWith(
          "image/"
        )
    );

    if (invalidFile) {
      toast.error(
        `"${invalidFile.name}" is not an image file.`
      );

      event.target.value = "";
      return;
    }

    // Validate image size
    const oversizedFile = files.find(
      (file) =>
        file.size >
        5 * 1024 * 1024
    );

    if (oversizedFile) {
      toast.error(
        `"${oversizedFile.name}" exceeds the 5 MB limit.`
      );

      event.target.value = "";
      return;
    }

    // Revoke previous previews
    previews.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    const previewUrls = files.map(
      (file) =>
        URL.createObjectURL(file)
    );

    setImages(files);
    setPreviews(previewUrls);

    // Allow selecting the same files again
    event.target.value = "";
  }

  // ======================================
  // Remove New Image
  // ======================================

  function removePreview(
    index: number
  ) {
    const previewUrl =
      previews[index];

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    setImages((previous) =>
      previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );

    setPreviews((previous) =>
      previous.filter(
        (_, previewIndex) =>
          previewIndex !== index
      )
    );
  }

  // ======================================
  // Submit
  // ======================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    // ====================================
    // Validate Name
    // ====================================

    if (form.name.trim().length < 2) {
      toast.error(
        "Product name must contain at least 2 characters."
      );
      return;
    }

    // ====================================
    // Validate Description
    // ====================================

    if (!form.description.trim()) {
      toast.error(
        "Product description is required."
      );
      return;
    }

    // ====================================
    // Validate Category
    // ====================================

    if (!form.category.trim()) {
      toast.error(
        "Product category is required."
      );
      return;
    }

    // ====================================
    // Validate Price
    // ====================================

    const price = Number(form.price);

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      toast.error(
        "Please enter a valid price."
      );
      return;
    }

    // ====================================
    // Validate Stock
    // ====================================

    const stock = Number(form.stock);

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      toast.error(
        "Stock must be a whole number greater than or equal to 0."
      );
      return;
    }

    // ====================================
    // Validate Images
    // ====================================

    if (images.length > 6) {
      toast.error(
        "Maximum 6 images allowed."
      );
      return;
    }

    try {
      setSaving(true);

      // ==================================
      // Authentication
      // ==================================

      const token =
        localStorage.getItem(
          "silkverse-token"
        );

      if (!token) {
        toast.error(
          "Please login as an administrator."
        );

        router.replace("/login");
        return;
      }

      // ==================================
      // FormData
      // ==================================

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "category",
        form.category.trim()
      );

      formData.append(
        "price",
        String(price)
      );

      formData.append(
        "stock",
        String(stock)
      );

      // ==================================
      // New Images
      // ==================================
      //
      // If new images are selected,
      // backend replaces the gallery.
      // If no new images are selected,
      // existing gallery remains unchanged.

      images.forEach((file) => {
        formData.append(
          "images",
          file
        );
      });

      // ==================================
      // Update Product
      // ==================================

      await updateAdminProduct(
        token,
        id,
        formData
      );

      toast.success(
        "Product updated successfully."
      );

      router.replace(
        "/admin/products"
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update product.";

      if (
        message
          .toLowerCase()
          .includes("token") ||
        message
          .toLowerCase()
          .includes("unauthorized") ||
        message
          .toLowerCase()
          .includes("session") ||
        message
          .toLowerCase()
          .includes("expired")
      ) {
        localStorage.removeItem(
          "silkverse-token"
        );

        toast.error(
          "Your session has expired."
        );

        router.replace("/login");
        return;
      }

      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  // ======================================
  // Cleanup Preview URLs
  // ======================================

  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#7A1F2B] border-t-transparent" />

          <p className="mt-4 text-lg font-semibold text-gray-600">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // ======================================
  // Render
  // ======================================

  return (
    <div className="mx-auto max-w-5xl rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-lg">
      {/* Header */}

      <div className="mb-8">
        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/products"
            )
          }
          className="mb-5 text-sm font-medium text-gray-600 transition hover:text-[#7A1F2B]"
        >
          ← Back to Products
        </button>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
          Catalog Management
        </p>

        <h1 className="mt-2 text-2xl sm:text-4xl font-bold text-[#7A1F2B]">
          Edit Product
        </h1>

        <p className="mt-2 text-gray-500">
          Update product information,
          pricing, stock, and images.
        </p>
      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-7"
      >
        {/* Product Name */}

        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-medium"
          >
            Product Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-[#7A1F2B]"
            required
          />
        </div>

        {/* Description */}

        <div>
          <label
            htmlFor="description"
            className="mb-2 block font-medium"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-[#7A1F2B]"
            required
          />
        </div>

        {/* Category */}

        <div>
          <label
            htmlFor="category"
            className="mb-2 block font-medium"
          >
            Category
          </label>

          <input
            id="category"
            name="category"
            type="text"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-[#7A1F2B]"
            required
          />
        </div>

        {/* Price & Stock */}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="price"
              className="mb-2 block font-medium"
            >
              Price (₹ INR)
            </label>

            <input
              id="price"
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-[#7A1F2B]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="mb-2 block font-medium"
            >
              Stock
            </label>

            <input
              id="stock"
              type="number"
              name="stock"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-[#7A1F2B]"
              required
            />
          </div>
        </div>

        {/* Existing Images */}

        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Current Images
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              These are the images
              currently saved for
              this product.
            </p>
          </div>

          {currentImages.length ===
          0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
              No images available.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {currentImages.map(
                (image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative overflow-hidden rounded-lg"
                  >
                    <img
                      src={getImageUrl(
                        image
                      )}
                      alt={`Current product image ${
                        index + 1
                      }`}
                      className="h-56 w-full rounded-lg border object-cover"
                      onError={(
                        event
                      ) => {
                        event.currentTarget.src =
                          "/images/products/default.jpg";
                      }}
                    />

                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 rounded bg-[#7A1F2B] px-2 py-1 text-xs font-medium text-white">
                        Cover Image
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Replace Images */}

        <div>
          <label
            htmlFor="images"
            className="mb-2 block text-lg font-semibold"
          >
            Replace Images
          </label>

          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-lg border border-dashed border-gray-400 p-4"
          />

          <p className="mt-2 text-sm text-gray-500">
            Select up to 6 images.
            Uploading new images
            will replace the
            current gallery.
            Each image must be
            5 MB or smaller.
          </p>
        </div>

        {/* New Image Preview */}

        {previews.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              New Images Preview (
              {previews.length}/6)
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {previews.map(
                (preview, index) => (
                  <div
                    key={preview}
                    className="relative"
                  >
                    <img
                      src={preview}
                      alt={`New image preview ${
                        index + 1
                      }`}
                      className="h-56 w-full rounded-lg border object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removePreview(
                          index
                        )
                      }
                      disabled={saving}
                      className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Remove new image ${
                        index + 1
                      }`}
                    >
                      ✕
                    </button>

                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white">
                        New Cover
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Buttons */}

        <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#7A1F2B] px-8 py-3 font-semibold text-white transition hover:bg-[#651923] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Updating..."
              : "Update Product"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              router.push(
                "/admin/products"
              )
            }
            className="rounded-lg bg-gray-500 px-8 py-3 font-semibold text-white transition hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}