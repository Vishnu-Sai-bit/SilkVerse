"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Minus,
  RefreshCw,
  Edit,
  Trash2,
  AlertTriangle,
  Package,
  IndianRupee,
} from "lucide-react";

import {
  getAdminProducts,
  updateAdminProduct,
  deleteAdminProduct,
} from "@/services/api";

interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  images?: string[];
}

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

function getImageUrl(image?: string) {
  if (!image) {
    return "/images/products/saree_1_maroon.png";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/images/")) {
    return image;
  }

  const filename = image.replace(/^.*[\\\/]/, "");

  // If filename starts with saree_, it's directly available in /images/products/
  if (filename.startsWith("saree_")) {
    return `/images/products/${filename}`;
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

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState("");
  const [error, setError] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("silkverse-token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const data = await getAdminProducts(token);
      setProducts(data || []);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load products.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const product = products.find((item) => item._id === id);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product?.name || "this saree"}"? This action cannot be reversed.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(id);
      setError("");

      const token = localStorage.getItem("silkverse-token");

      if (!token) {
        router.replace("/login");
        return;
      }

      await deleteAdminProduct(token, id);

      setProducts((prev) => prev.filter((item) => item._id !== id));
      toast.success("Saree deleted successfully from catalog.");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete product.";

      setError(message);
      toast.error(message);
    } finally {
      setDeleting("");
    }
  }

  const [updatingStockId, setUpdatingStockId] = useState("");

  async function handleQuickStockChange(product: Product, delta: number) {
    const nextStock = Math.max(0, (product.stock || 0) + delta);
    if (nextStock === product.stock) return;

    try {
      setUpdatingStockId(product._id);
      const token = localStorage.getItem("silkverse-token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("category", product.category || "Traditional");
      formData.append("price", String(product.price));
      formData.append("stock", String(nextStock));
      formData.append("description", product.description || "");

      await updateAdminProduct(token, product._id, formData);

      setProducts((prev) =>
        prev.map((item) =>
          item._id === product._id ? { ...item, stock: nextStock } : item
        )
      );
      toast.success(`Updated stock for "${product.name}" to ${nextStock}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update stock.");
    } finally {
      setUpdatingStockId("");
    }
  }

  // Extract unique categories cleanly
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const cat = (p.category || "").trim();
      if (cat) set.add(cat);
    });
    return Array.from(set).sort();
  }, [products]);

  // Robust filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const name = (p.name || "").trim().toLowerCase();
      const category = (p.category || "").trim().toLowerCase();
      const idStr = (p._id || "").toLowerCase();
      const query = searchQuery.trim().toLowerCase();

      // Search match
      const matchesSearch =
        !query ||
        name.includes(query) ||
        category.includes(query) ||
        idStr.includes(query);

      // Category match
      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory.trim().toLowerCase();

      // Stock match
      const stock = typeof p.stock === "number" ? p.stock : 0;
      let matchesStock = true;
      if (stockFilter === "low") {
        matchesStock = stock > 0 && stock <= 5;
      } else if (stockFilter === "out") {
        matchesStock = stock === 0;
      } else if (stockFilter === "available") {
        matchesStock = stock > 5;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7A1F2B] border-t-transparent" />
        <p className="text-sm font-medium text-stone-500">
          Loading Saree Catalog...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#7A1F2B]/10 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase text-[#7A1F2B]">
              Catalog Management
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs font-semibold text-stone-600">
              {products.length} Total Sarees
            </span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#3B151E] sm:text-3xl">
            Sarees & Inventory
          </h1>
          <p className="mt-0.5 text-xs text-stone-500">
            View, search, edit pricing in ₹ (INR), and monitor live stock quantities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadProducts}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-xs transition hover:bg-stone-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#7A1F2B] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#5E141F]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New Saree
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-xs font-medium text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={loadProducts}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by saree title, weave, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2 pl-10 pr-4 text-xs text-stone-800 placeholder:text-stone-400 focus:border-[#7A1F2B] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 focus:border-[#7A1F2B] focus:outline-none"
          >
            <option value="all">All Weaves & Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Stock Filter Dropdown */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 focus:border-[#7A1F2B] focus:outline-none"
          >
            <option value="all">All Stock Levels</option>
            <option value="available">Healthy Stock (&gt; 5)</option>
            <option value="low">Low Stock (1 - 5)</option>
            <option value="out">Out of Stock (0)</option>
          </select>

          {/* Counter chip */}
          <div className="rounded-xl bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-600">
            {filteredProducts.length} of {products.length} Sarees
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400">
            <Package className="h-6 w-6" />
          </div>
          <h2 className="mt-3 font-serif text-lg font-bold text-stone-800">
            No matching sarees found
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            {searchQuery || selectedCategory !== "all" || stockFilter !== "all"
              ? "Try resetting your search or filter options to see all products."
              : "Add your first saree to begin building your SilkVerse catalog."}
          </p>

          {(searchQuery || selectedCategory !== "all" || stockFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setStockFilter("all");
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        /* Products Table */
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 bg-[#FAF9F6] text-stone-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Saree Details
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Price (₹)
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Inventory
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredProducts.map((product) => {
                  const pImg = product.image || product.images?.[0];
                  const isDeleting = deleting === product._id;
                  const finalImgSrc = getImageUrl(pImg);

                  return (
                    <tr
                      key={product._id}
                      className="transition hover:bg-stone-50/70"
                    >
                      {/* Saree Info & Thumbnail */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                            <img
                              src={finalImgSrc}
                              alt={product.name || "Silk Saree"}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget;
                                const filename = (pImg || "").replace(/^.*[\\\/]/, "");
                                if (filename && !target.src.includes(`/images/products/${filename}`)) {
                                  target.src = `/images/products/${filename}`;
                                } else {
                                  target.src = "/images/products/saree_1_maroon.png";
                                }
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="font-mono text-[10px] text-stone-400">
                              ID: #{product._id.slice(-6).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="whitespace-nowrap px-5 py-3.5 font-medium text-stone-600">
                        <span className="inline-block rounded-md bg-stone-100 px-2 py-0.5 text-[11px]">
                          {product.category || "Traditional"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-stone-900">
                        {formatPrice(product.price)}
                      </td>

                      {/* Stock Level + Quick Inline Adjuster */}
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center rounded-lg border border-stone-200 bg-white shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleQuickStockChange(product, -1)}
                              disabled={updatingStockId === product._id || product.stock <= 0}
                              title="Decrease stock by 1"
                              className="flex h-6 w-6 items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[26px] text-center text-[11px] font-bold text-stone-800 tabular-nums">
                              {product.stock}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuickStockChange(product, 1)}
                              disabled={updatingStockId === product._id}
                              title="Increase stock by 1"
                              className="flex h-6 w-6 items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {product.stock === 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                              Out of Stock
                            </span>
                          ) : product.stock <= 5 ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                              <AlertTriangle className="h-3 w-3" />
                              Low
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
                              In Stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-xs transition hover:border-[#7A1F2B] hover:text-[#7A1F2B]"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 shadow-xs transition hover:bg-rose-50 disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            {isDeleting ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}