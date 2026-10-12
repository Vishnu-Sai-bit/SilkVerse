"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createAdminProduct } from "@/services/api";

interface ProductForm {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
}

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<ProductForm>({
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
    });

  const [images, setImages] =
    useState<File[]>([]);

  const [previews, setPreviews] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

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

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    if (files.length > 6) {
      toast.warning(
        "Maximum 6 images allowed."
      );
      event.target.value = "";
      return;
    }

    const invalidType = files.find(
      (file) =>
        !file.type.startsWith("image/")
    );

    if (invalidType) {
      toast.error(
        `"${invalidType.name}" is not an image file.`
      );
      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      toast.error(
        `"${invalidFile.name}" exceeds the 5 MB limit.`
      );
      event.target.value = "";
      return;
    }

    previews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    const previewUrls = files.map(
      (file) =>
        URL.createObjectURL(file)
    );

    setImages(files);
    setPreviews(previewUrls);

    event.target.value = "";
  }

  function removeImage(index: number) {
    const previewToRemove =
      previews[index];

    if (previewToRemove) {
      URL.revokeObjectURL(
        previewToRemove
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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (form.name.trim().length < 2) {
      toast.error(
        "Product name must contain at least 2 characters."
      );
      return;
    }

    if (!form.description.trim()) {
      toast.error(
        "Product description is required."
      );
      return;
    }

    if (!form.category.trim()) {
      toast.error(
        "Product category is required."
      );
      return;
    }

    const price = Number(form.price);

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      toast.error(
        "Enter a valid product price."
      );
      return;
    }

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

    if (images.length === 0) {
      toast.error(
        "Please upload at least one product image."
      );
      return;
    }

    if (images.length > 6) {
      toast.error(
        "Maximum 6 images allowed."
      );
      return;
    }

    try {
      setLoading(true);

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

      images.forEach((image) => {
        formData.append(
          "images",
          image
        );
      });

      await createAdminProduct(
        token,
        formData
      );

      toast.success(
        "Product added successfully."
      );

      router.replace(
        "/admin/products"
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create product.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-lg">
      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
          Catalog Management
        </p>

        <h1 className="mt-2 text-2xl sm:text-4xl font-bold text-[#7A1F2B]">
          Add New Product
        </h1>

        <p className="mt-2 text-gray-500">
          Add a new product to the
          SilkVerse catalog.
        </p>
      </div>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
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
            value={form.name}
            onChange={handleChange}
            placeholder="Banarasi Silk Saree"
            className="w-full rounded-lg border p-3 focus:border-[#7A1F2B] focus:outline-none"
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
            placeholder="Product Description..."
            className="w-full rounded-lg border p-3 focus:border-[#7A1F2B] focus:outline-none"
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
            value={form.category}
            onChange={handleChange}
            placeholder="Banarasi"
            className="w-full rounded-lg border p-3 focus:border-[#7A1F2B] focus:outline-none"
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
              placeholder="4999"
              className="w-full rounded-lg border p-3 focus:border-[#7A1F2B] focus:outline-none"
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
              placeholder="20"
              className="w-full rounded-lg border p-3 focus:border-[#7A1F2B] focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Image Upload */}

        <div>
          <label
            htmlFor="images"
            className="mb-2 block text-lg font-semibold"
          >
            Product Images
          </label>

          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-lg border border-dashed p-4"
          />

          <p className="mt-2 text-sm text-gray-500">
            Upload 1–6 images.
            Maximum 5 MB per image.
            The first image will be
            used as the cover image.
          </p>
        </div>

        {/* Image Preview */}

        {previews.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Image Preview (
              {previews.length}/6)
            </h3>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {previews.map(
                (preview, index) => (
                  <div
                    key={preview}
                    className="relative"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${
                        index + 1
                      }`}
                      className="h-56 w-full rounded-lg border object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-sm text-white transition hover:bg-red-700"
                      aria-label={`Remove image ${
                        index + 1
                      }`}
                    >
                      ✕
                    </button>

                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 rounded bg-[#7A1F2B] px-2 py-1 text-xs font-medium text-white">
                        Cover Image
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Buttons */}

        <div className="flex flex-wrap gap-4 border-t pt-6">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#7A1F2B] px-8 py-3 font-semibold text-white transition hover:bg-[#651923] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Adding Product..."
              : "Add Product"}
          </button>

          <button
            type="button"
            disabled={loading}
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