// src/components/layout/header.tsx
"use client";
import Link from 'next/link';
import { Flame, ShoppingCart } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const { cartItems } = useContext(CartContext);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-card shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center group">
          <Flame className="h-8 w-8 text-primary mr-2" />
          <span className="text-2xl text-primary font-bold">
            Marivelas
          </span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/#catalog" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
            Catálogo
          </Link>
          <Link href="/carrito" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium flex items-center relative">
            <ShoppingCart className="h-5 w-5 mr-1" />
            Carrito
            {totalItems > 0 && (
              <Badge variant="default" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
