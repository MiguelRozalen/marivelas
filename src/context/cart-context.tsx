
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
  getSubtotal: number;
  getPackagingCost: number;
  getShippingCost: () => number; // Corrected syntax
  getTotalPrice: number;
  isCartLoaded: boolean; // New state to indicate if cart has been loaded from localStorage
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
  getSubtotal: 0,
  getPackagingCost: 0,
  getShippingCost: () => SHIPPING_COST,
  getTotalPrice: 0,
  isCartLoaded: false, // Default to false
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]); // Initialize with empty array
  const [packagingOption, setPackagingOption] = useState<PackagingType>('standard');
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Load cart from localStorage on client-side after mount
  useEffect(() => {
    const localData = localStorage.getItem('marivelasCart');
    if (localData) {
      try {
        setCartItems(JSON.parse(localData));
      } catch (error) {
        console.error("Error parsing cart data from localStorage", error);
        setCartItems([]); // Fallback to empty cart on error
      }
    }
    // Optionally, load packaging option if stored
    const localPackaging = localStorage.getItem('marivelasPackaging');
    if (localPackaging) {
      setPackagingOption(localPackaging as PackagingType);
    }
    setIsCartLoaded(true); // Signal that cart is loaded/attempted to load
  }, []);

  // Save cart and packaging option to localStorage whenever they change
  useEffect(() => {
    if (isCartLoaded) { // Only save after initial load
      localStorage.setItem('marivelasCart', JSON.stringify(cartItems));
      localStorage.setItem('marivelasPackaging', packagingOption);
    }
  }, [cartItems, packagingOption, isCartLoaded]);

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
    setPackagingOption('standard');
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
      const totalCandleUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      return totalCandleUnits * PREMIUM_PACKAGING_COST_PER_ITEM;
    }
    return 0;
  }, [packagingOption, cartItems]);

  const currentShippingCost = useMemo(() => {
    return cartItems.length > 0 ? SHIPPING_COST : 0;
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return subtotal + packagingCost + currentShippingCost;
  }, [subtotal, packagingCost, currentShippingCost]);


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
      getSubtotal: subtotal,
      getPackagingCost: packagingCost,
      getShippingCost: () => currentShippingCost, // Provide a function that returns the memoized value
      getTotalPrice: totalPrice,
      isCartLoaded,
    }}>
      {children}
    </CartContext.Provider>
  );
};
