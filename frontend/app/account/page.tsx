"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import AccountNavSidebar from "@/components/account/AccountNavSidebar";

import {
  MapPin,
  ShoppingBag,
  Heart,
  Ticket,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Crown,
  Plus,
  UserCheck,
  User,
  LogIn,
  PackageOpen,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

import {
  getAddresses,
  getMyOrders,
  getWishlist,
} from "@/services/api";
import { getProductImageUrl as normalizeProductImage } from "@/utils/image";

function getProductImageUrl(img?: string) {
  return normalizeProductImage(img);
}

export default function AccountDashboardPage() {
  const { user, token, logout } = useAuth();
  const isAuthenticated = Boolean(token && user);
  const { addToCart } = useCart();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [addrData, ordersData, wishlistData] = await Promise.all([
          getAddresses(token).catch(() => []),
          getMyOrders(token).catch(() => []),
          getWishlist(token).catch(() => []),
        ]);

        if (addrData && Array.isArray(addrData)) setAddresses(addrData);
        if (ordersData && Array.isArray(ordersData)) setOrders(ordersData);
        if (wishlistData && Array.isArray(wishlistData)) setWishlist(wishlistData);
      } catch (error) {
        console.error("Failed to load user dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [token]);

  const handleAddAllWishlistToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => {
      const p = item.product || item;
      addToCart({
        _id: p._id,
        name: p.name,
        price: p.price,
        image: Array.isArray(p.images) && p.images[0] ? p.images[0] : "/images/products/default.png",
        quantity: 1,
      });
    });
    toast.success(`Added ${wishlist.length} item${wishlist.length > 1 ? "s" : ""} to your cart!`);
  };

  // Real user information
  const displayName = user?.name || "Silk Connoisseur";
  const displayEmail = user?.email || "";
  const displayMobile = user?.mobile || "";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "SV";

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];



  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-16">
      {/* 1. ELEGANT BREADCRUMB & ACCOUNT HEADER */}
      <section className="border-b border-[#E8E4DF] bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1.5">
                <Link href="/" className="hover:text-[#6D001A] transition-colors">Home</Link>
                <ChevronRight size={13} />
                <span className="text-[#6D001A] font-semibold">My Account</span>
              </nav>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#6D001A]">
                MY ACCOUNT &amp; DASHBOARD
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-stone-600">
                Manage your orders, profile, saved addresses, and curated wishlist with ease.
              </p>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-[#C9A227] border border-amber-200">
                  <Crown size={14} />
                  <span>SILKVERSE CONNOISSEUR</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login?redirect=/account"
                  className="rounded-lg bg-[#6D001A] px-4 py-2 text-xs font-bold text-white hover:bg-[#520013] transition shadow-xs"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 transition"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 space-y-8">
        {/* 2. PROFILE SUMMARY & METRICS BAR */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
            {/* Left: User Profile Box */}
            <div className="lg:col-span-4 p-6 flex items-center gap-4 bg-gradient-to-r from-[#FAF8F5] via-white to-white">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#6D001A] text-xl font-serif font-bold text-amber-300 ring-4 ring-amber-100 shadow-xs">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2A26] truncate">
                  {displayName}
                </h2>
                <p className="text-xs text-stone-500 font-medium truncate">
                  {displayEmail || "Welcome to SilkVerse"}
                </p>
                {displayMobile && (
                  <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                    {displayMobile}
                  </p>
                )}
                {isAuthenticated && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <UserCheck size={13} />
                    <span>Active Member</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: 4 Live Stat Metric Cards */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-stone-100 bg-white">
              <Link
                href="/account/orders"
                className="p-4 sm:p-5 text-center group hover:bg-amber-50/20 transition-colors"
              >
                <ShoppingBag
                  size={20}
                  className="mx-auto text-stone-600 group-hover:text-[#6D001A] transition-colors"
                />
                <span className="mt-2 block font-serif text-2xl font-bold text-[#2D2A26]">
                  {orders.length}
                </span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Total Orders
                </span>
                <span className="mt-1 block text-[11px] text-[#C9A227] font-medium group-hover:underline">
                  View orders
                </span>
              </Link>

              <Link
                href="/account/wishlist"
                className="p-4 sm:p-5 text-center group hover:bg-amber-50/20 transition-colors"
              >
                <Heart
                  size={20}
                  className="mx-auto text-stone-600 group-hover:text-[#6D001A] transition-colors"
                />
                <span className="mt-2 block font-serif text-2xl font-bold text-[#2D2A26]">
                  {wishlist.length}
                </span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Wishlist
                </span>
                <span className="mt-1 block text-[11px] text-[#C9A227] font-medium group-hover:underline">
                  View saved
                </span>
              </Link>

              <Link
                href="/account/addresses"
                className="p-4 sm:p-5 text-center group hover:bg-amber-50/20 transition-colors"
              >
                <MapPin
                  size={20}
                  className="mx-auto text-stone-600 group-hover:text-[#6D001A] transition-colors"
                />
                <span className="mt-2 block font-serif text-2xl font-bold text-[#2D2A26]">
                  {addresses.length}
                </span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Saved Addresses
                </span>
                <span className="mt-1 block text-[11px] text-[#C9A227] font-medium group-hover:underline">
                  Manage addresses
                </span>
              </Link>

              <Link
                href="/account/rewards"
                className="p-4 sm:p-5 text-center group hover:bg-amber-50/20 transition-colors"
              >
                <Sparkles
                  size={20}
                  className="mx-auto text-stone-600 group-hover:text-[#6D001A] transition-colors"
                />
                <span className="mt-2 block font-serif text-2xl font-bold text-[#2D2A26]">
                  1,250
                </span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Reward Points
                </span>
                <span className="mt-1 block text-[11px] text-[#C9A227] font-medium group-hover:underline">
                  View rewards
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. MAIN WORKSPACE: SIDEBAR + RIGHT CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Navigation Sidebar */}
          <div className="lg:col-span-3">
            <AccountNavSidebar activeTab="dashboard" />
          </div>

          {/* RIGHT: Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {/* ROW 1: RECENT ORDERS */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#6D001A]" />
                  <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#6D001A]">
                    RECENT ORDERS
                  </h3>
                </div>
                <Link
                  href="/account/orders"
                  className="text-xs font-bold text-[#2D2A26] hover:text-[#6D001A] flex items-center gap-1 transition-colors"
                >
                  <span>View All Orders</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {orders.length === 0 ? (
                /* Pristine Luxury Empty Orders State */
                <div className="rounded-xl border border-dashed border-stone-200 bg-[#FAF9F6] p-8 sm:p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-[#C9A227] border border-amber-200">
                    <PackageOpen size={26} strokeWidth={1.5} />
                  </div>
                  <h4 className="mt-3.5 font-serif text-lg font-bold text-[#2D2A26]">
                    No Orders Placed Yet
                  </h4>
                  <p className="mt-1 text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                    Every silk saree in our collection is an authentic handcrafted masterpiece. Explore our royal weaves and begin your heirloom collection today.
                  </p>
                  <div className="mt-5">
                    <Link
                      href="/collections"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#6D001A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#520013] transition"
                    >
                      <Sparkles size={14} />
                      <span>START SHOPPING</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Real Orders List */
                <div className="space-y-4">
                  {orders.slice(0, 3).map((ord) => (
                    <div
                      key={ord._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4 transition hover:border-[#6D001A]/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                          <Image
                            src={
                              ord.items?.[0]?.image
                                ? getProductImageUrl(ord.items[0].image)
                                : "/images/products/default.png"
                            }
                            alt={ord.items?.[0]?.name || "Silk Saree"}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-serif text-sm sm:text-base font-bold text-[#2D2A26] line-clamp-1">
                            {ord.items?.[0]?.name || `Order #${ord._id.slice(-6).toUpperCase()}`}
                          </h4>
                          <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                            Order ID: <span className="font-mono break-all">{ord._id}</span>
                          </p>
                          <p className="text-[11px] text-stone-400">
                            Placed on: {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-center">
                        <p className="font-serif text-base font-bold text-[#6D001A]">
                          ₹{(ord.totalAmount || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] text-stone-500 font-medium">
                          {ord.items?.length || 1} Item{ord.items?.length > 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold border bg-amber-50 text-[#C9A227] border-amber-200">
                          {ord.orderStatus || "Processing"}
                        </span>
                        <Link
                          href={`/orders/${ord._id}`}
                          className="text-xs font-bold text-[#6D001A] hover:underline transition-colors mt-0.5"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ROW 2: TWO COLUMNS (SAVED WISHLIST & COUPONS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: WISHLIST */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Heart size={16} className="text-[#6D001A]" />
                      <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#6D001A]">
                        SAVED ITEMS (WISHLIST)
                      </h3>
                    </div>
                    <Link
                      href="/account/wishlist"
                      className="text-xs font-bold text-[#2D2A26] hover:text-[#6D001A] flex items-center gap-1 transition-colors"
                    >
                      <span>View All</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-xs text-stone-500">
                        Your wishlist is currently empty.
                      </p>
                      <Link
                        href="/collections"
                        className="mt-3 inline-block text-xs font-bold text-[#6D001A] hover:underline"
                      >
                        Explore Silk Sarees →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-3 mb-5">
                      {wishlist.slice(0, 4).map((item) => {
                        const p = item.product || item;
                        const img = p.image || (Array.isArray(p.images) && p.images[0]) || "/images/products/saree_1_maroon.png";
                        return (
                          <Link
                            key={p._id}
                            href={`/products/${p._id}`}
                            className="group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-50 transition hover:border-[#6D001A]"
                          >
                            <div className="relative aspect-[3/4] w-full">
                              <Image
                                src={getProductImageUrl(img)}
                                alt={p.name || "Saree"}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {wishlist.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddAllWishlistToCart}
                    className="w-full rounded-xl border border-[#6D001A] bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-[#6D001A] hover:bg-[#6D001A] hover:text-white transition-colors shadow-2xs cursor-pointer"
                  >
                    ADD ALL TO CART
                  </button>
                )}
              </div>

              {/* Right: REWARD POINTS & PRIVILEGES */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#6D001A]" />
                      <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#6D001A]">
                        REWARD POINTS
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Gold Connoisseur
                    </span>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-br from-[#6D001A] to-[#450010] p-4 text-white space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
                        Available Balance
                      </span>
                      <Crown size={15} className="text-[#D4AF37]" />
                    </div>
                    <p className="font-serif text-2xl font-bold text-white">
                      1,250 <span className="text-xs font-sans font-normal text-amber-200">Silk Points</span>
                    </p>
                    <p className="text-[11px] text-amber-100/80">
                      Equivalent to ₹1,250 instant savings on handloom silk sarees.
                    </p>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-stone-600">
                      <span>Progress to Platinum Loom</span>
                      <span className="font-bold text-[#6D001A]">62%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: "62%" }} />
                    </div>
                  </div>
                </div>

                <Link
                  href="/account/rewards"
                  className="mt-5 block w-full rounded-xl border border-[#6D001A] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#6D001A] hover:bg-[#6D001A] hover:text-white transition shadow-2xs cursor-pointer"
                >
                  View Rewards &amp; Redeem →
                </Link>
              </div>
            </div>

            {/* ROW 3: TWO COLUMNS (DEFAULT ADDRESS & ACCOUNT DETAILS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: DEFAULT ADDRESS */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#6D001A]" />
                      <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#6D001A]">
                        PRIMARY ADDRESS
                      </h3>
                    </div>
                    <Link
                      href="/account/addresses"
                      className="text-xs font-bold text-[#2D2A26] hover:text-[#6D001A] flex items-center gap-1 transition-colors"
                    >
                      <span>Manage</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                  {defaultAddress ? (
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-bold text-[#2D2A26]">
                            {defaultAddress.fullName}
                          </span>
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-[#C9A227] border border-amber-200">
                            Default
                          </span>
                        </div>
                        <p className="text-stone-500 font-medium">
                          {defaultAddress.mobile}
                        </p>
                        <p className="text-stone-600 leading-relaxed pt-1">
                          {defaultAddress.houseNumber ? `${defaultAddress.houseNumber}, ` : ""}
                          {defaultAddress.area}
                          {defaultAddress.landmark ? `, Near ${defaultAddress.landmark}` : ""}
                          <br />
                          {defaultAddress.city}
                          {defaultAddress.district ? `, ${defaultAddress.district}` : ""}, {defaultAddress.state},{" "}
                          {defaultAddress.country || "India"} - {defaultAddress.pincode}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-stone-500">
                      <p>No address saved yet.</p>
                      <Link
                        href="/account/addresses"
                        className="mt-2 inline-block font-bold text-[#6D001A] hover:underline"
                      >
                        + Add Delivery Address
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-stone-100">
                  <Link
                    href="/account/addresses"
                    className="flex-1 rounded-xl border border-stone-300 bg-white py-2 text-center text-xs font-bold uppercase tracking-wider text-stone-700 hover:border-[#6D001A] hover:text-[#6D001A] transition shadow-2xs"
                  >
                    VIEW ADDRESSES
                  </Link>
                  <Link
                    href="/account/addresses"
                    className="flex-1 rounded-xl bg-[#6D001A] py-2 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-[#520013] transition shadow-2xs"
                  >
                    + ADD ADDRESS
                  </Link>
                </div>
              </div>

              {/* Right: ACCOUNT DETAILS */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#6D001A]" />
                      <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#6D001A]">
                        PROFILE INFORMATION
                      </h3>
                    </div>
                    <Link
                      href="/account/profile"
                      className="text-xs font-bold text-[#2D2A26] hover:text-[#6D001A] flex items-center gap-1 transition-colors"
                    >
                      <span>Edit Profile</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                      <span className="text-stone-500 font-medium">Full Name</span>
                      <span className="font-bold text-[#2D2A26] truncate min-w-0">{displayName}</span>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                      <span className="text-stone-500 font-medium">Email Address</span>
                      <span className="font-bold text-[#2D2A26] truncate min-w-0">{displayEmail || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                      <span className="text-stone-500 font-medium">Mobile Number</span>
                      <span className="font-bold text-[#2D2A26] truncate min-w-0">{displayMobile || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                      <span className="text-stone-500 font-medium">District / State</span>
                      <span className="font-bold text-[#2D2A26] truncate min-w-0">
                        {user?.district || defaultAddress?.district || "Sri Sathya Sai (Dharmavaram)"},{" "}
                        {user?.state || defaultAddress?.state || "Andhra Pradesh"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                      <span className="text-stone-500 font-medium">Country</span>
                      <span className="font-bold text-[#2D2A26] truncate min-w-0">
                        {user?.country || defaultAddress?.country || "India"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 pt-0.5">
                      <span className="text-stone-500 font-medium">Account Status</span>
                      <span className="font-bold text-emerald-700 inline-flex items-center gap-1 truncate min-w-0">
                        <Check size={12} />
                        {isAuthenticated ? "Verified Customer" : "Guest"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Security</span>
                  <Link
                    href="/account/security"
                    className="font-bold text-[#6D001A] hover:underline"
                  >
                    Change Password →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}