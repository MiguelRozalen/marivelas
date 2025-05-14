// src/app/carrito/page.tsx
"use client";

import CartDisplay from "@/components/cart-display";

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Removed title: <h1 className="text-3xl font-bold text-center mb-10 text-foreground">Tu Carrito de Compras</h1> */}
      <CartDisplay />
    </div>
  );
}
