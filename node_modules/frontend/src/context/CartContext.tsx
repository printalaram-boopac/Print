import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface CartItem {
  id: string;
  templateId: number;
  title: string;
  image: string;
  theme: string;
  occasion: string;
  coupleName: string;
  familyName: string;
  greetingText: string;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    const id = `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    // Apply user pricing tiers: 50 qty -> 13, 100 qty -> 12, 200 qty -> 13
    let calculatedPrice = item.unitPrice;
    if (item.quantity <= 50) calculatedPrice = 13;
    else if (item.quantity <= 100) calculatedPrice = 12;
    else calculatedPrice = 13;

    setItems((prev) => [...prev, { ...item, unitPrice: calculatedPrice, id }]);
    setCartOpen(true); // Open cart drawer when item added
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let calculatedPrice = item.unitPrice;
          if (quantity <= 50) calculatedPrice = 13;
          else if (quantity <= 100) calculatedPrice = 12;
          else calculatedPrice = 13;
          return { ...item, quantity, unitPrice: calculatedPrice };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCartOpen(false);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount, isCartOpen, setCartOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
