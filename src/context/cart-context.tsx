
// src/context/cart-context.tsx
"use client";

import type { Candle, CartItemType, PackagingType } from '@/types';
import type { CandleColorOption } from '@/config/candle-options';
import React, { createContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { STANDARD_PACKAGING_COST, PREMIUM_PACKAGING_COST_PER_ITEM, SHIPPING_COST } from '@/config/constants';

interface CartContextType {
  cartItems: CartItemType[];
  packagingOption: PackagingType;
  addToCart: (candle: Candle, color: CandleColorOption) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updatePackagingOption: (option: PackagingType) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: number; // Changed from () => number
  getPackagingCost: number; // Changed from () => number
  getShippingCost: () => number;
  getTotalPrice: number; // Changed from () => number
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  packagingOption: 'standard',
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  updatePackagingOption: () => {},
  clearCart: () => {},
  getItemCount: () => 0,
  getSubtotal: 0, // Default value
  getPackagingCost: 0, // Default value
  getShippingCost: () => SHIPPING_COST, // Fixed for now
  getTotalPrice: 0, // Default value
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

  const [packagingOption, setPackagingOption] = useState<PackagingType>('standard');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('marivelasCart', JSON.stringify(cartItems));
      // We could also store packagingOption in localStorage if needed
    }
  }, [cartItems]);

  const addToCart = (candle: Candle, color: CandleColorOption) => {
    setCartItems(prevItems => {
      const itemId = `${candle.id}-${color.value}`;
      const existingItem = prevItems.find(item => item.id === itemId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { id: itemId, candle, color, quantity: 1 }];
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

  const updatePackagingOption = (option: PackagingType) => {
    setPackagingOption(option);
  };

  const clearCart = () => {
    setCartItems([]);
    setPackagingOption('standard'); // Reset packaging on clear
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.candle.price * item.quantity, 0);
  }, [cartItems]);

  const packagingCost = useMemo(() => {
    if (packagingOption === 'standard') {
      return cartItems.length > 0 ? STANDARD_PACKAGING_COST : 0;
    }
    if (packagingOption === 'premium') {
      const totalItems = getItemCount(); // Call getItemCount directly
      return totalItems * PREMIUM_PACKAGING_COST_PER_ITEM;
    }
    return 0;
  }, [packagingOption, cartItems, getItemCount]); // getItemCount is a dependency if it's not stable

  const getShippingCost = () => {
    return cartItems.length > 0 ? SHIPPING_COST : 0; // Only apply shipping if there are items
  };

  const totalPrice = useMemo(() => {
    // Use the memoized values directly
    return subtotal + packagingCost + getShippingCost();
  }, [subtotal, packagingCost, getShippingCost]); // getShippingCost is a dependency


  return (
    <CartContext.Provider value={{ 
      cartItems, 
      packagingOption,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      updatePackagingOption,
      clearCart, 
      getItemCount, 
      getSubtotal: subtotal, // Pass the value
      getPackagingCost: packagingCost, // Pass the value
      getShippingCost, // Pass the function
      getTotalPrice: totalPrice // Pass the value
    }}>
      {children}
    </CartContext.Provider>
  );
};
