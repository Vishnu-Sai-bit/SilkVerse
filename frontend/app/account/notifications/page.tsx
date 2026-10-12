"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Package,
  Sparkles,
  ShieldCheck,
  Tag,
  Check,
  Sliders,
  Clock,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useNotifications, NotificationItem } from "@/context/NotificationContext";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    prefs,
    togglePreference,
  } = useNotifications();

  const handleMarkAllRead = () => {
    markAllAsRead();
    toast.success("All notifications marked as read.");
  };

  const handleClearAll = () => {
    clearAll();
    toast.success("Notification inbox cleared.");
  };

  const handleTogglePref = (key: keyof typeof prefs) => {
    togglePreference(key);
    toast.success("Notification preferences updated.");
  };

  const getCategoryIcon = (cat: NotificationItem["category"]) => {
    switch (cat) {
      case "order":
        return <Package size={16} className="text-[#6D001A]" />;
      case "offer":
        return <Tag size={16} className="text-[#D4AF37]" />;
      case "security":
        return <ShieldCheck size={16} className="text-emerald-700" />;
      default:
        return <Sparkles size={16} className="text-amber-700" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6D001A]">
            <Bell size={15} />
            <span>Activity &amp; Communications</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2A26] mt-1">
            Notifications
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Stay informed with real-time updates regarding your saree dispatches, artisan drops, and vouchers.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 hover:border-[#6D001A] hover:text-[#6D001A] transition cursor-pointer"
              >
                <Check size={14} />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1 rounded-xl text-stone-400 hover:text-red-600 px-2 py-2 text-xs transition cursor-pointer"
              title="Clear All Notifications"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        <h3 className="font-serif text-base font-bold text-[#2D2A26] flex items-center justify-between">
          <span>Recent Updates</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-[#6D001A] px-2.5 py-0.5 text-[10px] font-bold text-white">
              {unreadCount} Unread
            </span>
          )}
        </h3>

        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-200 p-10 text-center text-xs text-stone-500">
            <Bell size={28} className="mx-auto text-stone-300 mb-2" />
            <p className="font-bold text-stone-700">No new notifications</p>
            <p className="text-stone-400 mt-0.5">You are completely up to date.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`p-4 sm:p-5 transition flex items-start gap-4 ${
                  !n.read ? "bg-amber-50/25 cursor-pointer" : "hover:bg-stone-50/50"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getCategoryIcon(n.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-serif text-sm font-bold text-[#2D2A26] truncate">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-mono shrink-0">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={() => !n.read && markAsRead(n.id)}
                      className="inline-block text-xs font-bold text-[#6D001A] hover:underline mt-2"
                    >
                      View Details →
                    </Link>
                  )}
                </div>

                {!n.read && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[#6D001A] shrink-0 mt-2"
                    title="Unread notification"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NOTIFICATION PREFERENCES */}
      <div className="rounded-2xl border border-stone-200 bg-[#FAF9F6] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-[#6D001A]" />
          <h3 className="font-serif text-base font-bold text-[#2D2A26]">
            Delivery Preferences
          </h3>
        </div>

        <div className="divide-y divide-stone-200/80 bg-white rounded-xl border border-stone-200 text-xs">
          <div className="flex items-center justify-between p-4">
            <div>
              <h5 className="font-bold text-stone-800">Order Dispatch &amp; Tracking on WhatsApp</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">Receive immediate live delivery updates and courier tracking URLs directly on your mobile.</p>
            </div>
            <button
              type="button"
              onClick={() => handleTogglePref("orderWhatsapp")}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                prefs.orderWhatsapp ? "bg-[#6D001A]" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  prefs.orderWhatsapp ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <h5 className="font-bold text-stone-800">Official Order Invoice &amp; Silk Mark Certificate (Email)</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">Automated PDF tax invoices and government authentication certificates delivered to your email.</p>
            </div>
            <button
              type="button"
              onClick={() => handleTogglePref("orderEmail")}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                prefs.orderEmail ? "bg-[#6D001A]" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  prefs.orderEmail ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <h5 className="font-bold text-stone-800">Festive Offers &amp; Private Drop Invitations</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">Receive early VIP invitations for Diwali, Sankranti, and wedding season bridal drops.</p>
            </div>
            <button
              type="button"
              onClick={() => handleTogglePref("promotionsEmail")}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                prefs.promotionsEmail ? "bg-[#6D001A]" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  prefs.promotionsEmail ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
