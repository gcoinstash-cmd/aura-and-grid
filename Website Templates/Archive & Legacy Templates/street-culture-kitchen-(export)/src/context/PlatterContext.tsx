import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "../data/menuData";

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

export const ADD_ONS: AddOnOption[] = [
  { id: "extra_base", name: "Double Filling Premium", price: 4.00 },
  { id: "truffle_dust", name: "Smoked Truffle Dust", price: 1.50 },
  { id: "wild_crema", name: "Wild Cilantro Crema", price: 0.75 }
];

export interface CartItem {
  id: string; // unique item composition signature
  menuItem: MenuItem;
  selectedAddOns: string[];
  quantity: number;
  singleItemPrice: number; // base price + addons sum
}

interface PlatterContextType {
  cart: CartItem[];
  addToPlatter: (item: MenuItem, selectedAddOnIds?: string[], qty?: number) => void;
  removeFromPlatter: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearPlatter: () => void;
  isPlatterOpen: boolean;
  setIsPlatterOpen: (open: boolean) => void;
  totalPrice: number;
}

const PlatterContext = createContext<PlatterContextType | undefined>(undefined);

export const PlatterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPlatterOpen, setIsPlatterOpen] = useState(false);

  // Load from local persistency
  useEffect(() => {
    const saved = localStorage.getItem("culinary_platter_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (err) {
        console.warn("Platter local telemetry corrupted, clearing cache.", err);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("culinary_platter_cart", JSON.stringify(newCart));
  };

  const addToPlatter = (item: MenuItem, selectedAddOnIds: string[] = [], qty = 1) => {
    const sortedAddOns = [...selectedAddOnIds].sort();
    const cartItemId = `${item.id}-${sortedAddOns.join("_")}`;

    const addOnCost = ADD_ONS
      .filter((ao) => sortedAddOns.includes(ao.id))
      .reduce((sum, ao) => sum + ao.price, 0);
    const singleItemPrice = item.price + addOnCost;

    const existingIndex = cart.findIndex((ci) => ci.id === cartItemId);
    const newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + qty
      };
    } else {
      newCart.push({
        id: cartItemId,
        menuItem: item,
        selectedAddOns: sortedAddOns,
        quantity: qty,
        singleItemPrice
      });
    }

    saveCart(newCart);
  };

  const removeFromPlatter = (cartItemId: string) => {
    const newCart = cart.filter((ci) => ci.id !== cartItemId);
    saveCart(newCart);
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromPlatter(cartItemId);
      return;
    }
    const newCart = cart.map((ci) => (ci.id === cartItemId ? { ...ci, quantity: newQty } : ci));
    saveCart(newCart);
  };

  const clearPlatter = () => {
    saveCart([]);
  };

  const totalPrice = cart.reduce((sum, ci) => sum + ci.singleItemPrice * ci.quantity, 0);

  return (
    <PlatterContext.Provider
      value={{
        cart,
        addToPlatter,
        removeFromPlatter,
        updateQuantity,
        clearPlatter,
        isPlatterOpen,
        setIsPlatterOpen,
        totalPrice
      }}
    >
      {children}
    </PlatterContext.Provider>
  );
};

export const usePlatter = () => {
  const ctx = useContext(PlatterContext);
  if (!ctx) {
    throw new Error("usePlatter must be utilized within a PlatterProvider");
  }
  return ctx;
};
