"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";

export interface NotificationItem {
  id: string;
  category: "order" | "offer" | "security" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export interface NotificationPreferences {
  orderWhatsapp: boolean;
  orderEmail: boolean;
  promotionsEmail: boolean;
  silkClubSms: boolean;
}

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    category: "order",
    title: "Silk Mark Certificate Ready",
    message: "The government-accredited Silk Mark authenticity certificate for your recent order is available to view.",
    time: "2 hours ago",
    read: false,
    link: "/orders",
  },
  {
    id: "notif_2",
    category: "offer",
    title: "Festive Silk Discount Active",
    message: "Coupon code FESTIVE15 is active. Enjoy Flat 15% off on our handloom bridal collection today.",
    time: "Yesterday",
    read: false,
    link: "/offers",
  },
  {
    id: "notif_3",
    category: "security",
    title: "Google Authentication Successful",
    message: "Your SilkVerse account was accessed via Google Single Sign-On from Chrome on Windows.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "notif_4",
    category: "system",
    title: "Gold Weave Membership Unlocked",
    message: "Welcome to our Gold Weave loyalty tier. Enjoy priority weaving and complimentary doorstep insurance.",
    time: "1 week ago",
    read: true,
    link: "/account/rewards",
  },
];

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  orderWhatsapp: true,
  orderEmail: true,
  promotionsEmail: true,
  silkClubSms: false,
};

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isInitialized: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  prefs: NotificationPreferences;
  togglePreference: (key: keyof NotificationPreferences) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [isInitialized, setIsInitialized] = useState(false);

  const storageKey = user?.id
    ? `silkverse-notifications-${user.id}`
    : "silkverse-notifications";

  const prefsKey = user?.id
    ? `silkverse-notif-prefs-${user.id}`
    : "silkverse-notif-prefs";

  // Load from localStorage on mount or when user changes
  useEffect(() => {
    if (authLoading) return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        } else {
          setNotifications(DEFAULT_NOTIFICATIONS);
          localStorage.setItem(storageKey, JSON.stringify(DEFAULT_NOTIFICATIONS));
        }
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
        localStorage.setItem(storageKey, JSON.stringify(DEFAULT_NOTIFICATIONS));
      }
    } catch (err) {
      console.error("Failed to load notifications from storage:", err);
      setNotifications(DEFAULT_NOTIFICATIONS);
    }

    try {
      const savedPrefs = localStorage.getItem(prefsKey);
      if (savedPrefs !== null) {
        setPrefs(JSON.parse(savedPrefs));
      } else {
        setPrefs(DEFAULT_PREFERENCES);
      }
    } catch (err) {
      console.error("Failed to load notification preferences:", err);
      setPrefs(DEFAULT_PREFERENCES);
    }

    setIsInitialized(true);
  }, [storageKey, prefsKey, authLoading]);

  // Synchronize across tabs/windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setNotifications(parsed);
          }
        } catch {
          // ignore
        }
      }
      if (e.key === prefsKey && e.newValue) {
        try {
          setPrefs(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey, prefsKey]);

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save notification read state:", err);
      }
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save notifications mark all read:", err);
      }
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    try {
      localStorage.setItem(storageKey, JSON.stringify([]));
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(prefsKey, JSON.stringify(next));
      } catch (err) {
        console.error("Failed to save notification preferences:", err);
      }
      return next;
    });
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isInitialized,
        markAsRead,
        markAllAsRead,
        clearAll,
        prefs,
        togglePreference,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
