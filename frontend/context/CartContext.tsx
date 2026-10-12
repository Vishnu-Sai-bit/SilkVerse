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
import { getProducts } from "@/services/api";

// ======================================
// Types
// ======================================

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
  color?: string;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;

  removeFromCart: (id: string) => void;

  clearCart: () => void;

  cartCount: number;

  subtotal: number;

  shipping: number;

  tax: number;

  total: number;

  finalAmount: number;
};

// ======================================
// Context
// ======================================

const CartContext =
  createContext<CartContextType | undefined>(undefined);

// ======================================
// Storage Helpers
// ======================================

const getCartStorageKey = (userId: string) => {
  return `silkverse-cart-${userId}`;
};

// ======================================
// Cart Sanitizer
// ======================================

function sanitizeCart(parsedCart: unknown): CartItem[] {
  if (!Array.isArray(parsedCart)) {
    return [];
  }

  return parsedCart
    .filter((item) => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const cartItem = item as Partial<CartItem>;

      return (
        typeof cartItem._id === "string" &&
        cartItem._id.length > 0 &&
        typeof cartItem.name === "string" &&
        Number.isFinite(Number(cartItem.price)) &&
        Number(cartItem.price) >= 0 &&
        Number.isInteger(Number(cartItem.quantity)) &&
        Number(cartItem.quantity) > 0
      );
    })
    .map((item) => {
      const cartItem = item as CartItem;

      return {
        ...cartItem,
        price: Number(cartItem.price),
        quantity: Number(cartItem.quantity),
        stock:
          cartItem.stock !== undefined
            ? Number(cartItem.stock)
            : undefined,
      };
    });
}

// ======================================
// Provider
// ======================================

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);

  // ======================================
  // Current User ID
  // ======================================

  const userId = user?.id ?? null;

  // ======================================
  // Load Current User Cart
  // ======================================

  useEffect(() => {
    // Wait until authentication is fully restored.
    if (authLoading) {
      return;
    }

    // No logged-in user.
    // Keep active cart empty but DO NOT
    // delete saved carts.
    if (!userId) {
      setCart([]);
      return;
    }

    const storageKey = getCartStorageKey(userId);

    try {
      const storedCart =
        localStorage.getItem(storageKey);

      if (!storedCart) {
        setCart([]);
        return;
      }

      const parsedCart = JSON.parse(storedCart);

      const validCart =
        sanitizeCart(parsedCart);

      setCart(validCart);

      // Sync cart items with live backend catalog so images & IDs stay fresh
      if (validCart.length > 0) {
        getProducts({ limit: 200 })
          .then((products) => {
            if (!Array.isArray(products) || products.length === 0) return;

            setCart((prevCart) =>
              prevCart.map((cItem) => {
                const matched =
                  products.find((p: any) => p._id === cItem._id) ||
                  products.find(
                    (p: any) =>
                      typeof p.name === "string" &&
                      p.name.toLowerCase() === cItem.name.toLowerCase()
                  );
                if (!matched) return cItem;
                const latestImage =
                  matched.image ||
                  (Array.isArray(matched.images) && matched.images[0]) ||
                  cItem.image;
                return {
                  ...cItem,
                  _id: matched._id || cItem._id,
                  image: latestImage,
                  price: Number(matched.price) || cItem.price,
                  stock:
                    matched.stock !== undefined
                      ? Number(matched.stock)
                      : cItem.stock,
                };
              })
            );
          })
          .catch(() => {
            // Non-blocking fallback
          });
      }
    } catch (error) {
      console.error(
        "Failed to load user cart:",
        error
      );

      // Remove only the corrupted cart
      // belonging to this user.
      try {
        localStorage.removeItem(storageKey);
      } catch (storageError) {
        console.error(
          "Failed to remove corrupted cart:",
          storageError
        );
      }

      setCart([]);
    }
  }, [authLoading, userId]);

  // ======================================
  // Save Current User Cart
  // ======================================

  useEffect(() => {
    // Do not save while authentication
    // is still being restored.
    if (authLoading) {
      return;
    }

    // Logged-out users have no active cart.
    if (!userId) {
      return;
    }

    try {
      const storageKey =
        getCartStorageKey(userId);

      localStorage.setItem(
        storageKey,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Failed to save user cart:",
        error
      );
    }
  }, [cart, userId, authLoading]);

  // ======================================
  // Add To Cart
  // ======================================

  const addToCart = (item: CartItem) => {
    // Cart belongs to logged-in users.
    if (!userId) {
      return;
    }

    if (!item._id) {
      return;
    }

    const requestedQuantity =
      Number(item.quantity);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return;
    }

    setCart((prev) => {
      const existingIndex =
        prev.findIndex(
          (product) =>
            product._id === item._id
        );

      // ====================================
      // Existing Product
      // ====================================

      if (existingIndex !== -1) {
        const existing =
          prev[existingIndex];

        const knownStock =
          item.stock ??
          existing.stock;

        const requestedTotal =
          existing.quantity +
          requestedQuantity;

        let newQuantity =
          requestedTotal;

        if (
          knownStock !== undefined &&
          Number.isFinite(Number(knownStock))
        ) {
          newQuantity = Math.min(
            requestedTotal,
            Math.max(
              Number(knownStock),
              0
            )
          );
        }

        // Do not allow an invalid quantity.
        if (newQuantity < 1) {
          return prev;
        }

        const updatedCart = [...prev];

        updatedCart[existingIndex] = {
          ...existing,
          name: item.name,
          price: Number(item.price),
          image: item.image,
          stock:
            knownStock !== undefined
              ? Number(knownStock)
              : existing.stock,
          quantity: newQuantity,
        };

        return updatedCart;
      }

      // ====================================
      // New Product
      // ====================================

      const knownStock =
        item.stock !== undefined
          ? Number(item.stock)
          : undefined;

      if (
        knownStock !== undefined &&
        Number.isFinite(knownStock) &&
        knownStock <= 0
      ) {
        return prev;
      }

      const safeQuantity =
        knownStock !== undefined &&
        Number.isFinite(knownStock)
          ? Math.min(
              requestedQuantity,
              knownStock
            )
          : requestedQuantity;

      if (safeQuantity < 1) {
        return prev;
      }

      return [
        ...prev,
        {
          ...item,
          price: Number(item.price),
          quantity: safeQuantity,
        },
      ];
    });
  };

  // ======================================
  // Increase Quantity
  // ======================================

  const increaseQuantity = (id: string) => {
    if (!userId) {
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item._id !== id) {
          return item;
        }

        if (item.stock !== undefined) {
          const stock =
            Number(item.stock);

          if (
            !Number.isFinite(stock) ||
            stock <= 0 ||
            item.quantity >= stock
          ) {
            return item;
          }
        }

        return {
          ...item,
          quantity:
            item.quantity + 1,
        };
      })
    );
  };

  // ======================================
  // Decrease Quantity
  // ======================================

  const decreaseQuantity = (id: string) => {
    if (!userId) {
      return;
    }

    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id !== id) {
            return item;
          }

          return {
            ...item,
            quantity:
              Math.max(
                item.quantity - 1,
                0
              ),
          };
        })
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  // ======================================
  // Remove Item
  // ======================================

  const removeFromCart = (id: string) => {
    if (!userId) {
      return;
    }

    setCart((prev) =>
      prev.filter(
        (item) =>
          item._id !== id
      )
    );
  };

  // ======================================
  // Clear Cart
  // ======================================

  const clearCart = () => {
    setCart([]);

    if (!userId) {
      return;
    }

    try {
      localStorage.removeItem(
        getCartStorageKey(userId)
      );
    } catch (error) {
      console.error(
        "Failed to clear user cart:",
        error
      );
    }
  };

  // ======================================
  // Cart Count
  // ======================================

  const cartCount = useMemo(() => {
    if (!userId) {
      return 0;
    }

    return cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cart, userId]);

  // ======================================
  // Subtotal
  // ======================================

  const subtotal = useMemo(() => {
    if (!userId) {
      return 0;
    }

    return cart.reduce(
      (total, item) => {
        const price =
          Number(item.price) || 0;

        const quantity =
          Number(item.quantity) || 0;

        return (
          total +
          price * quantity
        );
      },
      0
    );
  }, [cart, userId]);

  // ======================================
  // Shipping (Free at ₹1,000+, ₹100 below ₹1,000 for non-empty carts)
  // ======================================
  const shipping =
    subtotal > 0 && subtotal < 1000
      ? 100
      : 0;

  // ======================================
  // GST
  // ======================================

  const tax = Math.round(
    subtotal * 0.05
  );

  // ======================================
  // Final Amount
  // ======================================

  const finalAmount =
    subtotal +
    shipping +
    tax;

  // ======================================
  // Total
  // ======================================

  const total = finalAmount;

  // ======================================
  // Provider
  // ======================================

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,

        cartCount,

        subtotal,

        shipping,

        tax,

        total,

        finalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ======================================
// useCart Hook
// ======================================

const defaultCartContext: CartContextType = {
  cart: [],
  cartCount: 0,
  subtotal: 0,
  shipping: 0,
  tax: 0,
  finalAmount: 0,
  total: 0,
  addToCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    return defaultCartContext;
  }

  return context;
}