
// src/components/layout/header.tsx
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu as MenuIcon, LayoutGrid } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

export default function Header() {
  const { cartItems, isCartLoaded } = useContext(CartContext); // Get isCartLoaded
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center group">
          {(() => {
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
            const logoSrc = basePath + '/logo.svg';
            return (
              <Image
                src={logoSrc}
                alt="Marivelas Logo"
                width={30}
                height={30}
                className="h-auto mr-2"
                priority
              />
            );
          })()}
          <span className="text-2xl text-primary font-bold">
            Marivelas
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/#catalog" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium flex items-center">
            <LayoutGrid className="h-5 w-5 mr-1.5" />
            Catálogo
          </Link>
          <Link href="/carrito" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium flex items-center relative">
            <ShoppingCart className="h-5 w-5 mr-1.5" />
            Carrito
            {isCartLoaded && totalItems > 0 && ( // Check isCartLoaded here
              <Badge variant="default" className="absolute -top-2 -right-3 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full">
                {totalItems}
              </Badge>
            )}
          </Link>
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/#catalog" className="flex items-center w-full">
                  <LayoutGrid className="h-5 w-5 mr-2" />
                  Catálogo
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/carrito" className="flex items-center w-full">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Carrito
                  {isCartLoaded && totalItems > 0 && ( // Check isCartLoaded here
                    <Badge variant="default" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full">
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
