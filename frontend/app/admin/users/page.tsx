"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  RefreshCw,
  Users,
  ShieldCheck,
  User as UserIcon,
  Trash2,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";

import {
  getAdminUsers,
  updateUserRole,
  deleteUser,
} from "@/services/api";

type UserRole = "user" | "admin";

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  dateOfBirth?: string | null;
}

function isSessionError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("token") ||
    message.includes("unauthorized") ||
    message.includes("session") ||
    message.includes("expired")
  );
}

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [deleting, setDeleting] = useState("");
  const [error, setError] = useState("");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("silkverse-token");
      if (!token) {
        setUsers([]);
        router.replace("/login");
        return;
      }

      const data = await getAdminUsers(token);
      setUsers(data || []);
    } catch (error: unknown) {
      if (isSessionError(error)) {
        localStorage.removeItem("silkverse-token");
        toast.error("Your session has expired.");
        router.replace("/login");
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Failed to load users.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(id: string, role: UserRole) {
    if (updating || deleting) return;

    const previousUser = users.find((user) => user._id === id);
    if (!previousUser || previousUser.role === role) return;

    try {
      setUpdating(id);
      setError("");

      const token = localStorage.getItem("silkverse-token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const updatedUser = await updateUserRole(token, id, role);

      const normalizedUser: User = {
        _id: updatedUser?.id || updatedUser?._id || id,
        name: updatedUser?.name || previousUser.name,
        email: updatedUser?.email || previousUser.email,
        mobile: updatedUser?.mobile || previousUser.mobile,
        role: updatedUser?.role || role,
        dateOfBirth: updatedUser?.dateOfBirth ?? previousUser.dateOfBirth ?? null,
      };

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...normalizedUser } : u))
      );

      toast.success(
        `User ${normalizedUser.name || "account"} role changed to ${role.toUpperCase()}.`
      );
    } catch (error: unknown) {
      if (isSessionError(error)) {
        localStorage.removeItem("silkverse-token");
        toast.error("Your session has expired.");
        router.replace("/login");
        return;
      }

      const message =
        error instanceof Error ? error.message : "Failed to update user role.";
      toast.error(message);
    } finally {
      setUpdating("");
    }
  }

  async function removeUser(id: string) {
    if (deleting || updating) return;

    const user = users.find((item) => item._id === id);
    if (!user) return;

    try {
      const storedUserId = localStorage.getItem("silkverse-user-id");
      if (storedUserId && storedUserId === id) {
        toast.error("You cannot delete your own admin account.");
        return;
      }
    } catch {
      // ignore
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete user "${user.name || "this account"}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(id);
      setError("");

      const token = localStorage.getItem("silkverse-token");
      if (!token) {
        router.replace("/login");
        return;
      }

      await deleteUser(token, id);

      setUsers((prev) => prev.filter((item) => item._id !== id));
      toast.success("User removed successfully.");
    } catch (error: unknown) {
      if (isSessionError(error)) {
        localStorage.removeItem("silkverse-token");
        toast.error("Your session has expired.");
        router.replace("/login");
        return;
      }

      const message =
        error instanceof Error ? error.message : "Failed to delete user.";
      toast.error(message);
    } finally {
      setDeleting("");
    }
  }

  // Filtered list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.mobile || "").includes(searchQuery);

      const matchesRole =
        roleFilter === "all" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const counts = useMemo(() => {
    return {
      all: users.length,
      user: users.filter((u) => u.role === "user").length,
      admin: users.filter((u) => u.role === "admin").length,
    };
  }, [users]);

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7A1F2B] border-t-transparent" />
        <p className="text-sm font-medium text-stone-500">
          Loading Users & Permissions...
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
              Account Management
            </span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#3B151E] sm:text-3xl">
            Customers & Administrators
          </h1>
          <p className="mt-0.5 text-xs text-stone-500">
            View registered user profiles, assign administrative roles, and manage access.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-xs transition hover:bg-stone-50 sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-xs font-medium text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={loadUsers}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Toolbar: Role Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-2">
          {[
            { id: "all", label: "All Accounts", count: counts.all },
            { id: "user", label: "Shoppers / Customers", count: counts.user },
            { id: "admin", label: "Administrators", count: counts.admin },
          ].map((tab) => {
            const active = roleFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-[#7A1F2B] text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    active ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by customer name, email address, or mobile number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-xs text-stone-800 placeholder:text-stone-400 focus:border-[#7A1F2B] focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="mt-3 font-serif text-lg font-bold text-stone-800">
            No matching accounts found
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Try adjusting your search query or role filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 bg-[#FAF9F6] text-stone-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Contact Details
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider">
                    Role & Permissions
                  </th>
                  <th className="px-5 py-3.5 font-semibold uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredUsers.map((user) => {
                  const isUpdatingThis = updating === user._id;
                  const isDeletingThis = deleting === user._id;
                  const isAdmin = user.role === "admin";

                  return (
                    <tr
                      key={user._id}
                      className="transition hover:bg-stone-50/70"
                    >
                      {/* User Avatar + Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isAdmin
                                ? "bg-[#7A1F2B] text-white shadow-xs"
                                : "bg-stone-200 text-stone-700"
                            }`}
                          >
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900">
                              {user.name || "SilkVerse Shopper"}
                            </p>
                            <p className="font-mono text-[10px] text-stone-400">
                              UID: {user._id.slice(-6).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-stone-700">
                            <Mail className="h-3 w-3 text-stone-400" />
                            <span>{user.email || "—"}</span>
                          </div>
                          {user.mobile && (
                            <div className="flex items-center gap-1.5 text-stone-500">
                              <Phone className="h-3 w-3 text-stone-400" />
                              <span>{user.mobile}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role selection */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={user.role}
                            disabled={isUpdatingThis || isDeletingThis}
                            onChange={(e) =>
                              changeRole(user._id, e.target.value as UserRole)
                            }
                            className={`rounded-lg border px-3 py-1 text-xs font-semibold shadow-xs outline-none transition ${
                              isAdmin
                                ? "border-[#D4AF37]/50 bg-amber-50/50 text-[#7A1F2B]"
                                : "border-stone-200 bg-white text-stone-700"
                            }`}
                          >
                            <option value="user">Shopper (Standard)</option>
                            <option value="admin">Administrator (Full Access)</option>
                          </select>

                          {isAdmin && (
                            <span className="flex items-center gap-1 rounded-full bg-[#7A1F2B]/10 px-2 py-0.5 text-[10px] font-bold text-[#7A1F2B]">
                              <ShieldCheck className="h-3 w-3" />
                              Admin
                            </span>
                          )}

                          {isUpdatingThis && (
                            <span className="text-[10px] text-stone-400">
                              Saving...
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => removeUser(user._id)}
                          disabled={isDeletingThis || isUpdatingThis}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 shadow-xs transition hover:bg-rose-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          {isDeletingThis ? "Removing..." : "Delete"}
                        </button>
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