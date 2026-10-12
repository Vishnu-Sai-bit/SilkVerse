"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/services/api";

import { Address } from "@/types/address";

import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

import { MapPin, Plus } from "lucide-react";

// =====================================
// Types
// =====================================

type AddressFormData = Omit<Address, "_id">;

// =====================================
// Address List
// =====================================

export default function AddressList() {
  const { token } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [defaultId, setDefaultId] =
    useState<string | null>(null);

  // =====================================
  // Load Addresses
  // =====================================

  const loadAddresses = useCallback(async () => {
    if (!token) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getAddresses(token);

      setAddresses(data ?? []);
    } catch (error: unknown) {
      console.error(
        "Failed to load addresses:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load addresses."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // =====================================
  // Add / Update Address
  // =====================================

  async function handleAddOrUpdate(
    data: AddressFormData
  ) {
    if (
      !token ||
      saving ||
      deletingId ||
      defaultId
    ) {
      return;
    }

    try {
      setSaving(true);

      if (editingAddress) {
        await updateAddress(
          token,
          editingAddress._id,
          data
        );

        toast.success(
          "Address updated successfully."
        );
      } else {
        await addAddress(token, data);

        toast.success(
          "Address added successfully."
        );
      }

      setEditingAddress(null);
      setShowForm(false);

      await loadAddresses();
    } catch (error: unknown) {
      console.error(
        "Failed to save address:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save address."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================
  // Delete Address
  // =====================================

  async function handleDelete(id: string) {
    if (
      !token ||
      saving ||
      deletingId ||
      defaultId
    ) {
      return;
    }

    const address = addresses.find(
      (item) => item._id === id
    );

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${
        address
          ? `the address for ${address.fullName}`
          : "this address"
      }?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteAddress(token, id);

      toast.success(
        "Address deleted successfully."
      );

      if (editingAddress?._id === id) {
        setEditingAddress(null);
        setShowForm(false);
      }

      await loadAddresses();
    } catch (error: unknown) {
      console.error(
        "Failed to delete address:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete address."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================
  // Set Default Address
  // =====================================

  async function handleSetDefault(id: string) {
    if (
      !token ||
      saving ||
      deletingId ||
      defaultId
    ) {
      return;
    }

    try {
      setDefaultId(id);

      await setDefaultAddress(token, id);

      toast.success(
        "Default address updated."
      );

      await loadAddresses();
    } catch (error: unknown) {
      console.error(
        "Failed to set default address:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to set default address."
      );
    } finally {
      setDefaultId(null);
    }
  }

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#7A1F2B]" />

        <p className="mt-5 font-medium text-gray-500">
          Loading your addresses...
        </p>
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="space-y-8">

      {/* =====================================
          Saved Addresses Header
      ===================================== */}

      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#7A1F2B]">
              Saved Addresses
            </h2>

            {addresses.length > 0 && (
              <span className="rounded-full bg-[#FDF4E8] px-3 py-1 text-sm font-semibold text-[#7A1F2B]">
                {addresses.length}
              </span>
            )}
          </div>

          <p className="mt-1 text-gray-500">
            Manage your delivery addresses.
          </p>
        </div>

        <button
          type="button"
          disabled={
            saving ||
            Boolean(deletingId) ||
            Boolean(defaultId)
          }
          onClick={() => {
            setEditingAddress(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#7A1F2B] px-5 py-3 font-medium text-white transition hover:bg-[#651923] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          Add Address
        </button>
      </div>

      {/* =====================================
          Address Form
      ===================================== */}

      {showForm && (
        <AddressForm
          initialData={editingAddress}
          onSubmit={handleAddOrUpdate}
          onCancel={() => {
            if (saving) {
              return;
            }

            setEditingAddress(null);
            setShowForm(false);
          }}
        />
      )}

      {/* =====================================
          Empty State
      ===================================== */}

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FDF4E8]">
            <MapPin
              size={40}
              className="text-[#7A1F2B]"
            />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-gray-800">
            No Saved Addresses
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Add your first delivery address to make
            checkout faster and easier.
          </p>

          {!showForm && (
            <button
              type="button"
              disabled={
                saving ||
                Boolean(deletingId) ||
                Boolean(defaultId)
              }
              onClick={() => {
                setEditingAddress(null);
                setShowForm(true);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#7A1F2B] px-6 py-3 font-medium text-white transition hover:bg-[#651923] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />
              Add Your First Address
            </button>
          )}
        </div>
      ) : (

        /* =====================================
           Address Cards
        ===================================== */

        <div className="grid gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={(selectedAddress) => {
                if (
                  saving ||
                  deletingId ||
                  defaultId
                ) {
                  return;
                }

                setEditingAddress(
                  selectedAddress
                );

                setShowForm(true);
              }}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
}