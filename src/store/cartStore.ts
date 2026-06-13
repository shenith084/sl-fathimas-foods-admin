import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
  weight: string;
  vacuum: boolean; // Custom Sri Lankan export vacuum option (+50 LKR)
  description?: string; // Used for custom bundles/gift packs
  subItems?: { id: string; qty: number }[]; // Track IDs of items inside bundles for stock management
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string, vacuum: boolean) => void;
  updateQty: (id: string, vacuum: boolean, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.id === item.id && i.vacuum === item.vacuum
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].qty += qty;
            return { items: updatedItems };
          }

          return { items: [...state.items, { ...item, qty }] };
        });
      },

      removeItem: (id, vacuum) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.vacuum === vacuum)),
        }));
      },

      updateQty: (id, vacuum, qty) => {
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id && i.vacuum === vacuum ? { ...i, qty } : i))
            .filter((i) => i.qty > 0),
        }));
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          const itemPrice = item.price + (item.vacuum ? 50 : 0);
          return total + itemPrice * item.qty;
        }, 0);
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.qty, 0);
      },
    }),
    {
      name: "sl-fathimas-cart-storage",
    }
  )
);
