"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Package,
  Tag,
  ShieldCheck,
  Sparkles,
  CheckCheck,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { useNotifications, NotificationItem } from "@/context/NotificationContext";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMarkAllRead = () => {
    markAllAsRead();
    toast.success("All notifications marked as read");
  };

  const handleItemClick = (id: string) => {
    markAsRead(id);
    setIsOpen(false);
  };

  const getCategoryIcon = (category: NotificationItem["category"]) => {
    switch (category) {
      case "order":
        return <Package size={15} className="text-[#6D001A]" />;
      case "offer":
        return <Tag size={15} className="text-[#D4AF37]" />;
      case "security":
        return <ShieldCheck size={15} className="text-emerald-700" />;
      default:
        return <Sparkles size={15} className="text-amber-700" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-amber-50 hover:text-[#6D001A] text-[#2D2A26] cursor-pointer"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6D001A] text-[10px] font-bold text-white shadow-xs border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="fixed inset-x-3 top-[4.5rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white shadow-2xl border border-[#D4AF37]/35 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#FAF8F5] border-b border-[#E8E4DF]">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-[#6D001A]" />
              <h3 className="font-serif text-sm font-bold text-[#6D001A]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#6D001A]/10 text-[#6D001A] px-2 py-0.5 text-[10px] font-bold">
                  {unreadCount} New
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#6D001A] hover:underline cursor-pointer"
              >
                <CheckCheck size={13} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#E8E4DF]/60">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500">
                <Bell size={24} className="mx-auto text-gray-300 mb-2" />
                <p>No notifications right now.</p>
              </div>
            ) : (
              notifications.map((item) => {
                const ItemContent = (
                  <div
                    className={`flex items-start gap-3 p-3.5 transition hover:bg-[#FFF8F0]/70 cursor-pointer ${
                      !item.read ? "bg-[#FFF8F0]/40" : ""
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#E8E4DF] shadow-2xs mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-xs truncate ${
                            !item.read
                              ? "font-bold text-[#2D2A26]"
                              : "font-semibold text-gray-700"
                          }`}
                        >
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#6D001A] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {item.time}
                      </span>
                    </div>
                  </div>
                );

                if (item.link) {
                  return (
                    <Link
                      key={item.id}
                      href={item.link}
                      onClick={() => handleItemClick(item.id)}
                      className="block"
                    >
                      {ItemContent}
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="block"
                  >
                    {ItemContent}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#FAF8F5] border-t border-[#E8E4DF] text-center">
            <Link
              href="/account/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#6D001A] hover:underline py-1"
            >
              <span>View All Notifications</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
