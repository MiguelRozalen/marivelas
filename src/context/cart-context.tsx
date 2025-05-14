// src/context/cart-context.tsx
"use client";

import type { Candle, CartItemType } from '@/types';
import type { CandleColorOption } from '@/config/candle-options';
import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface CartContextType {
  cartItems: CartItemType[];
  addToCart: (candle: Candle, color: CandleColorOption) => void; // Quantity removed from signature
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getItemCount: () => 0,
  getTotalPrice: () => 0,
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('marivelasCart');
      return localData ? JSON.parse(localData) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('marivelasCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Updated addToCart logic: if item exists, increment quantity, else add with quantity 1
  const addToCart = (candle: Candle, color: CandleColorOption) => {
    setCartItems(prevItems => {
      const itemId = `${candle.id}-${color.value}`;
      const existingItem = prevItems.find(item => item.id === itemId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 } // Increment quantity
            : item
        );
      }
      return [...prevItems, { id: itemId, candle, color, quantity: 1 }]; // Add new item with quantity 1
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.candle.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getItemCount, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
