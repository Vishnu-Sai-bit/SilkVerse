export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (productId: string) => void;

  increaseQuantity: (productId: string) => void;

  decreaseQuantity: (productId: string) => void;

  clearCart: () => void;

  subtotal: number;

  shipping: number;

  tax: number;

  total: number;
}